import {
  collection,
  doc,
  // setDoc,
  updateDoc,
  getDoc,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { Event, EventStatus, TicketType, User } from "../types";

// Create a new event
export const createEvent = async (
  eventData: Omit<Event, "id" | "createdAt" | "ticketsSold" | "soldOut">,
  currentUser: User
): Promise<Event> => {
  try {
    // Verify user is an organizer
    if (currentUser.role !== "organizer" && currentUser.role !== "admin") {
      throw new Error("Only organizers can create events");
    }

    // Create event reference with auto-generated ID
    const eventRef = doc(collection(db, "events"));
    const ticketTypesRef = collection(eventRef, "ticketTypes");

    // Calculate total capacity from ticket types
    const totalCapacity = eventData.ticketTypes.reduce(
      (sum, ticket) => sum + ticket.total,
      0
    );

    // Prepare event data
    const newEvent: Event = {
      ...eventData,
      id: eventRef.id,
      organizerId: currentUser.id,
      createdAt: new Date().toISOString(),
      status: EventStatus.DRAFT,
      ticketsSold: 0,
      soldOut: false,
      totalCapacity,
    };

    // Start a batch write
    const batch = writeBatch(db);

    // Remove ticketTypes from event object (we'll store them in a subcollection)
    const { ticketTypes, ...eventWithoutTickets } = newEvent;

    // Add event to batch
    batch.set(eventRef, eventWithoutTickets);

    // Add each ticket type to the subcollection
    for (const ticketType of ticketTypes) {
      const ticketTypeRef = doc(ticketTypesRef);
      const ticketTypeData: TicketType = {
        ...ticketType,
        id: ticketTypeRef.id,
      };
      batch.set(ticketTypeRef, ticketTypeData);
    }

    // Commit the batch
    await batch.commit();

    return { ...newEvent, ticketTypes };
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

// Publish an event (change status from DRAFT to PUBLISHED)
export const publishEvent = async (
  eventId: string, 
  currentUser: User
): Promise<void> => {
  try {
    const eventRef = doc(db, "events", eventId);
    const eventDoc = await getDoc(eventRef);

    if (!eventDoc.exists()) {
      throw new Error("Event not found");
    }

    const eventData = eventDoc.data() as Event;

    if (eventData.organizerId !== currentUser.id && currentUser.role !== "admin") {
      throw new Error("Unauthorized to publish this event");
    }

    await updateDoc(eventRef, {
      status: EventStatus.PUBLISHED,
    });
  } catch (error) {
    console.error("Error publishing event:", error);
    throw error;
  }
};

// Get event with ticket types
export const getEventWithTickets = async (eventId: string): Promise<Event | null> => {
  try {
    const eventRef = doc(db, "events", eventId);
    const eventDoc = await getDoc(eventRef);

    if (!eventDoc.exists()) {
      return null;
    }

    const eventData = eventDoc.data() as Omit<Event, "ticketTypes">;
    
    // Get ticket types from subcollection
    const ticketTypesRef = collection(eventRef, "ticketTypes");
    const ticketTypesSnapshot = await getDocs(ticketTypesRef);
    const ticketTypes = ticketTypesSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    })) as TicketType[];

    return {
      ...eventData,
      ticketTypes,
    } as Event;
  } catch (error) {
    console.error("Error getting event:", error);
    throw error;
  }
};

// Update event details
export const updateEvent = async (
  eventId: string,
  eventData: Partial<Omit<Event, "id" | "createdAt" | "organizerId">>,
  currentUser: User
): Promise<void> => {
  try {
    const eventRef = doc(db, "events", eventId);
    const eventDoc = await getDoc(eventRef);

    if (!eventDoc.exists()) {
      throw new Error("Event not found");
    }

    const existingEvent = eventDoc.data() as Event;

    if (existingEvent.organizerId !== currentUser.id && currentUser.role !== "admin") {
      throw new Error("Unauthorized to update this event");
    }

    const ticketTypesRef = collection(eventRef, "ticketTypes");

    // Start a batch write
    const batch = writeBatch(db);

    // Update main event document
    const { ticketTypes, ...eventWithoutTickets } = eventData;
    if (Object.keys(eventWithoutTickets).length > 0) {
      batch.update(eventRef, eventWithoutTickets);
    }

    // Update ticket types if provided
    if (ticketTypes?.length) {
      // Get existing ticket types
      const existingTicketTypesSnapshot = await getDocs(ticketTypesRef);
      
      // Delete existing ticket types
      existingTicketTypesSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Add new ticket types
      ticketTypes.forEach((ticketType) => {
        const ticketTypeRef = doc(ticketTypesRef);
        batch.set(ticketTypeRef, {
          ...ticketType,
          id: ticketTypeRef.id,
        });
      });
    }

    await batch.commit();
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};
