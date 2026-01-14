import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EventDetails } from "./EventDetails";
import { BookingForm } from "./BookingForm";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { User } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { getEventDetails } from "../../services/eventServices";
import { getUserData } from "../../services/userServices";
import { toast } from "sonner";
import { sonnerStyle } from "@/utils/constants";
import { Loader2 } from "lucide-react";

export default function Booking() {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [organizer, setOrganizer] = useState<User | null>(null);

  const {
    data: event,
    isLoading: isLoadingEvent,
    error: eventError,
  } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getEventDetails(eventId!),
    enabled: !!eventId,
  });

  useEffect(() => {
    const getOrganizerDetails = async () => {
      if (!event?.organizerId) return;
      try {
        const data = await getUserData(event.organizerId);
        setOrganizer(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast(err.message, { style: sonnerStyle });
        }
      }
    };

    getOrganizerDetails();
  }, [event?.organizerId]);

  const handleBookingSubmit = async () => {
    queryClient.invalidateQueries({ queryKey: ["userTickets", user?.id] });
    navigate("/dashboard/tickets");
  };

  // Loading state
  if (isLoadingEvent) {
    return (
      <div className="select-none min-h-screen relative bg-primary overflow-hidden w-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-secondary animate-spin mx-auto mb-4" />
          <p className="text-secondary">Loading event details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (eventError || !event) {
    return (
      <div className="select-none min-h-screen relative bg-primary overflow-hidden w-full flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Event Not Found
          </h2>
          <p className="text-secondary-100 mb-4">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/events")}
            className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-100 transition-colors"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="select-none min-h-screen relative bg-primary overflow-hidden w-full">
      <section className="min-h-screen w-full py-32 relative">
        <main className="max-w-6xl mx-auto p-6 bg-primary-200 border border-primary-100/40 rounded-xl flex flex-wrap items-start gap-4 md:gap-0 mb-6">
          <EventDetails event={event} organizer={organizer} />
          <BookingForm event={event} onSubmit={handleBookingSubmit} />
        </main>
      </section>
    </div>
  );
}
