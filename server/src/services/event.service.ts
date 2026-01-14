import prisma from "../config/database";
import {
  CreateEventInput,
  UpdateEventInput,
  ListEventsQuery,
} from "../validators/event";
import { notFound, forbidden, badRequest } from "../middleware/errorHandler";

// Create event
export const createEvent = async (
  organizerId: string,
  data: CreateEventInput
) => {
  const { ticketTypes, startDate, endDate, ...eventData } = data;

  // Validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end <= start) {
    throw badRequest("End date must be after start date");
  }

  if (start < new Date()) {
    throw badRequest("Event cannot start in the past");
  }

  // Check user role and upgrade to ORGANIZER if needed
  const user = await prisma.user.findUnique({
    where: { id: organizerId },
    select: { role: true },
  });

  if (!user) {
    throw notFound("User");
  }

  // If user is not an organizer or admin, upgrade them to organizer
  if (user.role === "USER") {
    await prisma.user.update({
      where: { id: organizerId },
      data: { role: "ORGANIZER" },
    });
  }

  // Create event with ticket types
  const event = await prisma.event.create({
    data: {
      ...eventData,
      startDate: start,
      endDate: end,
      organizerId,
      ticketTypes: {
        create: ticketTypes.map((tt) => ({
          name: tt.name,
          description: tt.description,
          price: tt.price,
          type: tt.type,
          total: tt.total,
          available: tt.total,
          benefits: tt.benefits || [],
        })),
      },
    },
    include: {
      ticketTypes: true,
      organizer: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          profileImage: true,
          role: true, // Include role so client can update their state
        },
      },
    },
  });

  return event;
};

// Get event by ID
export const getEventById = async (eventId: string) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      ticketTypes: true,
      organizer: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          profileImage: true,
        },
      },
      _count: {
        select: { tickets: true },
      },
    },
  });

  if (!event) {
    throw notFound("Event");
  }

  return event;
};

// List events with pagination and filters
export const listEvents = async (query: ListEventsQuery) => {
  const { page, limit, category, search, startDate, endDate, status } = query;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (category) {
    where.category = category;
  }

  if (status) {
    where.status = status;
  } else {
    // Default to published only for public listings
    where.status = "PUBLISHED";
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
    ];
  }

  if (startDate) {
    where.startDate = { gte: new Date(startDate) };
  }

  if (endDate) {
    where.endDate = { lte: new Date(endDate) };
  }

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy: { startDate: "asc" },
      include: {
        ticketTypes: true,
        organizer: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
          },
        },
        _count: {
          select: { tickets: true },
        },
      },
    }),
    prisma.event.count({ where }),
  ]);

  return {
    events,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get upcoming events
export const getUpcomingEvents = async (limit: number = 10) => {
  const events = await prisma.event.findMany({
    where: {
      startDate: { gte: new Date() },
      status: "PUBLISHED",
      soldOut: false,
    },
    orderBy: { startDate: "asc" },
    take: limit,
    include: {
      ticketTypes: true,
      organizer: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
        },
      },
    },
  });

  return events;
};

// Get recent events
export const getRecentEvents = async (limit: number = 6) => {
  const events = await prisma.event.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      ticketTypes: true,
      organizer: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
        },
      },
    },
  });

  return events;
};

// Update event
export const updateEvent = async (
  eventId: string,
  userId: string,
  userRole: string,
  data: UpdateEventInput
) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { organizerId: true },
  });

  if (!event) {
    throw notFound("Event");
  }

  // Check ownership
  if (event.organizerId !== userId && userRole !== "ADMIN") {
    throw forbidden("You can only update your own events");
  }

  const { ticketTypes, startDate, endDate, ...eventData } = data;

  const updateData: any = { ...eventData };

  if (startDate) {
    updateData.startDate = new Date(startDate);
  }

  if (endDate) {
    updateData.endDate = new Date(endDate);
  }

  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: updateData,
    include: {
      ticketTypes: true,
      organizer: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
        },
      },
    },
  });

  return updatedEvent;
};

// Delete event
export const deleteEvent = async (
  eventId: string,
  userId: string,
  userRole: string
) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      _count: { select: { tickets: true } },
    },
  });

  if (!event) {
    throw notFound("Event");
  }

  // Check ownership
  if (event.organizerId !== userId && userRole !== "ADMIN") {
    throw forbidden("You can only delete your own events");
  }

  // Check if tickets have been sold
  if (event._count.tickets > 0) {
    throw badRequest(
      "Cannot delete event with sold tickets. Cancel the event instead."
    );
  }

  await prisma.event.delete({ where: { id: eventId } });

  return { success: true };
};

// Get ticket type by ID
export const getTicketTypeById = async (ticketTypeId: string) => {
  const ticketType = await prisma.ticketType.findUnique({
    where: { id: ticketTypeId },
    include: {
      event: {
        select: {
          id: true,
          name: true,
          startDate: true,
          location: true,
        },
      },
    },
  });

  if (!ticketType) {
    throw notFound("Ticket type");
  }

  return ticketType;
};
