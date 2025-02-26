import { Link } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { useAuthContext } from "../../contexts/AuthContext";
import { UserTicketData } from "../../types";
import { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { BiCalendar } from "react-icons/bi";
import Barcode from "react-barcode";
import { FaEllipsisVertical, FaPlus } from "react-icons/fa6";

const ClientTickets = () => {
  const { user } = useAuthContext();
  const { userTickets, deleteTicket } = useAppContext();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<UserTicketData>(
    userTickets[0]
  );

  const handleSelectTicket = (ticket: UserTicketData) => {
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
          <strong>Name:</strong> {user.firstname} {user.lastname}
        </p>
        <p className="text-secondary">
          <strong>Email:</strong> {user.email}
        </p>
      </div>

      {/* Tickets List */}
      <div className="mt-6">
        <div className="flex items-center mb-4 justify-between">
          <h2 className="text-lg md:text-xl font-semibold text-secondary mr-auto">
            Booked Tickets
          </h2>
          <Link
            to="/create-event"
            className="flex items-center gap-1 p-2 rounded-sm cursor-pointer hover:bg-secondary/70 transition-colors duration-150 bg-secondary text-white text-xs"
          >
            <FaPlus />
            <span>Create Event</span>
          </Link>
        </div>
        <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid gap-4 relative md:p-2 items-start">
          {userTickets.length > 0 ? (
            userTickets.map((ticket) => (
              <TicketCard
                ticket={ticket}
                onSelect={handleSelectTicket}
                deleteTicket={handleDeleteTicket}
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
      </div>

      {openModal && (
        <div className="fixed w-full min-h-screen inset-0 bg-primary/20 backdrop-blur-md flex items-center justify-center">
          <div className="w-full flex items-center justify-center h-full relative">
            <div className="p-6 mb-8 w-full ticket max-w-[400px] mx-auto mt-20">
              <div className="border border-secondary w-full rounded-xl p-4">
                <div className="mb-6 text-center">
                  <h2 className="text-5xl font-semibold font-[Road_Rage] text-white mb-2">
                    {selectedTicket.event.name}
                  </h2>
                  <address className="text-white text-xs not-italic">
                    📍 {selectedTicket.event.location}
                  </address>
                  <p className="text-white text-xs">
                    <BiCalendar className="inline-block mr-2" />{" "}
                    {selectedTicket.event.date}
                  </p>
                </div>

                <div className="gap-6 mb-6 flex items-center justify-center w-48 h-48 rounded-xl overflow-hidden border-[4px] mx-auto border-secondary">
                  {selectedTicket.profileImage && (
                    <img
                      src={selectedTicket.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="bg-secondary-300 rounded-lg p-2 mb-2">
                  <div className="grid grid-cols-2 text-white mb-4">
                    <div className="border border-t-transparent border-l-transparent border-gray-500 py-1 pr-2">
                      <span className="text-xs py-2 text-gray-500 mb-1">
                        Name
                      </span>
                      <p className="text-xs">{selectedTicket.userName}</p>
                    </div>

                    <div className="border-b border-gray-500 py-1 pl-2">
                      <span className="text-xs py-2 text-gray-500 mb-1">
                        Email
                      </span>
                      <p className="text-xs truncate">
                        {selectedTicket.userEmail}
                      </p>
                    </div>

                    <div className="border-r border-b border-gray-500 py-1 pr-2">
                      <span className="text-xs py-2 text-gray-500">
                        Ticket Type
                      </span>
                      <p className="text-xs truncate">
                        {selectedTicket.ticketType?.type}
                      </p>
                    </div>

                    <div className="border-b border-gray-500 py-1 pl-2">
                      <span className="text-xs text-gray-500 py-2">
                        Ticket for
                      </span>
                      <p className="text-xs truncate">
                        {selectedTicket.ticketCount}
                      </p>
                    </div>
                  </div>

                  {selectedTicket.specialRequest && (
                    <div>
                      <span className="text-xs text-gray-500 py-2">
                        Special Request
                      </span>
                      <p className="text-xs text-white">
                        {selectedTicket.specialRequest}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center">
                <Barcode
                  value={selectedTicket.ticketId as string}
                  height={50}
                  width={1}
                  displayValue={true}
                  background=""
                  lineColor="#ffffff"
                  fontSize={14}
                />
              </div>

              <button
                onClick={() => setOpenModal(false)}
                className="flex items-center justify-center absolute top-20 text-white bg-primary right-1/5 p-2 rounded-full cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientTickets;

const TicketCard = ({
  ticket,
  onSelect,
  deleteTicket,
}: {
  ticket: UserTicketData;
  onSelect: (ticket: UserTicketData) => void;
  deleteTicket: (id: string | number) => void;
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const optionRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <div
      key={ticket.ticketId}
      className="bg-primary relative flex rounded-lg -hidden h-36 shadow-md mt-4"
    >
      <div className="aspect-square min-h-full overflow-hidden rounded-lg">
        <img
          src={ticket.event.image}
          alt={ticket.event.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 pr-8">
        <h3 className="text-sm md:text-lg mb-2 font-semibold text-secondary">
          {ticket.event.name}
        </h3>
        <p className="text-secondary text-xs md:text-sm mb-1">
          <strong>Tickets for:</strong> {ticket.ticketCount}
        </p>
        <p className="text-secondary text-xs md:text-sm mb-1">
          <strong>Type:</strong> {ticket.ticketType?.name}
        </p>
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
          onclick={() => deleteTicket(ticket.ticketId)}
          onclose={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

const DeleteModal = ({
  onclick,
  onclose,
}: {
  onclick: () => void;
  onclose: () => void;
}) => {
  return (
    <div>
      <div className="fixed inset-0 z-50 w-full h-full bg-primary/20 backdrop-blur-md flex items-center justify-center">
        <div className="w-full flex items-center justify-center h-full relative">
          <div className="py-3 mb-8 w-full max-w-[400px] mx-auto mt-20 border border-secondary bg-secondary-300 rounded-md">
            <div className="w-full">
              <div className="mb-6 text-center">
                <h2 className="text-5xl font-semibold font-[Road_Rage] text-white mb-2">
                  Delete Ticket
                </h2>
              </div>

              <div className="text-center px-6 mb-2">
                <p className="text-white text-md">
                  Are you sure you want to delete this ticket?
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end pr-6 gap-4">
              <button
                onClick={onclose}
                className="flex items-center justify-center border text-secondary rounded-sm border-secondary p-2 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onclick();
                  onclose();
                }}
                className="flex items-center justify-center border border-secondary rounded-sm bg-red-200 text-primary-200 p-2 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
