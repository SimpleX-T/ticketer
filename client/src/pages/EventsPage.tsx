import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaSearch } from "react-icons/fa";

import { categoryTags } from "../utils/constants";
import { Input } from "../components/ui/input"; // Assuming you have this
import { getUpcomingEvents } from "../services/eventServices";
import { EventCard } from "../components/ui/EventCard";
import { FeaturedEventCard } from "../components/events/FeaturedEventCard";
import { Event } from "../types";

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["upcomingEvents"],
    queryFn: getUpcomingEvents,
  });

  // Filter events based on search and category
  const filteredEvents = events?.filter((event) => {
    const matchesSearch = event.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? event.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  // Get featured event (e.g., first non-sold-out event or first event)
  const featuredEvent = events?.find((e) => !e.soldOut) || filteredEvents?.[0];

  return (
    <div className="min-h-screen bg-primary text-secondary pb-12 pt-32">
      <section className="relative px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Discover Upcoming Events
          </h1>
          <div className="border border-secondary/40 mb-8 rounded-xl overflow-hidden shadow-sm">
            {isLoading ? (
              <div className="h-64 md:h-96 bg-primary-200 rounded-xl animate-pulse" />
            ) : featuredEvent ? (
              <FeaturedEventCard event={featuredEvent} />
            ) : (
              <p className="text-gray-300">No upcoming events found.</p>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 mb-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-1/3">
            <Input
              id="search"
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-primary-200 text-white border-secondary-200"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-100" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer ${
                !selectedCategory
                  ? "bg-primary border border-secondary text-white"
                  : "bg-primary-300 text-secondary hover:bg-secondary-200"
              }`}
            >
              All
            </button>
            {categoryTags.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors duration-200 ${
                  selectedCategory === cat.value
                    ? "bg-primary border border-secondary text-white"
                    : "bg-primary-300 text-secondary hover:bg-secondary-200"
                }`}
                style={{
                  backgroundColor:
                    selectedCategory === cat.value
                      ? undefined
                      : cat.backgroundColor,
                  color:
                    selectedCategory === cat.value ? undefined : cat.textColor,
                }}
              >
                {cat.value}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-primary-200 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : filteredEvents && filteredEvents.length > 1 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents
                .filter((e) => e.id !== featuredEvent?.id)
                .map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
            </div>
          ) : (
            <p className="text-gray-300 text-center">
              No events match your filters.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
