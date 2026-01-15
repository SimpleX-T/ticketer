import { motion } from "motion/react";
import { format } from "date-fns";
import { Calendar, MapPin, Users, Heart, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { Event } from "@/types";
import { getCategoryConfig } from "@/utils/categories";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isEventSaved, toggleSaveEvent } from "@/services/savedEventServices";
import { toast } from "sonner";
import { sonnerStyle } from "@/utils/constants";

interface EventCardProps {
  event: Event;
  viewMode?: "grid" | "list";
}

export function EventCard({ event, viewMode = "grid" }: EventCardProps) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const categoryConfig = getCategoryConfig(event.category);

  // Check if event is saved
  const { data: savedStatus } = useQuery({
    queryKey: ["savedStatus", event.id],
    queryFn: () => isEventSaved(event.id),
    enabled: isAuthenticated,
  });

  const saveMutation = useMutation({
    mutationFn: () => toggleSaveEvent(event.id, savedStatus || false),
    onSuccess: (newStatus) => {
      queryClient.setQueryData(["savedStatus", event.id], newStatus);
      queryClient.invalidateQueries({ queryKey: ["savedEvents"] });
      toast(newStatus ? "Event saved!" : "Event removed from saved", {
        style: sonnerStyle,
      });
    },
  });

  // Get lowest ticket price
  const lowestPrice = event.ticketTypes?.reduce((min, tt) => {
    return tt.price < min ? tt.price : min;
  }, event.ticketTypes[0]?.price || 0);

  const formatDate = (date: string | Date) => {
    try {
      return format(new Date(date), "MMM d, yyyy");
    } catch {
      return "TBA";
    }
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast("Please login to save events", { style: sonnerStyle });
      return;
    }
    saveMutation.mutate();
  };

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary-200 rounded-xl border border-primary-100 overflow-hidden hover:border-secondary/50 transition-all"
      >
        <Link to={`/events/${event.id}`} className="flex gap-4 p-4">
          {/* Image */}
          <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={event.image || "/placeholder.svg"}
              alt={event.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${categoryConfig.bgColor} ${categoryConfig.textColor}`}
                >
                  {categoryConfig.icon} {event.category}
                </span>
                <h3 className="text-white font-semibold mt-1 truncate">
                  {event.name}
                </h3>
              </div>
              <button
                onClick={handleSaveClick}
                className="p-2 rounded-full hover:bg-primary-100 transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${
                    savedStatus
                      ? "fill-red-500 text-red-500"
                      : "text-secondary-100"
                  }`}
                />
              </button>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-secondary-100">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(event.startDate)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate max-w-[150px]">{event.location}</span>
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="text-right flex-shrink-0">
            <p className="text-secondary font-bold">
              {lowestPrice === 0 ? "Free" : `₦${lowestPrice?.toLocaleString()}`}
            </p>
            <p className="text-xs text-secondary-100">
              {event.ticketsSold}/{event.totalCapacity}
            </p>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-primary-200 rounded-xl border border-primary-100 overflow-hidden hover:border-secondary/50 transition-all group"
    >
      <Link to={`/events/${event.id}`}>
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={event.image || "/placeholder.svg"}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Category Badge */}
          <span
            className={`absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${categoryConfig.bgColor} ${categoryConfig.textColor} backdrop-blur-sm`}
          >
            {categoryConfig.icon} {event.category}
          </span>

          {/* Save Button */}
          <button
            onClick={handleSaveClick}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${
                savedStatus ? "fill-red-500 text-red-500" : "text-white"
              }`}
            />
          </button>

          {/* Price Badge */}
          <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-secondary/90 backdrop-blur-sm text-white text-sm font-semibold">
            {lowestPrice === 0 ? "Free" : `₦${lowestPrice?.toLocaleString()}`}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-lg line-clamp-1 group-hover:text-secondary transition-colors">
            {event.name}
          </h3>

          <div className="space-y-2 mt-3 text-sm text-secondary-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-secondary" />
              <span>{formatDate(event.startDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-secondary" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-primary-100">
            <div className="flex items-center gap-1.5 text-sm text-secondary-100">
              <Users className="w-4 h-4" />
              <span>
                {event.ticketsSold}/{event.totalCapacity}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-secondary">
              <Ticket className="w-4 h-4" />
              <span>{event.ticketTypes?.length || 0} types</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
