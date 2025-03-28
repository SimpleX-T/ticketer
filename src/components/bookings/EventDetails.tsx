import { FaMap, FaTag } from "react-icons/fa6";
import { User, Event } from "../../types";
import Skeleton from "./Skeleton";
import { CalendarDate } from "../ui/CalendarDate";
import { formatFullDate, formatTimeFromDateString } from "../../utils/helpers";
import { categoryTags } from "../../utils/constants";

interface EventDetailsProps {
  event: Event | null;
  organizer: User | null;
}

export function EventDetails({ event, organizer }: EventDetailsProps) {
  if (!event) return <Skeleton />;

  return (
    <div className="w-full md:w-1/2 md:pr-6">
      <div className="mb-3">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <h2 className="text-2xl font-bold text-white mb-2">{event.name}</h2>
        <p className="text-gray-300">{event.description}</p>
      </div>

      <hr className="border-[0.5px] border-secondary-200" />

      <div className="flex items-end md:items-start md:flex-col mt-4 gap-2">
        <div className="flex items-center gap-3 bg-secondary-100 md:p-1 rounded-lg text-white md:pr-2">
          <CalendarDate date={event.startDate} />
          <div className="hidden md:block">
            <h3 className="text-sm font-semibold">
              {formatFullDate(event.startDate)}
            </h3>
            <p className="text-xs">
              {formatTimeFromDateString(event.startDate)}
            </p>
          </div>
        </div>

        <div className="flex items-center md:items-end gap-3 my-0 flex-col md:flex-row">
          <div className="flex items-center text-secondary bg-secondary-200 p-1 rounded-md">
            <FaMap className="inline-block mr-2 text-secondary" size={12} />
            <span
              className="text-xs line-clamp-1 truncate block w-[25ch]"
              title={event.location}
            >
              {event.location}
            </span>
          </div>
          <div
            className="flex items-center text-secondary p-1 rounded-md"
            style={{
              background: categoryTags.find(
                (el) => el.value === event.category.toLowerCase()
              )?.backgroundColor,
              color: categoryTags.find(
                (el) => el.value === event.category.toLowerCase()
              )?.textColor,
            }}
          >
            <FaTag className="inline-block mr-2" size={12} />
            <span className="text-xs">{event.category}</span>
          </div>
        </div>
      </div>

      {organizer && (
        <div className="flex items-center mt-2">
          <div className="flex items-center gap-1 p-1 bg-secondary-200 rounded-md">
            <span className="text-sm text-secondary">Hosted by</span>
            <span className="text-secondary text-sm">
              {organizer.displayName || ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
