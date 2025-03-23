import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { Ticket } from "../../../types";
import { useState } from "react";
import { FaPlus, FaWpexplorer } from "react-icons/fa6";
import { TicketCard } from "./TicketCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteTicket, getUserTickets } from "../../../services/ticketServices";
import TicketCardSkeleton from "./TicketCardSkeleton";

const ClientTickets = () => {
  const { user } = useAuth();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const queryClient = useQueryClient();

  const { data: userTickets, isLoading } = useQuery({
    queryFn: () => getUserTickets(user?.id || ""),
    queryKey: ["userTickets", user?.id],
    enabled: !!user,
  });

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setOpenModal(true);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteTicket,
    onError: (error) => console.error(error),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTickets"] });
    },
  });
  const handleDeleteTicket = (ticketId: string) => {
    deleteMutation.mutate(ticketId);
  };

  return (
    <div>
      {/* Tickets List */}
      <div className="mt-10 md:mt-6 p-4">
        <div className="flex items-center mb-8 md:mb-4 justify-between">
          <h2 className="text-lg md:text-xl font-semibold text-secondary mr-auto">
            Booked Tickets
          </h2>
          {user?.role === "organizer" || user?.role === "admin" ? (
            <Link
              to="/create"
              className="flex items-center gap-1 p-2 rounded-sm cursor-pointer hover:bg-secondary/70 transition-colors duration-150 bg-secondary text-white text-xs"
            >
              <FaPlus />
              <span className="hidden md:block">Create Event</span>
            </Link>
          ) : (
            <Link
              to="/#events"
              className="flex items-center gap-1 p-2 rounded-sm cursor-pointer hover:bg-secondary/70 transition-colors duration-150 bg-secondary text-white text-xs"
            >
              <FaWpexplorer />
              <span className="hidden md:block">Explore Events</span>
            </Link>
          )}
        </div>
        {isLoading ? (
          <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid gap-4">
            {[...Array(6)].map((_, index) => (
              <TicketCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid-cols-1 md:grid-cols-2 grid lg:grid-cols-3 gap-4 relative md:p-2 items-start">
            {userTickets && userTickets?.length > 0 ? (
              userTickets.map((ticket) => (
                <TicketCard
                  ticket={ticket}
                  onSelect={handleSelectTicket}
                  deleteTicket={handleDeleteTicket}
                  openModal={openModal}
                  setOpenModal={setOpenModal}
                  key={ticket.ticketCode}
                  selectedTicket={selectedTicket as Ticket}
                />
              ))
            ) : (
              <p className="text-secondary mt-4 text-center">
                No tickets booked yet.
                <br />
                <Link to="/#events" className="underline">
                  Explore
                </Link>{" "}
                events here
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientTickets;
