import prisma from "../config/database";
import { notFound, conflict } from "../middleware/errorHandler";

// Save event to wishlist
export const saveEvent = async (userId: string, eventId: string) => {
  // Check if event exists
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw notFound("Event");
  }

  // Check if already saved
  const existing = await prisma.savedEvent.findUnique({
    where: {
      userId_eventId: { userId, eventId },
    },
  });

  if (existing) {
    throw conflict("Event already saved");
  }

  const savedEvent = await prisma.savedEvent.create({
    data: { userId, eventId },
    include: {
      event: {
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
      },
    },
  });

  return savedEvent;
};

// Remove event from wishlist
export const unsaveEvent = async (userId: string, eventId: string) => {
  const savedEvent = await prisma.savedEvent.findUnique({
    where: {
      userId_eventId: { userId, eventId },
    },
  });

  if (!savedEvent) {
    throw notFound("Saved event");
  }

  await prisma.savedEvent.delete({
    where: { id: savedEvent.id },
  });

  return { success: true };
};

// Get user's saved events
export const getSavedEvents = async (userId: string) => {
  const savedEvents = await prisma.savedEvent.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      event: {
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
      },
    },
  });

  return savedEvents.map((se) => se.event);
};

// Check if event is saved by user
export const isEventSaved = async (userId: string, eventId: string) => {
  const savedEvent = await prisma.savedEvent.findUnique({
    where: {
      userId_eventId: { userId, eventId },
    },
  });

  return { saved: !!savedEvent };
};

// Get count of saves for an event
export const getEventSaveCount = async (eventId: string) => {
  const count = await prisma.savedEvent.count({
    where: { eventId },
  });

  return { count };
};
