import { z } from "zod";

// Update user schema
export const updateUserSchema = z.object({
  firstname: z.string().min(1).max(50).optional(),
  lastname: z.string().min(1).max(50).optional(),
  displayName: z.string().max(100).optional(),
  profileImage: z.string().url().optional().nullable(),
});

// Update role schema
export const updateRoleSchema = z.object({
  role: z.enum(["USER", "ORGANIZER", "ADMIN"]),
});

// Types
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
