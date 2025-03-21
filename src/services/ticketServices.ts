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
