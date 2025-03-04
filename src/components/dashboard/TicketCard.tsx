/*
  When the organizer creates an event, they create a document that contains other event data plus a subcollection of ticketTypes.
  When a user books a ticket for an event, they create a ticket document with references to the event, the ticket type, and user that booked the ticket
 */

import { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { BiCalendar } from "react-icons/bi";
import Barcode from "react-barcode";
import { FaEllipsisVertical } from "react-icons/fa6";
import { Event, Ticket, TicketType, User } from "../../types";
import { DeleteModal } from "./DeleteModal";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

export const TicketCard = ({
  ticket,
  onSelect,
  deleteTicket,
  openModal,
  setOpenModal,
  selectedTicket,
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
  const [ticketEvent, setTicketEvent] = useState<Event | null>(null);
  const [ticketUser, setTicketUser] = useState<User | null>(null);
  const [ticketType, setTicketType] = useState<TicketType | null>(null);



  useEffect(() => {
    const getTicketEvent = async () => {
      try {
        const event = await getDoc(doc(db, "events", ticket.eventId));
        if (!event.exists()) return;
        console.log(event.data());
        setTicketEvent(event.data() as Event);
      } catch (error) {
        console.log(error);
      }
    };

    const getTicketeUser = async () => {
      try {
        const user = await getDoc(doc(db, "users", ticket.userId));
        if (!user.exists()) return;
        console.log(user.data());
        setTicketUser(user.data() as User);
      } catch (error) {
        console.log(error);
      }
    };

    const

    getTicketeUser();
    getTicketEvent();
  }, [ticket.eventId, ticket.userId]);

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
    <div>
      <div
        key={ticket.id}
        className="bg-primary relative flex rounded-lg -hidden h-36 shadow-md mt-4"
      >
        <div className="aspect-square min-h-full overflow-hidden rounded-lg">
          {ticketEvent ? (
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
          <h3 className="text-sm md:text-lg mb-2 font-semibold text-secondary">
            {ticketEvent?.name || "Event Name"}
          </h3>
          {/* <p className="text-secondary text-xs md:text-sm mb-1">
          <strong>Tickets for:</strong> {ticket.}
        </p> */}
          {/* <p className="text-secondary text-xs md:text-sm mb-1">
          <strong>Type:</strong> {ticket.typ?.name}
        </p> */}
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
                    {ticketEvent?.date}
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
                      <span className="text-xs py-2 text-gray-500 mb-1">
                        Name
                      </span>
                      <p className="text-xs">{`${ticketUser?.firstname} ${ticketUser?.lastname}`}</p>
                    </div>

                    <div className="border-b border-gray-500 py-1 pl-2">
                      <span className="text-xs py-2 text-gray-500 mb-1">
                        Email
                      </span>
                      <p className="text-xs truncate">
                        {ticketUser?.email}
                      </p>
                    </div>

                    <div className="border-r border-b border-gray-500 py-1 pr-2">
                      <span className="text-xs py-2 text-gray-500">
                        Ticket Type
                      </span>
                      <p className="text-xs truncate">
                        {ticket..ticketType?.type}
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
