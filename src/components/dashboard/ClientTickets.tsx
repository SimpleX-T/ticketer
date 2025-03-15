import { Link } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { useAuth } from "../../contexts/AuthContext";
import { Ticket } from "../../types";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { TicketCard } from "./TicketCard";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { db } from "../../services/firebase";
import { useQuery } from "@tanstack/react-query";
import { getUserTickets } from "../../hooks/useFirebaseTickets";
import TicketCardSkeleton from "./TicketCardSkeleton";
import { FaSignOutAlt } from "react-icons/fa";

const ClientTickets = () => {
  const { user, handleLogout } = useAuth();
  const { deleteTicket } = useAppContext();
  const [openModal, setOpenModal] = useState<boolean>(false);
  // const [userTickets, setUserTickets] = useState<Ticket[]>([]);
  // const [isLoading, setIsLoading] = useState<boolean>(true);

  const { data: userTickets, isLoading } = useQuery({
    queryFn: () => getUserTickets(user?.id || ""),
    queryKey: ["userTickets", user?.id],
    enabled: !!user,
  });
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    if (userTickets && userTickets.length > 0) {
      setSelectedTicket(userTickets[0] as unknown as Ticket);
    }
  }, [userTickets]);

  // useEffect(() => {
  //   const getUserTickets = async () => {
  //     if (!user) return;
  //     try {
  //       const userTickets: Ticket[] = [];
  //       const fetchQuery = query(
  //         collection(db, "tickets"),
  //         where("userId", "==", user.id)
  //       );
  //       const tickets = await getDocs(fetchQuery);
  //       if (tickets.empty) return;
  //       tickets.forEach((doc) => userTickets.push(doc.data() as Ticket));
  //       setUserTickets(userTickets);
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   getUserTickets();
  // }, [user]);

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setOpenModal(true);
  };

  const handleDeleteTicket = (ticketId: string | number) => {
    if (!ticketId) return;
    deleteTicket(ticketId);
  };

  return (
    <div className="mx-auto p-6 bg-gradient-to-br min-h-screen py-24 from-secondary-300 to-primary-100">
      {/* User Info Section */}
      <div className="bg-primary p-6 rounded-lg shadow-md relative">
        <h2 className="text-2xl font-semibold text-secondary">User Profile</h2>
        <p className="text-secondary">
          <strong>Name:</strong> {user?.firstname} {user?.lastname}
        </p>
        <p className="text-secondary">
          <strong>Email:</strong> {user?.email}
        </p>

        <button
          className="absolute top-12 right-12 text-3xl cursor-pointer hover:text-secondary-100 transition-colors duration-300 text-secondary"
          onClick={() => {
            handleLogout();
          }}
        >
          <FaSignOutAlt />
        </button>
      </div>

      {/* Tickets List */}
      <div className="mt-6">
        <div className="flex items-center mb-4 justify-between">
          <h2 className="text-lg md:text-xl font-semibold text-secondary mr-auto">
            Booked Tickets
          </h2>
          {user?.role === "organizer" || user?.role === "admin" ? (
            <Link
              to="/create-event"
              className="flex items-center gap-1 p-2 rounded-sm cursor-pointer hover:bg-secondary/70 transition-colors duration-150 bg-secondary text-white text-xs"
            >
              <FaPlus />
              <span>Create Event</span>
            </Link>
          ) : (
            <Link
              to="/#events"
              className="flex items-center gap-1 p-2 rounded-sm cursor-pointer hover:bg-secondary/70 transition-colors duration-150 bg-secondary text-white text-xs"
            >
              <span>Explore Events</span>
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
          <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid gap-4 relative md:p-2 items-start">
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
