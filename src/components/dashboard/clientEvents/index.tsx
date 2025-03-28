import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useAuth } from "../../../contexts/AuthContext";
import { deleteEvent, getUserEvents } from "../../../services/eventServices";
import { Event } from "../../../types";
import ClientEventCard from "./ClientEventCard";
import EditEventModal from "./EditEventModal";
import DeleteEventModal from "./DeleteEventModal";
import { FaPlus, FaWpexplorer } from "react-icons/fa6";

export default function ClientEvents() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);

  // Fetch all managed events
  const {
    data: events,
    isLoading,
    error,
  } = useQuery<Event[]>({
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

  // Filter events by search term
  const filteredEvents = events?.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stubbed edit submission (replace with actual update logic later)
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add updateEvent mutation here
    setEditEvent(null);
  };

  if (!user) {
    return <div className="text-center py-10 text-white">Loading...</div>;
  }

  return (
    <div className="p-6 pt-20 md:p-10 min-h-screen-">
      {/* Header */}
      <div className="flex items-center mb-8 md:mb-4 justify-between gap-6">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Your Events
          </h1>
          <p className="text-secondary-100 mt-2">
            Manage all the events you’ve created below.
          </p>
        </div>{" "}
        {user?.role === "organizer" || user?.role === "admin" ? (
          <Link
            to="/create"
            className="flex items-center gap-1 p-2 rounded-sm cursor-pointer hover:bg-secondary/70 transition-colors duration-150 bg-secondary text-white text-xs"
          >
            <FaPlus />
            <span className="hidden md:block">Create Event</span>
          </Link>
        ) : (
          <Link
            to="/#events"
            className="flex items-center gap-1 p-2 rounded-sm cursor-pointer hover:bg-secondary/70 transition-colors duration-150 bg-secondary text-white text-xs"
          >
            <FaWpexplorer />
            <span className="hidden md:block">Explore Events</span>
          </Link>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-8 flex justify-between items-center gap-4">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search your events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 bg-primary-200 border border-secondary/30 rounded-lg text-white placeholder:text-secondary-100 focus:ring-2 focus:ring-secondary-200 transition-all duration-200"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-100" />
        </div>
        <Link
          to="/create-event"
          className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-200 transition-colors duration-200"
        >
          Create New Event
        </Link>
      </div>

      {/* Events List */}
      <section>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-primary-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <p className="text-red-400">
            Error loading events: {(error as Error).message}
          </p>
        ) : filteredEvents?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <ClientEventCard
                event={event}
                key={event.id}
                setEditEvent={setEditEvent}
                setDeleteEventId={setDeleteEventId}
              />
            ))}
          </div>
        ) : (
          <p className="text-secondary-100 text-center">
            No events found. Start by creating one!
          </p>
        )}
      </section>

      {/* Edit Modal */}
      {editEvent && (
        <EditEventModal
          setEditEvent={setEditEvent}
          editEvent={editEvent}
          handleEditSubmit={handleEditSubmit}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteEventId && (
        <DeleteEventModal
          isLoading={deleteMutation.isPending}
          setDeleteEventId={setDeleteEventId}
          deleteEventId={deleteEventId}
          onDelete={deleteMutation.mutate}
        />
      )}
    </div>
  );
}
