import { Event } from "../../types";

interface TicketAvailabilityProps {
  event: Event | null;
}

export function TicketAvailability({ event }: TicketAvailabilityProps) {
  if (!event || !event.totalCapacity) return null;

  const remaining = event.totalCapacity - (event.ticketsSold || 0);
  const percentage = (remaining / event.totalCapacity) * 100;

  return (
    <div className="w-full mt-6 p-4 bg-primary-200 rounded-lg border border-primary-100/40">
      <h3 className="text-lg font-semibold text-white mb-2">
        Ticket Availability
      </h3>
      <div className="flex items-center gap-2">
        <div className="w-full bg-secondary-200 rounded-full h-2.5">
          <div
            className="bg-secondary h-2.5 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-gray-300">
          {remaining} of {event.totalCapacity} remaining
        </span>
      </div>
    </div>
  );
}
