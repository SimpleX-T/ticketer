import { useEffect, useRef, useState } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";
import { Ticket, User } from "../../types";
import { DeleteModal } from "./DeleteModal";
import TicketPreviewModal from "./TicketPreviewModal";
import { useQuery } from "@tanstack/react-query";
import { getEventDetails } from "../../services/eventServices";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../services/supabaseClient";
import { getTicketTypeById } from "../../services/ticketServices";

export const TicketCard = ({
  ticket,
  onSelect,
  deleteTicket,
  openModal,
  setOpenModal,
}: {
  ticket: Ticket;
  onSelect: (ticket: Ticket) => void;
  deleteTicket: (id: string | number) => void;
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
      <div
        key={ticket.id}
        className="bg-primary relative flex rounded-lg -hidden h-36 shadow-md mt-4"
      >
        <div className="aspect-square min-h-full overflow-hidden rounded-lg">
          {isFetchingEvent ? (
            <div className="w-full h-full bg-secondary/60 animate-pulse" />
          ) : ticketEvent?.image ? (
            <img
              src={ticketEvent.image}
              alt={ticketEvent.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>No image</span>
          )}
        </div>

        <div className="p-4 pr-8">
          {isFetchingEvent ? (
            <div className="w-36 rounded-sm h-4 bg-secondary/60 animate-pulse" />
          ) : (
            <h3 className="text-sm md:text-lg mb-2 font-semibold text-secondary">
              {ticketEvent?.name}
            </h3>
          )}
        </div>

        {/* Option button */}
        <div
          className="absolute top-4 right-4 flex items-center border border-secondary-100 rounded-sm"
          ref={optionRef}
        >
          <button
            className="flex items-center justify-center rounded-sm cursor-pointer p-1"
            onClick={handleShowOption}
          >
            <FaEllipsisVertical className="text-secondary text-sm" />
          </button>

          <ul
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
          </ul>
        </div>

        {showDeleteModal && (
          <DeleteModal
            onclick={() => deleteTicket(ticket.id)}
            onclose={() => setShowDeleteModal(false)}
          />
        )}
      </div>

      {openModal && (
        <div className="fixed w-full min-h-screen inset-0 bg-primary/20 backdrop-blur-md flex items-center justify-center">
          {isGettingTicketType ? (
            <div className="w-full h-full bg-secondary/60 animate-pulse" />
          ) : (
            <TicketPreviewModal
              ticketEvent={ticketEvent}
              ticketUser={ticketUser}
              ticketType={ticketType}
              ticket={ticket}
              onclose={setOpenModal}
            />
          )}
        </div>
      )}
    </div>
  );
};
