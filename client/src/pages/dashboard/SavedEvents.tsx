import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Heart, Loader2, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

import { getSavedEvents } from "@/services/savedEventServices";
import { EventCard } from "@/components/events/EventCardNew";

export default function SavedEvents() {
  const { data: savedEvents, isLoading } = useQuery({
    queryKey: ["savedEvents"],
    queryFn: getSavedEvents,
  });

  return (
    <div className="min-h-screen bg-primary p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-red-500/20">
              <Heart className="w-6 h-6 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">Saved Events</h1>
          </div>
          <p className="text-secondary-100">
            Events you've saved for later. Never miss out on what interests you.
          </p>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-secondary animate-spin mb-4" />
            <p className="text-secondary-100">Loading saved events...</p>
          </div>
        ) : savedEvents && savedEvents.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {savedEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <EventCard event={event} viewMode="grid" />
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
              <Heart className="w-10 h-10 text-secondary-100" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No saved events yet
            </h3>
            <p className="text-secondary-100 max-w-md mx-auto mb-6">
              Start exploring events and save the ones you're interested in by
              clicking the heart icon.
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-white font-medium hover:bg-secondary-100 transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Browse Events
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
