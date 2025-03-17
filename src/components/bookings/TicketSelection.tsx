import { Link } from "react-router-dom";
import { TicketSelectionProps } from "../../types";
import { FaCalendar } from "react-icons/fa6";
import { formatDateString } from "../../utils/helpers";

export const TicketSelection: React.FC<TicketSelectionProps> = ({
  event,
  selectedTicket,
  onSelectTicket,
  onNext,
  // ticketCount,
  // onChangeTicketCount,
}) => {
  return (
    <div className="bg-primary-400 border border-secondary-200 rounded-xl p-8">
      <div className="w-full h-32 mb-8 rounded-lg border border-secondary-200 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-secondary-200 via-transparent to-primary" />
        <img
          src={event?.image}
          alt={event?.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="bg-gradient-to-br from-secondary-200 via-transparent to-transparent border-2 border-secondary-200 p-3 rounded-2xl mb-8 text-center">
        <h2 className="text-6xl font-bold text-white mb-2 font-[Road_Rage] capitalize">
          {event?.name}
        </h2>
        <p className="text-md text-white">{event?.description}</p>
        <p className="text-xs text-center w-full justify-center text-gray-300 flex flex-wrap gap-2 mt-1">
          <span className="inline">📍{event?.location}</span>
          ||
          <span className="flex items-center">
            <FaCalendar size={10} className="inline mr-1" />
            {formatDateString(event?.date || "")}
          </span>
        </p>
      </div>

      <hr className="border-2 border-secondary-200 mb-8" />

      <div>
        <h3 className="text-md font-serif text-white mb-2">
          Select Ticket Type
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full bg-secondary-400 rounded-xl border border-secondary-200 p-2">
          {event?.ticketTypes.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => onSelectTicket(ticket.id)}
              className={`
              p-6 rounded-lg transition-colors border border-secondary-100 duration-300 cursor-pointer
              ${
                selectedTicket === ticket.id
                  ? "bg-[#12464E]"
                  : "bg-transparent hover:bg-[#12464E]/20"
              }
            `}
            >
              <div className="text-white font-bold">${ticket.price}</div>
              <div className="text-white text-sm">{ticket.name}</div>
              <div className="text-teal-300 text-xs">
                {ticket.available}/{ticket.total}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* <select
        // value={ticketCount}
        // onChange={onChangeTicketCount}
        className="w-full px-4 py-2 border border-secondary-200 rounded-md text-white mb-4"
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select> */}

      <div className="flex items-center justify-between gap-4">
        <Link
          to="/"
          className="w-1/2 py-2 flex items-center justify-center text-white cursor-pointer border border-secondary rounded-md"
        >
          Cancel
        </Link>

        <button
          onClick={onNext}
          disabled={!selectedTicket}
          className="w-1/2 py-2 bg-secondary cursor-pointer text-white rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/80"
        >
          Next
        </button>
      </div>
    </div>
  );
};
