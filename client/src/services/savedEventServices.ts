import apiClient from "./apiClient";
import { Event } from "../types";

// Save event to wishlist
export const saveEvent = async (eventId: string): Promise<Event> => {
  const response = await apiClient.post(`/saved-events/${eventId}`);
  return response.data.event;
};

// Remove event from wishlist
export const unsaveEvent = async (eventId: string): Promise<void> => {
  await apiClient.delete(`/saved-events/${eventId}`);
};

// Get all saved events
export const getSavedEvents = async (): Promise<Event[]> => {
  const response = await apiClient.get("/saved-events");
  return response.data;
};

// Check if event is saved
export const isEventSaved = async (eventId: string): Promise<boolean> => {
  const response = await apiClient.get(`/saved-events/${eventId}/status`);
  return response.data.saved;
};

// Toggle save status
export const toggleSaveEvent = async (
  eventId: string,
  currentlySaved: boolean
): Promise<boolean> => {
  if (currentlySaved) {
    await unsaveEvent(eventId);
    return false;
  } else {
    await saveEvent(eventId);
    return true;
  }
};
