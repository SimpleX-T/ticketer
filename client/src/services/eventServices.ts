import apiClient from "./apiClient";
import { Event, TicketType } from "../types";

export interface CreateEventInput {
  name: string;
  description: string;
  location: string;
  image: string;
  startDate: string;
  endDate: string;
  category: string;
  maxTicketsPerUser: number;
  totalCapacity: number;
  ticketTypes: Omit<TicketType, "id" | "available">[];
}

export interface EventsResponse {
  events: Event[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const createEvent = async (
  event: Omit<Event, "id" | "createdAt" | "ticketsSold" | "soldOut">
): Promise<Event> => {
  const { ticketTypes, ...eventData } = event;

  const { data } = await apiClient.post<Event>("/events", {
    ...eventData,
    ticketTypes: ticketTypes.map(({ id, available, ...tt }) => tt),
  });

  return data;
};

export const getEventDetails = async (
  eventId: string
): Promise<Event | undefined> => {
  if (!eventId) throw new Error("Event ID is required");
  try {
    const { data } = await apiClient.get<Event>(`/events/${eventId}`);
    return data;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const getRecentEvents = async (): Promise<Event[]> => {
  const { data } = await apiClient.get<Event[]>("/events/recent");
  return data;
};

export const getAllEvents = async (): Promise<Event[]> => {
  const { data } = await apiClient.get<EventsResponse>("/events");
  return data.events;
};

export const getUpcomingEvents = async (): Promise<Event[]> => {
  const { data } = await apiClient.get<Event[]>("/events/upcoming");
  return data;
};

export const getUserEvents = async (userId: string): Promise<Event[]> => {
  const { data } = await apiClient.get<Event[]>(`/users/${userId}/events`);
  return data;
};

export const deleteEvent = async (
  eventId: string
): Promise<{ success: boolean }> => {
  await apiClient.delete(`/events/${eventId}`);
  return { success: true };
};

export const updateEvent = async (
  eventId: string,
  updates: Partial<Event>
): Promise<Event> => {
  const { data } = await apiClient.patch<Event>(`/events/${eventId}`, updates);
  return data;
};

export const searchEvents = async (
  query: string,
  category?: string
): Promise<Event[]> => {
  const params = new URLSearchParams();
  if (query) params.append("search", query);
  if (category) params.append("category", category);

  const { data } = await apiClient.get<EventsResponse>(`/events?${params}`);
  return data.events;
};

export interface ListEventsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export const listEvents = async (
  params: ListEventsParams = {}
): Promise<EventsResponse> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  if (params.search) searchParams.append("search", params.search);
  if (params.category) searchParams.append("category", params.category);
  if (params.startDate) searchParams.append("startDate", params.startDate);
  if (params.endDate) searchParams.append("endDate", params.endDate);
  if (params.status) searchParams.append("status", params.status);

  const { data } = await apiClient.get<EventsResponse>(
    `/events?${searchParams}`
  );
  return data;
};
