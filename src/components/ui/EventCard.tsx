import { Link } from "react-router-dom";
import { Event } from "../../types";
import { categoryTags } from "../../utils/constants";
import { formatDateString } from "../../utils/helpers";
import { FaArrowRight, FaMapMarkerAlt } from "react-icons/fa";

export const EventCard = ({ event }: { event: Event }) => {
  const isPastEvent = new Date(event.date) < new Date();
  const category = categoryTags.find((cat) => cat.value === event.category) || {
    backgroundColor: "#6c757d",
    textColor: "#ffffff",
  };

  return (
    <Link
      to={isPastEvent ? "#" : `/events/${event.id}`}
      className="group flex w-full lg:w-1/2 flex-col md:flex-row bg-primary-300 text-secondary rounded-xl overflow-hidden shadow-md border border-secondary/10 transition-all duration-300 hover:shadow-lg relative"
      style={{ opacity: isPastEvent ? 0.5 : 1 }}
    >
      {/* Overlay for past events */}
      {/* {isPastEvent && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
          <span className="text-lg font-bold text-white">Event Over</span>
        </div>
      )} */}

      {/* Sold Out Overlay */}
      {event.soldOut && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
          <span className="text-lg font-bold text-white">Sold Out</span>
        </div>
      )}

      {/* Event Image */}
      <div className="w-full md:w-56 h-40 md:h-auto overflow-hidden">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Event Details */}
      <div className="flex flex-col flex-grow p-4">
        {/* Category Badge */}
        <span
          className="self-start px-3 py-1 text-xs rounded-full mb-2"
          style={{
            backgroundColor: category.backgroundColor,
            color: category.textColor,
          }}
        >
          {event.category || "Event"}
        </span>

        {/* Event Name */}
        <h3 className="text-lg font-semibold truncate">{event.name}</h3>

        {/* Event Date */}
        <p className="text-secondary-100 text-sm">
          {formatDateString(event.date)}
        </p>

        {/* Location */}
        <div className="flex items-center text-secondary-100 text-sm mt-1">
          <FaMapMarkerAlt className="mr-2 text-secondary" size={12} />
          <span className="truncate">{event.location}</span>
        </div>

        {/* View Details Button */}
        <div className="mt-auto flex items-center gap-2 border-t border-secondary/10 pt-3">
          <span className="text-md text-secondary group-hover:text-primary transition-colors duration-300">
            View Details
          </span>
          <FaArrowRight className="text-secondary group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  );
};
