import { useEffect, useRef, useState } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";
import { DeleteModal } from "./DeleteModal";
import { TicketPreviewModal } from "./TicketPreviewModal";
import { useQuery } from "@tanstack/react-query";
import { Ticket, User } from "../../../types";
import { useAuth } from "../../../contexts/AuthContext";
import { getEventDetails } from "../../../services/eventServices";
import { getTicketTypeById } from "../../../services/ticketServices";
import { supabase } from "../../../services/supabaseClient";
import { AnimatePresence, motion } from "motion/react";

export const TicketCard = ({
  ticket,
  onSelect,
  deleteTicket,
  openModal,
  setOpenModal,
}: {
  ticket: Ticket;
  onSelect: (ticket: Ticket) => void;
  deleteTicket: (id: string) => void;
  openModal: boolean;
  setOpenModal: (state: boolean) => void;
  selectedTicket: Ticket;
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const optionRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();

  const [ticketUser, setTicketUser] = useState<User | null>(null);

  const {
    data: ticketEvent,
    error: eventError,
    isLoading: isFetchingEvent,
  } = useQuery({
    queryFn: () => getEventDetails(ticket.eventId),
    queryKey: ["event", ticket.eventId],
    enabled: !!ticket.eventId,
  });

  const {
    data: ticketType,
    error: ticketTypeError,
    isLoading: isGettingTicketType,
  } = useQuery({
    queryFn: () => getTicketTypeById(ticket.ticketTypeId),
    queryKey: ["ticketType", ticket.ticketTypeId],
    enabled: !!ticket.ticketTypeId,
  });

  useEffect(() => {
    const setUser = async () => {
      if (user?.id && user.id === ticket.userId) {
        setTicketUser(user);
      } else {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", ticket.userId)
          .single();

        if (error) throw error;

        setTicketUser(data);
      }
    };

    setUser();
  }, [ticket.userId, user]);

  const handleShowOption = () => {
    setShowOptions(true);
  };

  const handleViewTicket = () => {
    onSelect(ticket);
    setShowOptions(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (optionRef.current && !optionRef.current.contains(e.target as Node)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
  };

  if (eventError) return <div>{eventError.message}</div>;
  if (ticketTypeError) return <div>{ticketTypeError.message}</div>;

  return (
    <div>
      <motion.div
        key={ticket.id}
        className="relative flex rounded-lg shadow-lg h-36 w-[400px] bg-gradient-to-br from-primary-100 to-secondary-300 border-2 border-dashed border-secondary-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Perforation effect */}
        <div className="absolute -bottom-[2px] left-0 right-0 h-[4px] bg-repeat-x bg-[length:10px_2px] bg-gradient-to-r from-transparent via-secondary to-transparent" />

        {/* Image section with ticket notch */}
        <div className="relative aspect-square min-h-full overflow-hidden rounded-l-lg">
          <div className="absolute right-0 top-1/2 w-3 h-6 bg-secondary -translate-y-1/2 translate-x-1/2 clip-triangle" />
          {isFetchingEvent ? (
            <div className="w-full h-full bg-gray-200 animate-pulse" />
          ) : ticketEvent?.image ? (
            <img
              src={ticketEvent.image}
              alt={ticketEvent.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          )}
        </div>

        {/* Content section */}
        <div className="p-4 pr-8 flex-1 relative">
          {/* Decorative stripe */}
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-secondary to-secondary-100" />

          <div className="ml-3">
            {isFetchingEvent ? (
              <div className="w-36 rounded-sm h-4 bg-gray-200 animate-pulse mb-2" />
            ) : (
              <motion.h3
                className="text-sm md:text-lg mb-2 font-bold text-secondary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {ticketEvent?.name}
              </motion.h3>
            )}
          </div>

          {/* Option button */}
          <motion.div
            className="absolute top-4 right-4"
            ref={optionRef}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <button
              className="flex items-center justify-center p-1 hover:bg-secondary-100 cursor-pointer rounded-md transition-colors"
              onClick={handleShowOption}
            >
              <FaEllipsisVertical className="text-gray-600 text-sm" />
            </button>

            <AnimatePresence>
              {showOptions && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`${
                    showOptions ? "flex" : "hidden"
                  } flex-col text-center border-secondary-100 border rounded-sm bg-secondary-200 absolute top-3/2 right-1/5 w-28`}
                >
                  <button
                    className="text-secondary text-xs cursor-pointer hover:bg-secondary/20 transition-colors duration-300 p-2"
                    onClick={handleViewTicket}
                  >
                    View Ticket
                  </button>
                  <button
                    className="text-secondary text-xs cursor-pointer hover:bg-secondary/20 transition-colors duration-300 p-2"
                    onClick={handleOpenDeleteModal}
                  >
                    Delete Ticket
                  </button>
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {showDeleteModal && (
          <DeleteModal
            onclick={() => deleteTicket(ticket.id)}
            onclose={() => setShowDeleteModal(false)}
          />
        )}
      </motion.div>

      {openModal && (
        <motion.div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {isGettingTicketType ? (
            <motion.div
              className="bg-secondary rounded-lg p-6 w-96"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
            </motion.div>
          ) : (
            <TicketPreviewModal
              ticketEvent={ticketEvent}
              ticketUser={ticketUser}
              ticketType={ticketType}
              ticket={ticket}
              onclose={setOpenModal}
            />
          )}
        </motion.div>
      )}
    </div>
  );
};
