import prisma from "../config/database";
import { UpdateUserInput, UpdateRoleInput } from "../validators/user";
import { notFound, forbidden } from "../middleware/errorHandler";

// Get user by ID
export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstname: true,
      lastname: true,
      displayName: true,
      profileImage: true,
      role: true,
      emailVerified: true,
      provider: true,
      createdAt: true,
      _count: {
        select: {
          events: true,
          tickets: true,
        },
      },
    },
  });

  if (!user) {
    throw notFound("User");
  }

  return user;
};

// Update user
export const updateUser = async (
  userId: string,
  requesterId: string,
  data: UpdateUserInput
) => {
  // Check permissions
  if (userId !== requesterId) {
    const requester = await prisma.user.findUnique({
      where: { id: requesterId },
      select: { role: true },
    });

    if (requester?.role !== "ADMIN") {
      throw forbidden("You can only update your own profile");
    }
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      firstname: true,
      lastname: true,
      displayName: true,
      profileImage: true,
      role: true,
      emailVerified: true,
      provider: true,
      createdAt: true,
    },
  });

  return user;
};

// Update user role
export const updateUserRole = async (
  userId: string,
  requesterId: string,
  data: UpdateRoleInput
) => {
  const requester = await prisma.user.findUnique({
    where: { id: requesterId },
    select: { role: true },
  });

  // Only admins can change roles, or users can upgrade to organizer
  if (requester?.role !== "ADMIN") {
    if (userId !== requesterId || data.role !== "ORGANIZER") {
      throw forbidden("Insufficient permissions to change role");
    }
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role: data.role },
    select: {
      id: true,
      email: true,
      firstname: true,
      lastname: true,
      displayName: true,
      profileImage: true,
      role: true,
    },
  });

  return user;
};

// Get user's events
export const getUserEvents = async (userId: string) => {
  const events = await prisma.event.findMany({
    where: { organizerId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      ticketTypes: true,
      _count: {
        select: { tickets: true },
      },
    },
  });

  return events;
};

// Get user's tickets
export const getUserTickets = async (userId: string) => {
  const tickets = await prisma.ticket.findMany({
    where: { userId },
    orderBy: { purchaseDate: "desc" },
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
        },
      },
    },
  });

  return tickets;
};
