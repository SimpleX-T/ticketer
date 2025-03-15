import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  createEvent, 
  getEventWithTickets, 
  publishEvent, 
  updateEvent,
  getPublishedEvents
} from "./useFirebaseEvents";
import { Event, User } from "../types";

// Query keys
export const queryKeys = {
  events: "events",
  publishedEvents: "publishedEvents",
  event: (id: string) => ["event", id],
};

// Hook for fetching all published events
export const usePublishedEvents = () => {
  return useQuery({
    queryKey: [queryKeys.publishedEvents],
    queryFn: getPublishedEvents,
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
      currentUser 
    }: { 
      eventData: Omit<Event, "id" | "createdAt" | "ticketsSold" | "soldOut">, 
      currentUser: User 
    }) => createEvent(eventData, currentUser),
    onSuccess: () => {
      // Invalidate relevant queries when a new event is created
      queryClient.invalidateQueries({ queryKey: [queryKeys.events] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.publishedEvents] });
    },
  });
};

// Hook for publishing an event
export const usePublishEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      eventId, 
      currentUser 
    }: { 
      eventId: string, 
      currentUser: User 
    }) => publishEvent(eventId, currentUser),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries when an event is published
      queryClient.invalidateQueries({ queryKey: [queryKeys.events] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.publishedEvents] });
      queryClient.invalidateQueries({ queryKey: queryKeys.event(variables.eventId) });
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
      currentUser 
    }: { 
      eventId: string, 
      eventData: Partial<Omit<Event, "id" | "createdAt" | "organizerId">>, 
      currentUser: User 
    }) => updateEvent(eventId, eventData, currentUser),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries when an event is updated
      queryClient.invalidateQueries({ queryKey: [queryKeys.events] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.publishedEvents] });
      queryClient.invalidateQueries({ queryKey: queryKeys.event(variables.eventId) });
    },
  });
};
