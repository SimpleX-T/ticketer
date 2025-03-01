import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  writeBatch,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { Event, EventStatus, TicketType, User } from "../types";

// Create a new event
export const createEvent = async (
  eventData: Omit<Event, "id" | "createdAt" | "ticketsSold" | "soldOut">,
  currentUser: User
) => {
  try {
    // Verify user is an organizer
    if (currentUser.role !== "organizer" && currentUser.role !== "admin") {
      throw new Error("Only organizers can create events");
    }

    // Create event reference with auto-generated ID
    const eventRef = doc(collection(db, "events"));

    // Calculate total capacity from ticket types
    const totalCapacity = eventData.ticketTypes.reduce(
      (sum, ticket) => sum + ticket.total,
      0
    );

    // Prepare event data
    const newEvent: Event = {
      ...eventData,
      id: eventRef.id, // Add ID to the event object
      organizerId: currentUser.id,
      createdAt: new Date().toISOString(),
      status: EventStatus.DRAFT, // Start as draft
      ticketsSold: 0,
      soldOut: false,
      totalCapacity,
    };

    // Remove ticketTypes from event object (we'll store them in a subcollection)
    const { ticketTypes, ...eventWithoutTickets } = newEvent;

    // Create event in Firestore
    await setDoc(eventRef, eventWithoutTickets);

    // Create ticket types as subcollection
    const batch = writeBatch(db);

    ticketTypes.forEach((ticketType) => {
      const ticketTypeRef = doc(
        collection(db, `events/${eventRef.id}/ticketTypes`)
      );
      batch.set(ticketTypeRef, {
        ...ticketType,
        id: ticketTypeRef.id,
      });
    });

    await batch.commit();

    return {
      ...newEvent,
      id: eventRef.id,
    };
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

// Publish an event (change status from DRAFT to PUBLISHED)
export const publishEvent = async (eventId: string, currentUser: User) => {
  try {
    const eventRef = doc(db, "events", eventId);
    const eventSnap = await getDoc(eventRef);

    if (!eventSnap.exists()) {
      throw new Error("Event not found");
    }

    const eventData = eventSnap.data() as Event;

    // Verify ownership or admin rights
    if (
      eventData.organizerId !== currentUser.id &&
      currentUser.role !== "admin"
    ) {
      throw new Error("Unauthorized to modify this event");
    }

    await updateDoc(eventRef, {
      status: EventStatus.PUBLISHED,
    });

    return true;
  } catch (error) {
    console.error("Error publishing event:", error);
    throw error;
  }
};

// Get event with ticket types
export const getEventWithTickets = async (eventId: string) => {
  try {
    // Get event data
    const eventRef = doc(db, "events", eventId);
    const eventSnap = await getDoc(eventRef);

    if (!eventSnap.exists()) {
      throw new Error("Event not found");
    }

    const eventData = eventSnap.data() as Event;

    // Get ticket types
    const ticketTypesQuery = query(
      collection(db, `events/${eventId}/ticketTypes`)
    );
    const ticketTypesSnap = await getDocs(ticketTypesQuery);

    const ticketTypes = ticketTypesSnap.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as TicketType[];

    return {
      ...eventData,
      ticketTypes,
    };
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
};

// Update event details
export const updateEvent = async (
  eventId: string,
  eventData: Partial<Omit<Event, "id" | "createdAt" | "organizerId">>,
  currentUser: User
) => {
  try {
    const eventRef = doc(db, "events", eventId);
    const eventSnap = await getDoc(eventRef);

    if (!eventSnap.exists()) {
      throw new Error("Event not found");
    }

    const existingEvent = eventSnap.data() as Event;

    // Verify ownership or admin rights
    if (
      existingEvent.organizerId !== currentUser.id &&
      currentUser.role !== "admin"
    ) {
      throw new Error("Unauthorized to modify this event");
    }

    // Don't allow changing certain fields
    const { id, createdAt, organizerId, ticketTypes, ...allowedUpdates } =
      eventData as any;

    await updateDoc(eventRef, allowedUpdates);

    // If ticket types are provided, update them
    if (ticketTypes && Array.isArray(ticketTypes)) {
      // This is a simplified approach - in a real app you'd need to handle
      // adding/removing ticket types more carefully, especially if tickets already sold
      const batch = writeBatch(db);

      // Get existing ticket types
      const ticketTypesQuery = query(
        collection(db, `events/${eventId}/ticketTypes`)
      );
      const ticketTypesSnap = await getDocs(ticketTypesQuery);

      // Delete existing ticket types
      ticketTypesSnap.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Add new ticket types
      ticketTypes.forEach((ticketType) => {
        const ticketTypeRef = doc(
          collection(db, `events/${eventId}/ticketTypes`)
        );
        batch.set(ticketTypeRef, {
          ...ticketType,
          id: ticketTypeRef.id,
        });
      });

      await batch.commit();
    }

    return true;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};
