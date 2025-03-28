import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FaTicketAlt } from "react-icons/fa";
import { BiSolidDashboard } from "react-icons/bi";
import { Event, Ticket } from "../../types";
import { getUserEvents, deleteEvent } from "../../services/eventServices";
import ClientEventCard from "./clientEvents/ClientEventCard";
import EditEventModal from "./clientEvents/EditEventModal";
import DeleteEventModal from "./clientEvents/DeleteEventModal";
import { getUserTickets } from "../../services/ticketServices";
import { TicketCard } from "./clientTickets/TicketCard";

export default function Home() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);

  // Fetch user's tickets
  const { data: tickets, isLoading: ticketsLoading } = useQuery<Ticket[]>({
    queryKey: ["userTickets", user?.id],
    queryFn: () => getUserTickets(user?.id || ""),
    enabled: !!user?.id,
  });

  // Fetch user's managed events
  const { data: events, isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["userEvents", user?.id],
    queryFn: () => getUserEvents(user?.id || ""),
    enabled: !!user?.id,
  });

  // Delete event mutation
  const deleteMutation = useMutation({
    mutationFn: (eventId: string) => deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userEvents", user?.id] });
      setDeleteEventId(null);
    },
  });

  // Handle edit submission (stubbed for now)
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add update logic here (e.g., useMutation to update event)
    setEditEvent(null);
  };

  return (
    <div className="p-6 pt-18 md:p-10 max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-secondary">
          Welcome, {user?.displayName || user?.firstname || "User"}!
        </h2>
        <p className="text-secondary-100 mt-2">
          Manage your tickets and events with ease.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        <Link
          to="/dashboard/tickets"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-100 text-white rounded-lg shadow hover:bg-primary hover:border-secondary border border-transparent transition-colors duration-200"
        >
          <FaTicketAlt />
          View My Tickets
        </Link>
        <Link
          to="/dashboard/settings"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-100 border border-transparent text-white rounded-lg shadow hover:bg-primary hover:border-secondary transition-colors duration-200"
        >
          <BiSolidDashboard />
          Edit Profile
        </Link>
      </div>

      {/* Tickets Overview */}
      <section className="mb-12">
        <h3 className="text-xl font-semibold text-secondary mb-4">
          Your Tickets
        </h3>
        {ticketsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-primary-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : tickets?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.slice(0, 3).map((ticket) => (
              <TicketCard
                ticket={ticket}
                key={ticket.id}
                asCard={true}
                deleteTicket={() => {}}
                selectedTicket={null}
                onSelect={() => {}}
                openModal={false}
                setOpenModal={() => {}}
              />
            ))}
          </div>
        ) : (
          <p className="text-secondary-100">
            No tickets yet. Book some events!
          </p>
        )}
        {tickets && tickets.length > 3 && (
          <Link
            to="/dashboard/tickets"
            className="mt-4 inline-block text-secondary hover:text-secondary-200 transition-colors"
          >
            See all tickets
          </Link>
        )}
      </section>

      {/* Managed Events */}
      <section>
        <h3 className="text-xl font-semibold text-secondary mb-4">
          Events You Manage
        </h3>
        {eventsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-40 bg-primary-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : events?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 3).map((event) => (
              <ClientEventCard
                event={event}
                key={event.id}
                setEditEvent={setEditEvent}
                setDeleteEventId={setDeleteEventId}
              />
            ))}
          </div>
        ) : (
          <p className="text-secondary-100">
            No events managed yet. Create one!
          </p>
        )}
        {events && events.length > 3 && (
          <Link
            to="/dashboard/events"
            className="mt-4 inline-block text-secondary hover:text-secondary-200 transition-colors"
          >
            See all events
          </Link>
        )}
      </section>

      {/* Edit Modal */}
      {editEvent && (
        <EditEventModal
          editEvent={editEvent}
          setEditEvent={setEditEvent}
          handleEditSubmit={handleEditSubmit}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteEventId && (
        <DeleteEventModal
          deleteEventId={deleteEventId}
          setDeleteEventId={setDeleteEventId}
          onDelete={(deleteEventId) => deleteMutation.mutate(deleteEventId)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
