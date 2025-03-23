import { Link } from "react-router-dom";
import { Event } from "../../types";
import { categoryTags } from "../../utils/constants";
import { formatDateString } from "../../utils/helpers";
import { FaArrowRight, FaMapMarkerAlt } from "react-icons/fa";

export const EventCard = ({ event }: { event: Event }) => {
  const isPastEvent = new Date(event.endDate || event.startDate) < new Date();
  const category = categoryTags.find((cat) => cat.value === event.category) || {
    backgroundColor: "#6c757d",
    textColor: "#ffffff",
  };

  return (
    <Link
      to={isPastEvent || event.soldOut ? "#" : `/events/${event.id}`}
      className="group flex w-full  flex-col md:flex-row bg-primary-300 text-secondary rounded-xl overflow-hidden shadow-md border border-secondary/10 transition-all duration-300 hover:shadow-lg relative"
      style={{ opacity: isPastEvent ? 0.5 : 1 }}
    >
      {/* Sold Out Overlay */}
      {event.soldOut && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <span className="text-md font-semibold text-white px-3 py-1 bg-red-600/80 rounded">
            Sold Out
          </span>
        </div>
      )}

      {/* Event Image */}
      <div className="w-full md:w-48 h-48 md:h-56 overflow-hidden flex-shrink-0">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Event Details */}
      <div className="flex flex-col flex-grow p-5 gap-2">
        {/* Category Badge */}
        <span
          className="self-start px-2 py-0.5 text-xs font-medium rounded-full"
          style={{
            backgroundColor: category.backgroundColor,
            color: category.textColor,
          }}
        >
          {event.category || "Event"}
        </span>

        {/* Event Name */}
        <h3 className="text-lg font-semibold line-clamp-2 leading-tight">
          {event.name}
        </h3>

        {/* Event Date */}
        <p className="text-secondary-100 text-sm">
          {formatDateString(event.startDate)}
        </p>

        {/* Location */}
        <div className="flex items-center text-secondary-100 text-sm">
          <FaMapMarkerAlt className="mr-2 text-secondary" size={12} />
          <span className="line-clamp-1">{event.location}</span>
        </div>

        {/* View Details Button */}
        <div className="mt-3 flex items-center gap-2 pt-3 border-t border-secondary/20">
          <span className="text-sm font-medium text-secondary group-hover:text-secondary-100 transition-colors duration-300">
            View Details
          </span>
          <FaArrowRight className="text-secondary group-hover:translate-x-1 hover:text-secondary-100 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  );
};
