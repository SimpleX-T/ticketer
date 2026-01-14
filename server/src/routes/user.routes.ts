import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { updateUserSchema, updateRoleSchema } from "../validators/user";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get user by ID
router.get("/:id", userController.getUserById);

// Update user
router.patch("/:id", validate(updateUserSchema), userController.updateUser);

// Update user role
router.patch(
  "/:id/role",
  validate(updateRoleSchema),
  userController.updateUserRole
);

// Get user's events
router.get("/:id/events", userController.getUserEvents);

// Get user's tickets
router.get("/:id/tickets", userController.getUserTickets);

export default router;
