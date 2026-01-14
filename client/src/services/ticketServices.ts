import apiClient from "./apiClient";
import { Ticket, TicketType } from "../types";

export interface BookTicketInput {
  eventId: string;
  ticketTypeId: string;
  specialRequests?: string;
}

export const bookTicket = async (
  ticketData: Omit<Ticket, "id" | "createdAt" | "ticketCode" | "isTransferred">,
  _userId: string
): Promise<Ticket> => {
  const { data } = await apiClient.post<Ticket>("/tickets", {
    eventId: ticketData.eventId,
    ticketTypeId: ticketData.ticketTypeId,
    specialRequests: ticketData.specialRequests,
  });
  return data;
};

export const getUserTickets = async (userId: string): Promise<Ticket[]> => {
  if (!userId) throw new Error("User ID is required");
  try {
    const { data } = await apiClient.get<Ticket[]>(`/users/${userId}/tickets`);
    return data;
  } catch (error) {
    console.error("Error getting user tickets:", error);
    return [];
  }
};

export const getTicketTypeById = async (
  ticketTypeId: string
): Promise<TicketType | undefined> => {
  try {
    const { data } = await apiClient.get<TicketType>(
      `/ticket-types/${ticketTypeId}`
    );
    return data;
  } catch (error) {
    console.error("Error getting ticket type:", error);
    return undefined;
  }
};

export const deleteTicket = async (ticketId: string): Promise<void> => {
  if (!ticketId) throw new Error("Ticket ID is required");
  await apiClient.delete(`/tickets/${ticketId}`);
};

export const getTicketById = async (ticketId: string): Promise<Ticket> => {
  const { data } = await apiClient.get<Ticket>(`/tickets/${ticketId}`);
  return data;
};

export const verifyTicket = async (
  ticketCode: string
): Promise<{ valid: boolean; ticket: Ticket }> => {
  const { data } = await apiClient.get<{ valid: boolean; ticket: Ticket }>(
    `/tickets/verify/${ticketCode}`
  );
  return data;
};

export const checkInTicket = async (ticketId: string): Promise<Ticket> => {
  const { data } = await apiClient.post<Ticket>(
    `/tickets/${ticketId}/check-in`
  );
  return data;
};
