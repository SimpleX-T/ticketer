import { useEffect, useState } from "react";
// import { TicketSelection } from "../components/bookings/TicketSelection";
import { Event, Ticket, TicketType, User } from "../types";
// import { GeneratedTicket } from "../components/bookings/GeneratedTicket";
// import { AttendeeForm } from "../components/bookings/AttendeeForm";
import { useParams } from "react-router-dom";
// import { mockEvents } from "../utils/constants";
import { useAuth } from "../contexts/AuthContext";
// import { useQuery } from "@tanstack/react-query";
import { supabase } from "../services/supabaseClient";
import { formatFullDate, formatTimeFromDateString } from "../utils/helpers";
import { FaMap, FaTag } from "react-icons/fa6";
import { categoryTags } from "../utils/constants";
// import { EventCard } from "../components/ui/EventCard";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { CalendarDate } from "../components/ui/CalendarDate";
import { TicketDetails } from "../components/bookings/TicketDetails";
import Skeleton from "../components/bookings/Skeleton";

export default function BookingPage() {
  const params = useParams<{ eventId: string }>();
  // const event = mockEvents.find((event: Event) => event.id === params.eventId);
  const { user } = useAuth();

  // const [step, setStep] = useState<number>(1);
  const [ticketData, setTicketData] = useState<Omit<Ticket, "id">>({
    ticketTypeId: "",
    eventId: "",
    userId: user?.id || "",
    purchaseDate: "",
    price: 0,
    ticketCode: "",
    isTransferred: false,
    transferredTo: "",
    specialRequests: "",
  });
  const [event, setEvent] = useState<Event | null>(null);
  const [organizer, setOrganizer] = useState<User | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);

  useEffect(() => {
    const getEventDetails = async () => {
      const { data: eventDetails, error } = await supabase
        .from("events")
        .select(`*,ticketTypes(*)`)
        .eq("id", params.eventId)
        .single();

      if (error) {
        throw error;
      }

      setEvent(eventDetails);
    };

    const getOrganizerDetails = async () => {
      const { data: organizer, error } = await supabase
        .from("users")
        .select(`*, events(*)`)
        .eq("id", event?.organizerId)
        .single();

      if (error) {
        throw error;
      }

      setOrganizer(organizer);
    };

    getEventDetails();
    getOrganizerDetails();
  }, [params.eventId, event?.organizerId]);

  useEffect(() => {
    const handleGetTicketTypeDetails = async () => {
      if (!ticketData.ticketTypeId) return;

      const { data, error } = await supabase
        .from("ticketTypes")
        .select("*")
        .eq("id", ticketData.ticketTypeId)
        .single();

      if (error) {
        console.error("Error fetching ticket type details:", error);
        return;
      }

      setSelectedTicket(data);
    };

    handleGetTicketTypeDetails();
  }, [ticketData.ticketTypeId]);

  return (
    <div className="select-none min-h-screen relative bg-primary overflow-hidden w-full">
      <section className="min-h-screen w-full py-32 relative">
        <main className="max-w-6xl mx-auto p-6 bg-primary-200 border border-primary-100/40 rounded-xl flex flex-wrap items-start gap-4 md:gap-0 mb-6">
          <div className="w-full md:w-1/2 md:pr-6">
            {event ? (
              <>
                <div className="mb-3">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {event.name}
                  </h2>
                  <p className="text-gray-300">{event.description}</p>
                </div>

                <hr className="border-[0.5px] border-secondary-200" />

                <div className="flex items-end md:items-start md:flex-col mt-4 gap-2">
                  <div className="flex items-center gap-3 bg-secondary-100 md:p-1 rounded-lg text-white md:pr-2">
                    <CalendarDate date={event.date} />
                    <div className="hidden md:block">
                      <h3 className="text-sm font-semibold">
                        {formatFullDate(event.date)}
                      </h3>
                      <p className="text-xs">
                        {formatTimeFromDateString(event.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center md:items-end gap-3 my-0 flex-col md:flex-row">
                    <div className="flex items-center text-secondary bg-secondary-200 p-1 rounded-md">
                      <FaMap
                        className="inline-block mr-2 text-secondary"
                        size={12}
                      />
                      <span className="text-xs">{event.location}</span>
                    </div>

                    <div
                      className="flex items-center text-secondary p-1 rounded-md"
                      style={{
                        background: categoryTags.find(
                          (el) => el.value === event.category.toLowerCase()
                        )?.backgroundColor,
                        color: categoryTags.find(
                          (el) => el.value === event.category.toLowerCase()
                        )?.textColor,
                      }}
                    >
                      <FaTag className="inline-block mr-2" size={12} />
                      <span className="text-xs">{event.category}</span>
                    </div>

                    {event.totalCapacity && (
                      <div className="md:flex items-center gap-1 p-1 bg-secondary-200 rounded-md hidden">
                        <span className="text-secondary text-sm">
                          {event.totalCapacity - event.ticketsSold}
                        </span>
                        <span className="text-sm text-secondary">
                          slots remaining
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {organizer && (
                  <div className="flex items-center mt-2">
                    <div className="flex items-center gap-1 p-1 bg-secondary-200 rounded-md">
                      <span className="text-sm text-secondary">Hosted by</span>
                      <span className="text-secondary text-sm">
                        {organizer.displayName || ""}
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Skeleton />
            )}
          </div>

          <div className="w-full md:w-1/2 pt-4 md:pt-0 md:pl-6 border-t md:border-t-0 md:border-l border-primary-100/40">
            <form className="space-y-4">
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                label="Name"
                required={true}
                hasLabel={true}
              />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                label="Email"
                required={true}
                hasLabel={true}
              />

              <Select
                hasLabel={true}
                label="What type of ticket?"
                value={
                  event?.ticketTypes.find(
                    (ev) => ev.id === ticketData.ticketTypeId
                  )?.type || ""
                }
                onChange={(e) =>
                  setTicketData({
                    ...ticketData,
                    ticketTypeId:
                      event?.ticketTypes.find(
                        (ticketType) => ticketType.type === e.target.value
                      )?.id || "",
                  })
                }
                required={false}
                options={
                  event?.ticketTypes.map((ticketType) => ticketType.type) || []
                }
                id="ticketType"
                name="ticketType"
              />

              {selectedTicket && <TicketDetails ticket={selectedTicket} />}

              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 cursor-pointer hover:bg-secondary-100 transition-colors duration-200"
              >
                Register
              </button>
            </form>
          </div>
        </main>
      </section>
    </div>
  );
}
