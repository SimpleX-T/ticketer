import Barcode from "react-barcode";
import { FaTimes } from "react-icons/fa";
import { Event, Ticket, TicketType, User } from "../../../types";
import { BiCalendar } from "react-icons/bi";
import { motion } from "motion/react";
import { FaDownload } from "react-icons/fa6";
import { formatDateString } from "../../../utils/helpers";

type TicketPreviewModalProps = {
  ticketEvent: Event | undefined;
  ticketUser: User | null;
  ticketType: TicketType | undefined;
  ticket: Ticket;
  onclose: (state: boolean) => void;
};

export const TicketPreviewModal: React.FC<TicketPreviewModalProps> = ({
  ticketEvent,
  ticketUser,
  ticketType,
  ticket,
  onclose,
}) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative ticket p-8 rounded-2xl shadow-2xl w-full max-w-[400px] mx-4 lg:mx-0 lg:ml-[calc(250px+2rem)]"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Close button */}
        <motion.button
          onClick={() => onclose(false)}
          className="absolute top-8 right-4 text-white hover:text-gray-300 transition-colors"
          whileHover={{ scale: 1.1 }}
        >
          <FaTimes className="text-xl" />
        </motion.button>

        {/* Ticket content */}
        <div className="space-y-6">
          {/* Event header */}
          <div className="text-center">
            <motion.h2
              className="text-5xl font-bold mb-2 bg-gradient-to-r from-secondary to-secondary-100 bg-clip-text text-transparent font-[Road_Rage]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {ticketEvent?.name}
            </motion.h2>
            <div className="space-y-1 text-gray-300">
              <p className="text-sm flex items-center justify-center gap-1">
                <BiCalendar className="inline-block" />
                {formatDateString(ticketEvent?.startDate || "")}
              </p>
              <p className="text-sm">{ticketEvent?.location}</p>
            </div>
          </div>

          {/* Profile image */}
          <motion.div
            className="relative w-32 h-32 rounded-xl overflow-hidden border-4 border-white/20 mx-auto"
            whileHover={{ rotate: 2 }}
          >
            {ticketUser?.profileImage ? (
              <img
                src={ticketUser.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </motion.div>

          {/* User info grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1 p-3 bg-white/5 rounded-lg">
              <p className="text-gray-400">Name</p>
              <p className="font-medium text-secondary-100">{`${ticketUser?.firstname} ${ticketUser?.lastname}`}</p>
            </div>

            <div className="space-y-1 p-3 bg-white/5 rounded-lg">
              <p className="text-gray-400">Email</p>
              <p className="truncate text-secondary-100">{ticketUser?.email}</p>
            </div>

            <div className="space-y-1 p-3 bg-white/5 rounded-lg">
              <p className="text-gray-400">Ticket Type</p>
              <p className="text-secondary-100">{ticketType?.type}</p>
            </div>

            <div className="space-y-1 p-3 bg-white/5 rounded-lg">
              <p className="text-gray-400">Capacity</p>
              <p className="text-secondary-100">{ticketEvent?.totalCapacity}</p>
            </div>
          </div>

          {/* Special requests */}
          {ticket.specialRequests && (
            <motion.div
              className="p-4 bg-white/5 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-400 mb-1">Special Requests</p>
              <p className="text-sm">{ticket.specialRequests}</p>
            </motion.div>
          )}

          {/* Barcode */}
          <motion.div
            className="mt-6 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Barcode
              value={ticket.id as string}
              height={50}
              width={1}
              background="transparent"
              lineColor="#ffffff"
              fontSize={12}
            />
          </motion.div>
        </div>

        <div className="flex items-center justify-center absolute -bottom-18 w-full left-0">
          <div className="p-2">
            <button
              type="button"
              className="flex items-center gap-4 hover:border-secondary transition-colors duration-300 border border-secondary/40 cursor-pointer p-2 rounded-md"
            >
              <FaDownload className="text-secondary" size={20} />
              <span className="text-secondary">Download Ticket</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
