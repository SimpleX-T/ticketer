import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import type { Ticket, User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getEventDetails } from "@/services/eventServices";
import { getTicketTypeById } from "@/services/ticketServices";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/services/supabaseClient";
import {
  Calendar,
  Clock,
  MapPin,
  MoreHorizontal,
  TicketIcon,
  Trash2,
  UserIcon,
  ChevronRight,
} from "lucide-react";
import { DeleteModal } from "./DeleteModal";
import { TicketPreviewModal } from "./TicketPreviewModal";

export function TicketCard({
  ticket,
  onSelect,
  deleteTicket,
  openModal,
  setOpenModal,
  asCard = false,
}: {
  ticket: Ticket;
  onSelect: (ticket: Ticket) => void;
  deleteTicket: (id: string) => void;
  openModal: boolean;
  setOpenModal: (state: boolean) => void;
  selectedTicket: Ticket | null;
  asCard?: boolean;
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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

  if (eventError)
    return <div className="text-red-500">{eventError.message}</div>;
  if (ticketTypeError)
    return <div className="text-red-500">{ticketTypeError.message}</div>;

  // Format date for display
  const formatEventDate = () => {
    if (!ticketEvent?.startDate) return "TBA";
    try {
      const date = new Date(ticketEvent.startDate);
      return format(date, "MMM d, yyyy");
    } catch (e) {
      return "Invalid date" + e;
    }
  };

  // Format time for display
  const formatEventTime = () => {
    if (!ticketEvent?.startDate) return "";
    try {
      const date = new Date(ticketEvent.startDate);
      return format(date, "h:mm a");
    } catch (e) {
      return "" + e;
    }
  };

  // Simplified card view
  if (asCard) {
    return (
      <motion.div
        className="relative w-full max-w-[400px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="relative bg-primary-100 rounded-xl overflow-hidden shadow-lg">
          {/* Top colored accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-100 via-secondary to-primary-100" />

          {/* Ticket stub perforation */}
          <div className="absolute top-0 bottom-0 left-[30%] w-[1px] border-l border-dashed border-secondary/30" />

          {/* Left circle cutout */}
          <div className="absolute left-[30%] top-1/2 w-5 h-5 rounded-full bg-primary -translate-x-1/2 -translate-y-1/2 border border-dashed border-secondary/30" />

          <div className="flex">
            {/* Left side - Event image */}
            <div className="w-[30%] relative">
              {isFetchingEvent ? (
                <div className="aspect-square bg-gray-200 animate-pulse" />
              ) : ticketEvent?.image ? (
                <div className="aspect-square relative overflow-hidden min-h-full">
                  <img
                    src={ticketEvent.image || "/placeholder.svg"}
                    alt={ticketEvent.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <TicketIcon className="w-8 h-8 text-gray-300" />
                </div>
              )}
            </div>

            {/* Right side - Event details */}
            <div className="flex-1 p-4 pl-6">
              {isFetchingEvent ? (
                <div className="space-y-2">
                  <div className="h-5 bg-gray-200 rounded-md w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded-md w-1/2 animate-pulse" />
                </div>
              ) : (
                <>
                  <h3 className="font-bold text-primary mb-1 line-clamp-1">
                    {ticketEvent?.name}
                  </h3>
                  <div className="flex items-center text-xs text-secondary mb-2">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{formatEventDate()}</span>
                    {formatEventTime() && (
                      <>
                        <span className="mx-1">•</span>
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{formatEventTime()}</span>
                      </>
                    )}
                  </div>
                  {ticketType && (
                    <div className="inline-block px-2 py-0.5 bg-secondary/10 text-secondary text-xs rounded-full">
                      {ticketType.name}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Bottom section with ticket ID */}
          <div className="px-4 py-2 bg-primary-100 text-xs text-primary flex justify-between items-center border-t border-secondary-100">
            <span>#{ticket.id.substring(0, 8)}</span>
            <motion.button
              className="text-secondary flex items-center cursor-pointer"
              onClick={handleViewTicket}
              animate={{ x: isHovered ? 0 : -5, opacity: isHovered ? 1 : 0 }}
            >
              View ticket <ChevronRight className="w-3 h-3 ml-1" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <motion.div
        className="relative max-w-[400px] w-[400px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5 }}
      >
        <div className="relative bg-primary-100 rounded-xl overflow-hidden shadow-lg">
          {/* Top colored accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-100 via-secondary to-primary-100" />

          {/* Ticket stub perforation */}
          <div className="absolute top-0 bottom-0 left-[30%] w-[1px] border-l border-dashed border-secondary" />

          {/* Left circle cutout */}
          <div className="absolute left-[30%] top-1/2 w-5 h-5 rounded-full bg-primary -translate-x-1/2 -translate-y-1/2 border border-dashed border-secondary/30" />

          <div className="flex gap-3">
            {/* Left side - Event image */}
            <div className="w-[30%] min-w-32 relative min-h-full">
              {isFetchingEvent ? (
                <div className="aspect-square bg-gray-200 animate-pulse" />
              ) : ticketEvent?.image ? (
                <div className="aspect-square relative overflow-hidden h-full">
                  <img
                    src={ticketEvent.image || "/placeholder.svg"}
                    alt={ticketEvent.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <TicketIcon className="w-8 h-8 text-gray-300" />
                </div>
              )}
            </div>

            {/* Right side - Event details */}
            <div className="flex-1 relative w-[60%] p-2">
              {/* Options menu */}
              <div
                className="absolute z-50  top-3 right-3 cursor-pointer"
                ref={optionRef}
              >
                <button
                  className="p-1.5 rounded-full hover:bg-secondary-100 hover:text-primary transition-colors cursor-pointer text-secondary"
                  onClick={handleShowOption}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {showOptions && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-1 w-36 bg-primary rounded-lg shadow-lg overflow-hidden z-10 border border-secondary-100"
                    >
                      <button
                        className="w-full px-3 py-2 text-sm text-secondary cursor-pointer hover:bg-secondary-200 transition-colors flex items-center gap-2"
                        onClick={handleViewTicket}
                      >
                        <TicketIcon className="w-3.5 h-3.5" /> View Ticket
                      </button>
                      <button
                        className="w-full px-3 py-2 text-sm text-red-500 hover:bg-red-100 transition-colors flex items-center gap-2 cursor-pointer"
                        onClick={handleOpenDeleteModal}
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {isFetchingEvent ? (
                <div className="space-y-2">
                  <div className="h-5 bg-gray-200 rounded-md w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded-md w-1/2 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded-md w-2/3 animate-pulse" />
                </div>
              ) : (
                <>
                  <h3 className="font-bold text-primary mb-1 pr-6 line-clamp-1">
                    {ticketEvent?.name}
                  </h3>

                  <div className="space-y-1.5 mb-3 text-secondary-100">
                    <div className="flex items-center text-xs">
                      <Calendar className="w-3 h-3 mr-1.5 flex-shrink-0" />
                      <span>{formatEventDate()}</span>
                      {formatEventTime() && (
                        <>
                          <span className="mx-1">•</span>
                          <Clock className="w-3 h-3 mr-1.5 flex-shrink-0" />
                          <span>{formatEventTime()}</span>
                        </>
                      )}
                    </div>

                    {ticketEvent?.location && (
                      <div className="flex items-center text-xs">
                        <MapPin className="w-3 h-3 mr-1.5 flex-shrink-0" />
                        <span className="truncate w-[20ch]">
                          {ticketEvent.location}
                        </span>
                      </div>
                    )}

                    {ticketUser && (
                      <div className="flex items-center text-xs">
                        <UserIcon className="w-3 h-3 mr-1.5 flex-shrink-0" />
                        <span className="truncate">
                          {ticketUser.firstname || ticketUser.email}
                        </span>
                      </div>
                    )}
                  </div>

                  {ticketType && (
                    <div className="inline-block px-2 py-0.5 bg-secondary/10 text-secondary text-xs rounded-full">
                      {ticketType.name}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Bottom section with ticket ID */}
          <div className="px-4 py-2 bg-secondary-300 text-xs text-secondary flex justify-between items-center border-t border-secondary-100">
            <span>#{ticket.ticketCode}</span>
            {/* <span>{new Date(ticket.createdAt).toLocaleDateString()}</span> */}
          </div>
        </div>
      </motion.div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteModal
          onclick={() => deleteTicket(ticket.id)}
          onclose={() => setShowDeleteModal(false)}
        />
      )}

      {/* Preview Modal */}
      {openModal && (
        <motion.div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {isGettingTicketType ? (
            <motion.div
              className="bg-white rounded-lg p-6 w-96"
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
}
