import prisma from "../config/database";
import { BookTicketInput } from "../validators/ticket";
import { notFound, badRequest, forbidden } from "../middleware/errorHandler";
import { generateQRCode, generateTicketQRData } from "../utils/qrcode";

// Book a ticket
export const bookTicket = async (userId: string, data: BookTicketInput) => {
  const { eventId, ticketTypeId, specialRequests } = data;

  // Get event and ticket type
  const [event, ticketType] = await Promise.all([
    prisma.event.findUnique({ where: { id: eventId } }),
    prisma.ticketType.findUnique({ where: { id: ticketTypeId } }),
  ]);

  if (!event) {
    throw notFound("Event");
  }

  if (!ticketType || ticketType.eventId !== eventId) {
    throw notFound("Ticket type");
  }

  // Check event status
  if (event.status !== "PUBLISHED") {
    throw badRequest("Event is not available for booking");
  }

  if (event.soldOut) {
    throw badRequest("Event is sold out");
  }

  if (new Date(event.startDate) < new Date()) {
    throw badRequest("Event has already started");
  }

  // Check ticket availability
  if (ticketType.available <= 0) {
    throw badRequest("No tickets available for this type");
  }

  // Check max tickets per user
  const userTicketsCount = await prisma.ticket.count({
    where: {
      userId,
      eventId,
    },
  });

  if (userTicketsCount >= event.maxTicketsPerUser) {
    throw badRequest(
      `Maximum ${event.maxTicketsPerUser} tickets per user for this event`
    );
  }

  // Create ticket with atomic transaction
  const ticket = await prisma.$transaction(async (tx) => {
    // Decrement available tickets
    const updatedTicketType = await tx.ticketType.update({
      where: { id: ticketTypeId },
      data: { available: { decrement: 1 } },
    });

    if (updatedTicketType.available < 0) {
      throw badRequest("Ticket no longer available");
    }

    // Increment event tickets sold
    await tx.event.update({
      where: { id: eventId },
      data: {
        ticketsSold: { increment: 1 },
        soldOut: {
          set: event.ticketsSold + 1 >= event.totalCapacity,
        },
      },
    });

    // Create ticket
    const newTicket = await tx.ticket.create({
      data: {
        userId,
        eventId,
        ticketTypeId,
        specialRequests,
      },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            location: true,
            image: true,
          },
        },
        ticketType: {
          select: {
            id: true,
            name: true,
            price: true,
            type: true,
            benefits: true,
          },
        },
      },
    });

    return newTicket;
  });

  // Generate QR code
  const qrData = generateTicketQRData(ticket.ticketCode, eventId);
  const qrCode = await generateQRCode(qrData);

  // Update ticket with QR code
  const updatedTicket = await prisma.ticket.update({
    where: { id: ticket.id },
    data: { qrCode },
    include: {
      event: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
          location: true,
          image: true,
        },
      },
      ticketType: {
        select: {
          id: true,
          name: true,
          price: true,
          type: true,
          benefits: true,
        },
      },
    },
  });

  return updatedTicket;
};

// Get ticket by ID
export const getTicketById = async (
  ticketId: string,
  userId: string,
  userRole: string
) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      event: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
          location: true,
          image: true,
          organizerId: true,
        },
      },
      ticketType: {
        select: {
          id: true,
          name: true,
          price: true,
          type: true,
          benefits: true,
        },
      },
      user: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
        },
      },
    },
  });

  if (!ticket) {
    throw notFound("Ticket");
  }

  // Check access - owner, event organizer, or admin
  const isOwner = ticket.userId === userId;
  const isOrganizer = ticket.event.organizerId === userId;
  const isAdmin = userRole === "ADMIN";

  if (!isOwner && !isOrganizer && !isAdmin) {
    throw forbidden("You don't have access to this ticket");
  }

  return ticket;
};

// Cancel/delete ticket
export const cancelTicket = async (
  ticketId: string,
  userId: string,
  userRole: string
) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      event: true,
    },
  });

  if (!ticket) {
    throw notFound("Ticket");
  }

  // Check ownership
  if (ticket.userId !== userId && userRole !== "ADMIN") {
    throw forbidden("You can only cancel your own tickets");
  }

  // Check if event has started
  if (new Date(ticket.event.startDate) < new Date()) {
    throw badRequest("Cannot cancel ticket for an event that has started");
  }

  // Cancel ticket with atomic transaction
  await prisma.$transaction(async (tx) => {
    // Increment available tickets
    await tx.ticketType.update({
      where: { id: ticket.ticketTypeId },
      data: { available: { increment: 1 } },
    });

    // Decrement event tickets sold
    await tx.event.update({
      where: { id: ticket.eventId },
      data: {
        ticketsSold: { decrement: 1 },
        soldOut: false,
      },
    });

    // Delete ticket
    await tx.ticket.delete({ where: { id: ticketId } });
  });

  return { success: true };
};

// Check in ticket (for event organizers)
export const checkInTicket = async (
  ticketId: string,
  userId: string,
  userRole: string
) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      event: {
        select: {
          id: true,
          organizerId: true,
          name: true,
        },
      },
    },
  });

  if (!ticket) {
    throw notFound("Ticket");
  }

  // Check if user is organizer or admin
  const isOrganizer = ticket.event.organizerId === userId;
  const isAdmin = userRole === "ADMIN";

  if (!isOrganizer && !isAdmin) {
    throw forbidden("Only event organizers can check in tickets");
  }

  if (ticket.checkedIn) {
    throw badRequest("Ticket already checked in");
  }

  const updatedTicket = await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      checkedIn: true,
      checkedInAt: new Date(),
    },
    include: {
      user: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
        },
      },
      ticketType: {
        select: {
          name: true,
          type: true,
        },
      },
    },
  });

  return updatedTicket;
};

// Verify ticket by code (for scanning)
export const verifyTicketByCode = async (ticketCode: string) => {
  const ticket = await prisma.ticket.findUnique({
    where: { ticketCode },
    include: {
      event: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
          location: true,
        },
      },
      ticketType: {
        select: {
          name: true,
          type: true,
        },
      },
      user: {
        select: {
          firstname: true,
          lastname: true,
        },
      },
    },
  });

  if (!ticket) {
    throw notFound("Ticket");
  }

  return {
    valid: true,
    ticket,
  };
};
