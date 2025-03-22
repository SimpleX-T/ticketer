import { motion } from "motion/react";
import { useState } from "react";
import { useGetEvents } from "../../../hooks/useQueryHooks";
import { Link } from "react-router-dom";
import { FaArrowRight, FaMarker } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { Event } from "../../../types";

export default function Events() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Fetch real events from Firestore using React Query
  const { data: events = [], isLoading, error } = useGetEvents();

  // Filter events based on search term and category
  const filteredEvents = events.slice(0, 3).filter((event: Event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" ||
      event.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Fallback to mock events if there's an error or no events are available
  const displayEvents =
    filteredEvents.length > 0 ? filteredEvents : error ? [] : [];

  // Categories for filtering
  const categories = [
    { id: "all", name: "All Events" },
    { id: "entertainment", name: "Entertainment" },
    { id: "conference", name: "Conferences" },
    { id: "workshop", name: "Workshops" },
    { id: "sport", name: "Sports" },
  ];

  return (
    <section
      id="events"
      className="py-24 bg-primary relative mx-auto px-4 z-50"
    >
      <div className="mb-16 z-50 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="bg-secondary/20 text-secondary px-4 py-1 rounded-full text-sm font-medium">
            DISCOVER
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-center text-secondary mt-4 mb-6">
            Upcoming Events
          </h2>
          <p className="text-secondary-100 max-w-2xl mx-auto text-lg mb-8">
            Find and book tickets for the most exciting events happening near
            you.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setCategoryFilter(category.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                categoryFilter === category.id
                  ? "bg-secondary text-white"
                  : "bg-primary-300 text-secondary hover:bg-primary-100"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-secondary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-6 text-secondary text-lg">
            Loading amazing events...
          </p>
        </div>
      ) : (
        // <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto place-items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {displayEvents.length > 0 ? (
            displayEvents.map((event: Event) => (
              <motion.div
                key={event.id}
                className="relative group h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Link
                  to={
                    event.endDate < new Date().toISOString()
                      ? "#"
                      : `/events/${event.id}`
                  }
                  className="h-full flex flex-col relative bg-primary-300 text-secondary rounded-2xl overflow-hidden shadow-xl border border-secondary/10 hover:border-secondary/30 transition-all duration-300 hover:shadow-2xl"
                  style={{
                    opacity: event.endDate < new Date().toISOString() ? 0.5 : 1,
                  }}
                >
                  {event.endDate < new Date().toISOString() && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
                      <span className="text-2xl font-bold text-secondary">
                        Event Over
                      </span>
                    </div>
                  )}
                  <div className="relative">
                    {event.soldOut && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
                        <span className="text-2xl font-bold text-white">
                          Sold Out
                        </span>
                      </div>
                    )}

                    {/* Event Category Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-secondary/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                        {event.category || "Event"}
                      </span>
                    </div>

                    {/* Date Badge */}
                    <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm text-secondary rounded-lg overflow-hidden shadow-lg">
                      <div className="bg-secondary text-white text-xs font-bold py-1 px-3 text-center">
                        {new Date(
                          event.startDate || event.createdAt
                        ).toLocaleString("default", { month: "short" })}
                      </div>
                      <div className="py-1 px-3 text-center font-bold">
                        {new Date(event.startDate || event.createdAt).getDate()}
                      </div>
                    </div>

                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <h3 className="text-xl font-bold line-clamp-2">
                        {event.name}
                      </h3>
                    </div>

                    <div className="flex items-center text-secondary/70 mb-3 text-sm">
                      <FaMarker className="mr-2 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>

                    <p className="text-secondary/80 mb-4 line-clamp-2 text-sm">
                      {event.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-secondary/10 flex justify-between items-center">
                      <div className="relative flex items-center h-10 overflow-hidden">
                        <span className="text-md bg-secondary/10 hover:bg-secondary/20 text-secondary px-3 py-1 transition-colors duration-300 border border-r-transparent h-full flex items-center">
                          View Details
                        </span>
                        <span className="flex items-center justify-center bg-secondary/10 hover:bg-secondary/20 text-secondary px-3 border-l-transparent border-secondary border h-full transition-colors duration-300">
                          <FaArrowRight />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 col-span-full">
              <div className="bg-primary-300/50 rounded-2xl p-8 max-w-md mx-auto">
                <FiSearch
                  className="mx-auto text-secondary/40 mb-4"
                  size={48}
                />
                <p className="text-secondary text-xl font-medium mb-2">
                  No events found
                </p>
                <p className="text-secondary/70 mb-6">
                  Try adjusting your search or browse different categories
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("all");
                  }}
                  className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors duration-300"
                >
                  View All Events
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
