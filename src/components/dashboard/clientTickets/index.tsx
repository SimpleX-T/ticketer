import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { Ticket } from "../../../types";
import { useState } from "react";
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
    <div className="min-h-screen w-full flex flex-col">
      {/* Tickets List */}
      <div className="flex-1 w-full p-6 pt-20 md:pt-16">
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-secondary">
            Booked Tickets
          </h2>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <TicketCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {userTickets && userTickets.length > 0 ? (
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
              <div className="col-span-full text-center text-secondary py-10">
                <p className="text-lg">
                  No tickets booked yet.
                  <br />
                  <Link
                    to="/events"
                    className="underline hover:text-secondary-200 transition-colors"
                  >
                    Explore
                  </Link>{" "}
                  events here
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientTickets;
