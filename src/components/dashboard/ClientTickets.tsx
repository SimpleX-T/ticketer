import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Ticket } from '../../types';
import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { TicketCard } from './TicketCard';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';

const ClientTickets = () => {
  const { user } = useAuth();
  const { deleteTicket } = useAppContext();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket>(userTickets[0]);

  useEffect(() => {
    const getUserTickets = async () => {
      if (!user) return;
      try {
        const userTickets: Ticket[] = [];
        const fetchQuery = query(collection(db, 'tickets'), where('userId', '==', user.id));
        const tickets = await getDocs(fetchQuery);
        if (tickets.empty) return;
        tickets.forEach((doc) => userTickets.push(doc.data() as Ticket));
        setUserTickets(userTickets);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getUserTickets();
  }, [user]);

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
      <div className="bg-primary p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-secondary">User Profile</h2>
        <p className="text-secondary">
          <strong>Name:</strong> {user?.firstname} {user?.lastname}
        </p>
        <p className="text-secondary">
          <strong>Email:</strong> {user?.email}
        </p>
      </div>

      {/* Tickets List */}
      <div className="mt-6">
        <div className="flex items-center mb-4 justify-between">
          <h2 className="text-lg md:text-xl font-semibold text-secondary mr-auto">
            Booked Tickets
          </h2>
          {user?.role === 'organizer' && (
            <Link
              to="/create-event"
              className="flex items-center gap-1 p-2 rounded-sm cursor-pointer hover:bg-secondary/70 transition-colors duration-150 bg-secondary text-white text-xs"
            >
              <FaPlus />
              <span>Create Event</span>
            </Link>
          )}
          <Link
            to="/create-event"
            className="flex items-center gap-1 p-2 rounded-sm cursor-pointer hover:bg-secondary/70 transition-colors duration-150 bg-secondary text-white text-xs"
          >
            <FaPlus />
            <span>Create Event</span>
          </Link>
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid gap-4 relative md:p-2 items-start">
            {userTickets.length > 0 ? (
              userTickets.map((ticket) => (
                <TicketCard
                  ticket={ticket}
                  onSelect={handleSelectTicket}
                  deleteTicket={handleDeleteTicket}
                  openModal={openModal}
                  setOpenModal={setOpenModal}
                  key={ticket.eventId}
                  selectedTicket={selectedTicket}
                />
              ))
            ) : (
              <p className="text-secondary mt-4 text-center">
                No tickets booked yet.
                <br />
                <Link to="/#events" className="underline">
                  Explore
                </Link>{' '}
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
