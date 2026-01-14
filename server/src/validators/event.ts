import { z } from "zod";

// Create event schema
export const createEventSchema = z.object({
  name: z.string().min(1, "Event name is required").max(200),
  description: z.string().min(1, "Description is required").max(5000),
  location: z.string().min(1, "Location is required").max(500),
  image: z.string().url("Invalid image URL"),
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid start date"),
  endDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid end date"),
  category: z.string().min(1, "Category is required"),
  maxTicketsPerUser: z.number().int().min(1).max(100).default(4),
  totalCapacity: z.number().int().min(1, "Total capacity must be at least 1"),
  ticketTypes: z
    .array(
      z.object({
        name: z.string().min(1, "Ticket type name is required"),
        description: z.string().optional(),
        price: z.number().min(0, "Price cannot be negative"),
        type: z.string().min(1, "Ticket type is required"),
        total: z.number().int().min(1, "Total tickets must be at least 1"),
        benefits: z.array(z.string()).optional().default([]),
      })
    )
    .min(1, "At least one ticket type is required"),
});

// Update event schema
export const updateEventSchema = createEventSchema.partial().extend({
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED"]).optional(),
});

// Query params for listing events
export const listEventsQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => parseInt(val || "1", 10)),
  limit: z
    .string()
    .optional()
    .transform((val) => parseInt(val || "10", 10)),
  category: z.string().optional(),
  search: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED"]).optional(),
});

// Types
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type ListEventsQuery = z.infer<typeof listEventsQuerySchema>;
