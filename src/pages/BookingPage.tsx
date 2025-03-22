import { FormEvent, useEffect, useState } from "react";
import { Event, Ticket, TicketType, User } from "../types";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../services/supabaseClient";
import { formatFullDate, formatTimeFromDateString } from "../utils/helpers";
import { FaMap, FaTag } from "react-icons/fa6";
import { categoryTags, generateTicketCode } from "../utils/constants";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { CalendarDate } from "../components/ui/CalendarDate";
import { TicketDetails } from "../components/bookings/TicketDetails";
import Skeleton from "../components/bookings/Skeleton";
import { bookTicket } from "../services/ticketServices";
import { useQueryClient } from "@tanstack/react-query";

export default function BookingPage() {
  const params = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [organizer, setOrganizer] = useState<User | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [ticketData, setTicketData] = useState<Omit<Ticket, "id">>({
    ticketTypeId: "",
    eventId: event?.id || "",
    userId: user?.id || "",
    purchaseDate: new Date().toISOString(),
    ticketCode: generateTicketCode(),
    isTransferred: false,
    transferredTo: "",
    specialRequests: "",
  });

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

  const handleBookTicket = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!event?.id || !user?.id) return console.log("no ids");
    try {
      setIsLoading(true);

      const { data, error } = await bookTicket(
        { ...ticketData, eventId: event.id },
        user?.id || ""
      );

      if (error) throw error;

      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["userTickets", user?.id] });
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

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
                  <h2 className="text-2xl font-bold text-secondary">
                    {event.name}
                  </h2>
                  <EventDescription event={event} withTitle={false} />
                </div>

                <hr className="border-[0.5px] border-secondary-200" />

                <div className="flex items-end md:items-start md:flex-col mt-4 gap-2">
                  <div className="flex items-center gap-3 bg-secondary-100 md:p-1 rounded-lg text-white md:pr-2">
                    <CalendarDate date={event.startDate} />
                    <div className="hidden md:block">
                      <h3 className="text-sm font-semibold">
                        {formatFullDate(event.startDate)}
                      </h3>
                      <p className="text-xs">
                        {formatTimeFromDateString(event.startDate)}
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

                    {/* {event.totalCapacity && (
                      <div className="md:flex items-center gap-1 p-1 bg-secondary-200 rounded-md hidden">
                        <span className="text-secondary text-sm">
                          {event.totalCapacity - event.ticketsSold}
                        </span>
                        <span className="text-sm text-secondary">
                          slots remaining
                        </span>
                      </div>
                    )} */}
                  </div>
                </div>

                {organizer && (
                  <div className="flex items-center mt-2">
                    <div className="flex items-center gap-1 p-1 bg-secondary-200 rounded-md">
                      <span className="text-sm text-secondary">Hosted by</span>
                      <span className="text-secondary text-sm">
                        {organizer.displayName || organizer.firstname}
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
            <form className="space-y-4" onSubmit={handleBookTicket}>
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

              <textarea
                name="special-request"
                id="special-request"
                value={ticketData.specialRequests}
                onChange={(e) =>
                  setTicketData((prev) => ({
                    ...prev,
                    specialRequests: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-md bg-primary-300 border outline-none p-2 text-white border-secondary-200 text-sm"
              ></textarea>

              {selectedTicket && <TicketDetails ticket={selectedTicket} />}

              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 cursor-pointer hover:bg-secondary-100 transition-colors duration-200"
                disabled={isLoading}
              >
                {isLoading ? "booking ticket" : "Register"}
              </button>
            </form>
          </div>
        </main>
      </section>
    </div>
  );
}

const EventDescription = ({
  event,
  withTitle,
}: {
  event: Event;
  withTitle?: boolean;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  return (
    <div>
      {withTitle && (
        <h2 className="text-lg font-bold mb-2 text-secondary">Description</h2>
      )}

      <p
        className={`text-secondary-100 text-sm ${
          isCollapsed ? "line-clamp-1" : ""
        }`}
      >
        {event.description}
      </p>
      <button
        onClick={toggleCollapse}
        className="text-secondary text-xs flex items-center gap-1"
      >
        {isCollapsed ? (
          <>
            <span>Read more</span>
          </>
        ) : (
          <>
            <span>Read less</span>
          </>
        )}
      </button>
    </div>
  );
};
