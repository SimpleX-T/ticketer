import { supabase } from "./supabaseClient";

import { Event } from "../types";

export const createEvent = async (
  event: Omit<Event, "id" | "createdAt" | "ticketsSold" | "soldOut">
) => {
  console.log(event);

  const { ticketTypes, ...eventData } = event;

  const { data, error: eventError } = await supabase
    .from("events")
    .insert({ ...eventData, ticketsSold: 0, soldOut: false })
    .select()
    .single();

  if (eventError) throw eventError;

  const eventId = data.id;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const ticketTypeEntries = ticketTypes.map(({ id, ...ticket }) => ({
    ...ticket,
    eventId: eventId,
  }));

  const { error: ticketTypeError } = await supabase
    .from("ticketTypes")
    .insert(ticketTypeEntries);

  if (ticketTypeError) throw ticketTypeError;

  console.log({
    event: {
      ...eventData,
      id: eventId,
    },
    ticketTypes: ticketTypeEntries,
  });
};

export const getEventDetails = async (EventId: string) => {
  console.log(EventId);
};
