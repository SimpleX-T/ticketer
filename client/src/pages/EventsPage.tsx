import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Loader2, Calendar, Sparkles } from "lucide-react";

import { listEvents } from "../services/eventServices";
import { EventCard } from "../components/events/EventCardNew";
import { EventFilters, FilterState } from "../components/events/EventFilters";
import { FeaturedEventCard } from "../components/events/FeaturedEventCard";
import { Event, TicketType } from "../types";

export default function EventsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "",
    priceFilter: "all",
    dateFilter: "all",
    sortBy: "date_asc",
  });

  // Fetch events
  const { data: eventsData, isLoading } = useQuery({
    queryKey: ["events", filters],
    queryFn: () =>
      listEvents({
        search: filters.search || undefined,
        category: filters.category || undefined,
      }),
  });

  const events = eventsData?.events || [];

  // Client-side filtering for price and date
  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Price filter
    if (filters.priceFilter === "free") {
      result = result.filter((e: Event) =>
        e.ticketTypes?.some((tt: TicketType) => tt.price === 0)
      );
    } else if (filters.priceFilter === "paid") {
      result = result.filter((e: Event) =>
        e.ticketTypes?.every((tt: TicketType) => tt.price > 0)
      );
    }

    // Date filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const monthEnd = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (filters.dateFilter === "today") {
      result = result.filter((e) => {
        const eventDate = new Date(e.startDate);
        return eventDate.toDateString() === today.toDateString();
      });
    } else if (filters.dateFilter === "week") {
      result = result.filter((e) => {
        const eventDate = new Date(e.startDate);
        return eventDate >= today && eventDate <= weekEnd;
      });
    } else if (filters.dateFilter === "month") {
      result = result.filter((e) => {
        const eventDate = new Date(e.startDate);
        return eventDate >= today && eventDate <= monthEnd;
      });
    } else if (filters.dateFilter === "upcoming") {
      result = result.filter((e) => new Date(e.startDate) >= today);
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "date_asc":
          return (
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          );
        case "date_desc":
          return (
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
        case "price_asc":
          const minA = Math.min(
            ...(a.ticketTypes?.map((t: TicketType) => t.price) || [0])
          );
          const minB = Math.min(
            ...(b.ticketTypes?.map((t: TicketType) => t.price) || [0])
          );
          return minA - minB;
        case "price_desc":
          const maxA = Math.max(
            ...(a.ticketTypes?.map((t: TicketType) => t.price) || [0])
          );
          const maxB = Math.max(
            ...(b.ticketTypes?.map((t: TicketType) => t.price) || [0])
          );
          return maxB - maxA;
        case "popularity":
          return b.ticketsSold - a.ticketsSold;
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

    return result;
  }, [events, filters]);

  const featuredEvent = events.find((e: Event) => !e.soldOut) || events[0];

  return (
    <div className="min-h-screen bg-primary text-secondary pb-12 pt-28">
      {/* Hero Section */}
      <section className="relative px-6 md:px-10 mb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-secondary" />
                Discover Events
              </h1>
              <p className="text-secondary-100 mt-2">
                Find amazing events happening near you
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-secondary-100">
              <Calendar className="w-4 h-4" />
              {filteredEvents.length} events found
            </div>
          </motion.div>

          {/* Featured Event */}
          {!isLoading && featuredEvent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="border border-secondary/20 rounded-2xl overflow-hidden shadow-xl mb-8"
            >
              <FeaturedEventCard event={featuredEvent} />
            </motion.div>
          )}
        </div>
      </section>

      {/* Filters Section */}
      <section className="px-6 md:px-10 mb-8 sticky top-20 z-20 bg-primary/80 backdrop-blur-xl py-4 -mt-4">
        <div className="max-w-7xl mx-auto">
          <EventFilters
            onFilterChange={setFilters}
            onViewChange={setViewMode}
            viewMode={viewMode}
          />
        </div>
      </section>

      {/* Events Grid/List */}
      <section className="px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-secondary animate-spin mb-4" />
              <p className="text-secondary-100">Loading events...</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {filteredEvents
                .filter((e) => e.id !== featuredEvent?.id)
                .map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <EventCard event={event} viewMode={viewMode} />
                  </motion.div>
                ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-full bg-primary-200 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-secondary-100" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No events found
              </h3>
              <p className="text-secondary-100 max-w-md mx-auto">
                {filters.search || filters.category
                  ? "Try adjusting your filters to find more events"
                  : "There are no upcoming events at the moment. Check back soon!"}
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
