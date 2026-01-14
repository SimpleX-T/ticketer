import { TicketType } from "../../types";

export const TicketDetails = ({ ticket }: { ticket: TicketType }) => {
  return (
    <div
      className="relative bg-secondary-100 text-white p-4 rounded-lg shadow-lg w-full mx-auto
                    before:content-[''] before:absolute before:top-1/2 before:-left-3 before:w-6 before:h-6 before:bg-primary-200 before:rounded-full before:-translate-y-1/2
                    after:content-[''] after:absolute after:top-1/2 after:-right-3 after:w-6 after:h-6 after:bg-primary-200 after:rounded-full after:-translate-y-1/2"
    >
      <h3 className="text-xl font-bold text-center tracking-wide mb-2">
        Selected Ticket Details
      </h3>
      <div className="text-sm space-y-2 border-t border-secondary-200 pt-3">
        <p className="flex justify-between">
          <span className="text-gray-300">Type:</span>
          <span className="font-medium capitalize">{ticket.type}</span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-300">Price:</span>
          <span className="font-medium">
            {ticket.price === 0 ? "free" : `$${ticket.price}`}
          </span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-300">Available:</span>
          <span className="font-medium">{ticket.total}</span>
        </p>
      </div>
    </div>
  );
};
