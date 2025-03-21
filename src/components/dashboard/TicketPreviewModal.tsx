import Barcode from "react-barcode";
import { FaTimes } from "react-icons/fa";
import { Event, Ticket, TicketType, User } from "../../types";
import { BiCalendar } from "react-icons/bi";

type TicketPreviewModalProps = {
  ticketEvent: Event | undefined;
  ticketUser: User | null;
  ticketType: TicketType | undefined;
  ticket: Ticket;
  onclose: (state: boolean) => void;
};

const TicketPreviewModal: React.FC<TicketPreviewModalProps> = ({
  ticketEvent,
  ticketUser,
  ticketType,
  ticket,
  onclose,
}) => {
  return (
    <div className="w-full flex items-center justify-center h-full relative">
      <div className="p-6 mb-8 w-full ticket max-w-[400px] mx-auto mt-20">
        <div className="border border-secondary w-full rounded-xl p-4">
          <div className="mb-6 text-center">
            <h2 className="text-5xl font-semibold font-[Road_Rage] text-white mb-2">
              {ticketEvent?.name}
            </h2>
            <address className="text-white text-xs not-italic">
              📍 {ticketEvent?.location}
            </address>
            <p className="text-white text-xs">
              <BiCalendar className="inline-block mr-2" />{" "}
              {ticketEvent?.startDate}
            </p>
          </div>

          <div className="gap-6 mb-6 flex items-center justify-center w-48 h-48 rounded-xl overflow-hidden border-[4px] mx-auto border-secondary">
            {ticketUser?.profileImage && (
              <img
                src={ticketUser.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="bg-secondary-300 rounded-lg p-2 mb-2">
            <div className="grid grid-cols-2 text-white mb-4">
              <div className="border border-t-transparent border-l-transparent border-gray-500 py-1 pr-2">
                <span className="text-xs py-2 text-gray-500 mb-1">Name</span>
                <p className="text-xs">{`${ticketUser?.firstname} ${ticketUser?.lastname}`}</p>
              </div>

              <div className="border-b border-gray-500 py-1 pl-2">
                <span className="text-xs py-2 text-gray-500 mb-1">Email</span>
                <p className="text-xs truncate">{ticketUser?.email}</p>
              </div>

              <div className="border-r border-b border-gray-500 py-1 pr-2">
                <span className="text-xs py-2 text-gray-500">Ticket Type</span>
                <p className="text-xs truncate">{ticketType?.type}</p>
              </div>

              <div className="border-b border-gray-500 py-1 pl-2">
                <span className="text-xs text-gray-500 py-2">Ticket for</span>
                <p className="text-xs truncate">{ticketEvent?.totalCapacity}</p>
              </div>
            </div>

            {ticket.specialRequests && (
              <div>
                <span className="text-xs text-gray-500 py-2">
                  Special Request
                </span>
                <p className="text-xs text-white">{ticket.specialRequests}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center">
          <Barcode
            value={ticket.id as string}
            height={50}
            width={1}
            displayValue={true}
            background=""
            lineColor="#ffffff"
            fontSize={14}
          />
        </div>

        <button
          onClick={() => onclose(false)}
          className="flex items-center justify-center absolute top-20 text-white bg-primary right-1/5 p-2 rounded-full cursor-pointer"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default TicketPreviewModal;
