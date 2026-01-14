import { Link } from "react-router-dom";
import { Event } from "../../types";
import { categoryTags } from "../../utils/constants";
import { formatDateString } from "../../utils/helpers";
import { FaArrowRight } from "react-icons/fa6";

export const EventCard = ({ event }: { event: Event }) => (
  <Link
    to={`/events/${event.id}`}
    className="group flex flex-col bg-primary-300 rounded-xl overflow-hidden shadow-md border border-secondary/10 hover:shadow-lg transition-all duration-300"
  >
    <div className="relative h-48 overflow-hidden">
      <img
        src={event.image}
        alt={event.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {event.soldOut && (
        <span className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold text-white bg-red-600/80 rounded">
          Sold Out
        </span>
      )}
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <span
        className="self-start px-2 py-0.5 text-xs font-medium rounded-full mb-2"
        style={{
          backgroundColor:
            categoryTags.find((cat) => cat.value === event.category)
              ?.backgroundColor || "#6c757d",
          color:
            categoryTags.find((cat) => cat.value === event.category)
              ?.textColor || "#ffffff",
        }}
      >
        {event.category}
      </span>
      <h3 className="text-lg font-semibold text-secondary line-clamp-2">
        {event.name}
      </h3>
      <p className="text-sm text-secondary-100 mt-1">
        {formatDateString(event.startDate)}
      </p>
      <p className="text-sm text-secondary-100">{event.location}</p>
      <div className="mt-auto pt-3 flex items-center gap-2 text-secondary group-hover:text-secondary-100 transition-colors duration-300">
        <span className="text-sm font-medium">Explore</span>
        <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
      </div>
    </div>
  </Link>
);
