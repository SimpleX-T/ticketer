import {
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  increment,
  runTransaction,
  writeBatch,
} from "firebase/firestore";
import { db } from "../services/firebase";
import {
  Ticket,
  TicketPurchaseData,
  TicketStatus,
  TicketType,
  User,
  Event,
} from "../types";
import { v4 as uuidv4 } from "uuid"; // You'll need to install this

// Book tickets for an event
export const bookTickets = async (
  purchaseData: TicketPurchaseData,
  currentUser: User
) => {
  try {
    // Run in transaction to ensure availability
    return await runTransaction(db, async (transaction) => {
      // Get event
      const eventRef = doc(db, "events", purchaseData.eventId);
      const eventDoc = await transaction.get(eventRef);

      if (!eventDoc.exists()) {
        throw new Error("Event not found");
      }

      const eventData = eventDoc.data() as Event;

      if (eventData.status !== "PUBLISHED") {
        throw new Error("Cannot purchase tickets for unpublished events");
      }

      // Check if event is sold out
      if (eventData.soldOut) {
        throw new Error("Event is sold out");
      }

      // Get ticket type
      const ticketTypeRef = doc(
        db,
        `events/${purchaseData.eventId}/ticketTypes`,
        purchaseData.ticketTypeId
      );
      const ticketTypeDoc = await transaction.get(ticketTypeRef);

      if (!ticketTypeDoc.exists()) {
        throw new Error("Ticket type not found");
      }

      const ticketType = ticketTypeDoc.data() as TicketType;

      // Check if enough tickets are available
      if (ticketType.available < purchaseData.quantity) {
        throw new Error(
          `Only ${ticketType.available} tickets of this type are available`
        );
      }

      // Check if user is trying to buy more than allowed per user
      if (purchaseData.quantity > eventData.maxTicketsPerUser) {
        throw new Error(
          `You can only purchase up to ${eventData.maxTicketsPerUser} tickets per user`
        );
      }

      // Get user's existing tickets for this event
      const userTicketsQuery = query(
        collection(db, "tickets"),
        where("eventId", "==", purchaseData.eventId),
        where("userId", "==", currentUser.id)
      );
      const userTicketsSnapshot = await getDocs(userTicketsQuery);

      // Check if adding these tickets would exceed the per-user limit
      if (
        userTicketsSnapshot.size + purchaseData.quantity >
        eventData.maxTicketsPerUser
      ) {
        throw new Error(
          `You can only purchase up to ${eventData.maxTicketsPerUser} tickets in total`
        );
      }

      // Create ticket records
      const ticketIds = [];
      const batch = writeBatch(db);

      for (let i = 0; i < purchaseData.quantity; i++) {
        const ticketId = uuidv4();
        const ticketCode = generateTicketCode();

        const newTicket: Ticket = {
          id: ticketId,
          ticketTypeId: purchaseData.ticketTypeId,
          eventId: purchaseData.eventId,
          userId: currentUser.id,
          purchaseDate: new Date().toISOString(),
          status: TicketStatus.PURCHASED,
          price: ticketType.price,
          ticketCode,
          isTransferred: false,
          specialRequests: purchaseData.specialRequests,
        };

        const ticketRef = doc(db, "tickets", ticketId);
        batch.set(ticketRef, newTicket);

        // Add to userTickets collection for quick queries
        const userTicketRef = doc(
          db,
          "userTickets",
          `${currentUser.id}_${ticketId}`
        );
        batch.set(userTicketRef, {
          ticketId,
          eventId: purchaseData.eventId,
        });

        // Add to eventTickets collection for quick queries
        const eventTicketRef = doc(
          db,
          "eventTickets",
          `${purchaseData.eventId}_${ticketId}`
        );
        batch.set(eventTicketRef, {
          ticketId,
          userId: currentUser.id,
        });

        ticketIds.push(ticketId);
      }

      // Update ticket type availability
      transaction.update(ticketTypeRef, {
        available: increment(-purchaseData.quantity),
      });

      // Update event stats
      transaction.update(eventRef, {
        ticketsSold: increment(purchaseData.quantity),
      });

      // Check if event is now sold out
      const newAvailable = ticketType.available - purchaseData.quantity;
      if (newAvailable === 0) {
        // Check if all ticket types are sold out
        const allTicketTypesQuery = query(
          collection(db, `events/${purchaseData.eventId}/ticketTypes`)
        );
        const allTicketTypesSnapshot = await getDocs(allTicketTypesQuery);

        let allSoldOut = true;
        allTicketTypesSnapshot.forEach((doc) => {
          const tt = doc.data() as TicketType;
          // Skip the one we're currently updating
          if (doc.id === purchaseData.ticketTypeId) {
            if (newAvailable > 0) allSoldOut = false;
          } else {
            if (tt.available > 0) allSoldOut = false;
          }
        });

        if (allSoldOut) {
          transaction.update(eventRef, {
            soldOut: true,
          });
        }
      }

      // Commit all the writes
      await batch.commit();

      return {
        success: true,
        ticketIds,
        message: `Successfully purchased ${purchaseData.quantity} tickets`,
      };
    });
  } catch (error) {
    console.error("Error booking tickets:", error);
    throw error;
  }
};

// Generate a random ticket code
const generateTicketCode = () => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Get user's tickets
export const getUserTickets = async (userId: string) => {
  try {
    const ticketsQuery = query(
      collection(db, "tickets"),
      where("userId", "==", userId)
    );

    const ticketsSnap = await getDocs(ticketsQuery);

    const tickets = [];

    for (const ticketDoc of ticketsSnap.docs) {
      const ticketData = ticketDoc.data() as Ticket;

      // Get event details
      const eventRef = doc(db, "events", ticketData.eventId);
      const eventSnap = await getDoc(eventRef);

      if (!eventSnap.exists()) {
        console.warn(
          `Event ${ticketData.eventId} not found for ticket ${ticketData.id}`
        );
        continue;
      }

      const eventData = eventSnap.data() as Event;

      // Get ticket type details
      const ticketTypeRef = doc(
        db,
        `events/${ticketData.eventId}/ticketTypes`,
        ticketData.ticketTypeId
      );
      const ticketTypeSnap = await getDoc(ticketTypeRef);

      let ticketTypeId = "";
      if (ticketTypeSnap.exists()) {
        const ticketTypeData = ticketTypeSnap.data() as TicketType;
        ticketTypeId = ticketTypeData.id;
      }

      tickets.push({
        id: ticketData.id,
        ticketTypeId: ticketTypeId,
        eventId: eventData.id,
        userId: ticketData.userId,
        purchaseDate: ticketData.purchaseDate,
        status: ticketData.status,
        price: ticketData.price,
        ticketCode: ticketData.ticketCode,
        isTransferred: ticketData.isTransferred,
        transferredTo: ticketData.transferredTo,
        specialRequests: ticketData.specialRequests,
      } as Ticket);
    }

    console.log(tickets);
    return tickets;
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    throw error;
  }
};

// Cancel ticket
export const cancelTicket = async (ticketId: string, currentUser: User) => {
  try {
    const ticketRef = doc(db, "tickets", ticketId);
    const ticketSnap = await getDoc(ticketRef);

    if (!ticketSnap.exists()) {
      throw new Error("Ticket not found");
    }

    const ticketData = ticketSnap.data() as Ticket;

    // Verify ownership or admin rights
    if (ticketData.userId !== currentUser.id && currentUser.role !== "admin") {
      throw new Error("Unauthorized to cancel this ticket");
    }

    // Check if ticket is already used or cancelled
    if (
      ticketData.status === TicketStatus.USED ||
      ticketData.status === TicketStatus.CANCELLED ||
      ticketData.status === TicketStatus.REFUNDED
    ) {
      throw new Error(`Ticket is already ${ticketData.status.toLowerCase()}`);
    }

    // Run in transaction to ensure consistency
    await runTransaction(db, async (transaction) => {
      // Update ticket status
      transaction.update(ticketRef, {
        status: TicketStatus.CANCELLED,
      });

      // Increment available tickets in the ticket type
      const ticketTypeRef = doc(
        db,
        `events/${ticketData.eventId}/ticketTypes`,
        ticketData.ticketTypeId
      );
      transaction.update(ticketTypeRef, {
        available: increment(1),
      });

      // Decrement event tickets sold count
      const eventRef = doc(db, "events", ticketData.eventId);
      transaction.update(eventRef, {
        ticketsSold: increment(-1),
        soldOut: false, // If a ticket is cancelled, the event is no longer sold out
      });
    });

    return {
      success: true,
      message: "Ticket successfully cancelled",
    };
  } catch (error) {
    console.error("Error cancelling ticket:", error);
    throw error;
  }
};
