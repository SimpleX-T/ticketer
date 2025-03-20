import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createEvent,
  getEventWithTickets,
  updateEvent,
} from "./useFirebaseEvents";
import { Event, User } from "../types";
import { getAllEvents } from "../services/eventServices";

// Query keys
export const queryKeys = {
  events: "events",
  event: (id: string) => ["event", id],
};

// Hook for fetching all published events
export const useGetEvents = () => {
  return useQuery({
    queryKey: [queryKeys.events],
    queryFn: getAllEvents,
  });
};

// Hook for fetching a single event with tickets
export const useEvent = (eventId: string) => {
  return useQuery({
    queryKey: queryKeys.event(eventId),
    queryFn: () => getEventWithTickets(eventId),
    enabled: !!eventId, // Only run query if eventId is provided
  });
};

// Hook for creating a new event
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventData,
      currentUser,
    }: {
      eventData: Omit<Event, "id" | "createdAt" | "ticketsSold" | "soldOut">;
      currentUser: User;
    }) => createEvent(eventData, currentUser),
    onSuccess: () => {
      // Invalidate relevant queries when a new event is created
      queryClient.invalidateQueries({ queryKey: [queryKeys.events] });
    },
  });
};

// Hook for updating an event
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      eventData,
      currentUser,
    }: {
      eventId: string;
      eventData: Partial<Omit<Event, "id" | "createdAt" | "organizerId">>;
      currentUser: User;
    }) => updateEvent(eventId, eventData, currentUser),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries when an event is updated
      queryClient.invalidateQueries({ queryKey: [queryKeys.events] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.event(variables.eventId),
      });
    },
  });
};
