import { FormEvent, useState } from "react";
import { Ticket, Event, TicketType } from "../../types";
import { generateTicketCode } from "../../utils/constants";
import { bookTicket } from "../../services/ticketServices";
import { supabase } from "../../services/supabaseClient";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { TicketDetails } from "./TicketDetails";

interface BookingFormProps {
  event: Event | null;
  userId: string;
  onSubmit: (ticket: Ticket) => Promise<void>;
}

export function BookingForm({ event, userId, onSubmit }: BookingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [ticketData, setTicketData] = useState<Omit<Ticket, "id">>({
    ticketTypeId: "",
    eventId: event?.id || "",
    userId,
    purchaseDate: new Date().toISOString(),
    ticketCode: generateTicketCode(),
    isTransferred: false,
    transferredTo: "",
    specialRequests: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!event?.id || !userId) return;
    setIsLoading(true);
    try {
      const ticket = await bookTicket(
        { ...ticketData, eventId: event.id },
        userId
      );
      await onSubmit(ticket);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTicketTypeChange = async (value: string) => {
    const ticketType = event?.ticketTypes.find((t) => t.type === value);
    if (!ticketType) return;

    setTicketData((prev) => ({ ...prev, ticketTypeId: ticketType.id }));
    const { data, error } = await supabase
      .from("ticketTypes")
      .select("*")
      .eq("id", ticketType.id)
      .single();
    if (!error) setSelectedTicket(data);
  };

  return (
    <div className="w-full md:w-1/2 pt-4 md:pt-0 md:pl-6 border-t md:border-t-0 md:border-l border-primary-100/40">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Enter your name"
          label="Name"
          required
          hasLabel
        />
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          label="Email"
          required
          hasLabel
        />
        <Select
          hasLabel
          label="What type of ticket?"
          value={
            event?.ticketTypes.find((ev) => ev.id === ticketData.ticketTypeId)
              ?.type || ""
          }
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            handleTicketTypeChange(e.target.value)
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
        />
        {selectedTicket && <TicketDetails ticket={selectedTicket} />}
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 cursor-pointer hover:bg-secondary-100 transition-colors duration-200"
          disabled={isLoading}
        >
          {isLoading ? "Booking..." : "Register"}
        </button>
      </form>
    </div>
  );
}
