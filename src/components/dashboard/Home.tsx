import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FaTicketAlt } from "react-icons/fa";
import { BiSolidDashboard } from "react-icons/bi";
import { Event, Ticket } from "../../types";
import { getUserTickets } from "../../services/ticketServices";
import { getUpcomingEvents } from "../../services/eventServices";
import { EventCard } from "../ui/EventCard";

export default function Home() {
  const { user } = useAuth();

  // Fetch user's tickets with React Query
  const {
    data: tickets,
    isLoading: ticketsLoading,
    error: ticketsError,
  } = useQuery<Ticket[]>({
    queryKey: ["userTickets", user?.id],
    queryFn: () => getUserTickets(user?.id || ""),
    enabled: !!user?.id,
  });

  // Fetch upcoming events
  const {
    data: events,
    isLoading: eventsLoading,
    error: eventsError,
  } = useQuery<Event[]>({
    queryKey: ["upcomingEvents"],
    queryFn: getUpcomingEvents,
  });

  return (
    <div className="p-6 md:p-10">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-secondary">
          Welcome, {user?.displayName || user?.firstname || "User"}!
        </h2>
        <p className="text-gray-600 mt-2">
          Manage your tickets and profile with ease.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link
          to="/dashboard/tickets"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors duration-200"
        >
          <FaTicketAlt />
          View My Tickets
        </Link>
        <Link
          to="/dashboard/settings"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-colors duration-200"
        >
          <BiSolidDashboard />
          Edit Profile
        </Link>
      </div>

      {/* Tickets Overview */}
      {/* <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Your Tickets
        </h3>
        {ticketsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : ticketsError ? (
          <p className="text-red-500">
            Error loading tickets: {(ticketsError as Error).message}
          </p>
        ) : tickets?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tickets.slice(0, 3).map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <h4 className="text-lg font-medium text-gray-800">
                  {ticket.eventName}
                </h4>
                <p className="text-sm text-gray-600">
                  {new Date(ticket.date).toLocaleDateString()}
                </p>
                <span
                  className={`mt-2 inline-block px-2 py-1 text-xs rounded-full ${
                    ticket.status === "active"
                      ? "bg-green-100 text-green-700"
                      : ticket.status === "used"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {ticket.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No tickets yet. Get started!</p>
        )}
        {tickets?.length > 3 && (
          <Link
            to="/dashboard/tickets"
            className="mt-4 inline-block text-blue-500 hover:underline"
          >
            See all tickets
          </Link>
        )}
      </section> */}

      {/* Upcoming Events */}
      <section>
        <h3 className="text-xl font-semibold text-secondary mb-4">
          Upcoming Events
        </h3>
        {eventsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-40 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : eventsError ? (
          <p className="text-red-500">
            Error loading events: {(eventsError as Error).message}
          </p>
        ) : events?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event} />
              // <div
              //   key={event.id}
              //   className="bg-secondary-100 p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              // >
              //   {event.image && (
              //     <img
              //       src={event.image}
              //       alt={event.name}
              //       className="w-full h-24 object-cover rounded-t-lg mb-2"
              //     />
              //   )}
              //   <h4 className="text-lg font-medium text-gray-800">
              //     {event.name}
              //   </h4>
              //   <p className="text-sm text-gray-600">
              //     {new Date(event.startDate).toLocaleDateString()}
              //   </p>
              // </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No upcoming events.</p>
        )}
        {events && events?.length > 3 && (
          <Link
            to="/dashboard/events"
            className="mt-4 inline-block text-blue-500 hover:underline"
          >
            See all events
          </Link>
        )}
      </section>
    </div>
  );
}
