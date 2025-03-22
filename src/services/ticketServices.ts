import { Ticket } from "../types";
import { supabase } from "./supabaseClient";

export const bookTicket = async (
  ticketData: Omit<Ticket, "id" | "createdAt">,
  userId: string
) => {
  console.log(ticketData, userId);
  try {
    const { data, error } = await supabase
      .from("tickets")
      .insert([ticketData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error };
  }
};

export const getUserTickets = async (userId: string): Promise<Ticket[]> => {
  if (!userId) throw new Error("User ID is required");
  try {
    const { data: userTickets, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("userId", userId);

    if (error) throw error;

    console.log(userTickets);
    return userTickets;
  } catch (error) {
    console.error("Error getting user tickets:", error);
    return [];
  }
};

export const getTicketTypeById = async (ticketTypeId: string) => {
  try {
    const { data, error } = await supabase
      .from("ticketTypes")
      .select("*")
      .eq("id", ticketTypeId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error getting ticket type:", error);
  }
};

export const deleteTicket = async (ticketId: string) => {
  if (!ticketId) throw new Error("Ticket ID is required");
  try {
    const { error } = await supabase
      .from("tickets")
      .delete()
      .eq("id", ticketId);
    if (error) throw error;
  } catch (error) {
    console.error(error);
  }
};
