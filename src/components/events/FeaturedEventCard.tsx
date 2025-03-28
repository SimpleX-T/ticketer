import { Link } from "react-router-dom";
import { Event } from "../../types";
import { categoryTags } from "../../utils/constants";
import { formatDateString } from "../../utils/helpers";

export const FeaturedEventCard = ({ event }: { event: Event }) => (
  <Link
    to={`/events/${event.id}`}
    className="relative group bg-primary-200 rounded-xl shadow-lg transition-all duration-300"
  >
    <div className="w-full h-64 md:h-96 overflow-hidden rounded-t-xl">
      <img
        src={event.image}
        alt={event.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>

    <div className="p-6 text-white">
      <span
        className="inline-block px-3 py-1 text-xs font-medium rounded-full mb-2"
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
      <h2 className="text-2xl md:text-3xl font-bold mb-2">{event.name}</h2>
      <p className="text-sm">
        {formatDateString(event.startDate)} • {event.location}
      </p>
      {event.soldOut && (
        <span className="mt-2 inline-block px-3 py-1 text-xs font-semibold text-white bg-red-600/80 rounded">
          Sold Out
        </span>
      )}
    </div>
  </Link>
);
