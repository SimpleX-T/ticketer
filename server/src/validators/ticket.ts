import { z } from "zod";

// Book ticket schema
export const bookTicketSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  ticketTypeId: z.string().min(1, "Ticket type ID is required"),
  specialRequests: z.string().max(1000).optional(),
});

// Transfer ticket schema
export const transferTicketSchema = z.object({
  toEmail: z.string().email("Invalid email address"),
});

// Types
export type BookTicketInput = z.infer<typeof bookTicketSchema>;
export type TransferTicketInput = z.infer<typeof transferTicketSchema>;
