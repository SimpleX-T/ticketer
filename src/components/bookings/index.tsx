import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EventDetails } from "./EventDetails";
import { BookingForm } from "./BookingForm";
// import { TicketAvailability } from "./TicketAvailability";
import { useQueryClient } from "@tanstack/react-query";
import { Event, User } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../services/supabaseClient";

export default function Booking() {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [event, setEvent] = useState<Event | null>(null);
  const [organizer, setOrganizer] = useState<User | null>(null);

  useEffect(() => {
    const getEventDetails = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*,ticketTypes(*)")
        .eq("id", eventId)
        .single();
      if (error) throw error;
      setEvent(data);
    };

    const getOrganizerDetails = async () => {
      if (!event?.organizerId) return;
      const { data, error } = await supabase
        .from("users")
        .select("*, events(*)")
        .eq("id", event.organizerId)
        .single();
      if (error) throw error;
      setOrganizer(data);
    };

    getEventDetails().catch(console.error);
    getOrganizerDetails().catch(console.error);
  }, [eventId, event?.organizerId]);

  const handleBookingSubmit = async () => {
    queryClient.invalidateQueries({ queryKey: ["userTickets", user?.id] });
    navigate("/dashboard/tickets");
  };

  return (
    <div className="select-none min-h-screen relative bg-primary overflow-hidden w-full">
      <section className="min-h-screen w-full py-32 relative">
        <main className="max-w-6xl mx-auto p-6 bg-primary-200 border border-primary-100/40 rounded-xl flex flex-wrap items-start gap-4 md:gap-0 mb-6">
          <EventDetails event={event} organizer={organizer} />
          <BookingForm
            event={event}
            userId={user?.id || ""}
            onSubmit={handleBookingSubmit}
          />
        </main>
        {/* <TicketAvailability event={event} /> */}
      </section>
    </div>
  );
}
