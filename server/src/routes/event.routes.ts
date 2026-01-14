import { Router } from "express";
import * as eventController from "../controllers/event.controller";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  createEventSchema,
  updateEventSchema,
  listEventsQuerySchema,
} from "../validators/event";

const router = Router();

// Public routes
router.get(
  "/",
  validate(listEventsQuerySchema, "query"),
  eventController.listEvents
);
router.get("/upcoming", eventController.getUpcomingEvents);
router.get("/recent", eventController.getRecentEvents);
router.get("/:id", eventController.getEventById);

// Protected routes - any authenticated user can create events (auto-upgraded to organizer)
router.post(
  "/",
  authMiddleware,
  validate(createEventSchema),
  eventController.createEvent
);

router.patch(
  "/:id",
  authMiddleware,
  validate(updateEventSchema),
  eventController.updateEvent
);

router.delete("/:id", authMiddleware, eventController.deleteEvent);

export default router;
