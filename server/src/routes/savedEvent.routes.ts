import { Router } from "express";
import * as savedEventController from "../controllers/savedEvent.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get all saved events for current user
router.get("/", savedEventController.getSavedEvents);

// Save an event
router.post("/:eventId", savedEventController.saveEvent);

// Unsave an event
router.delete("/:eventId", savedEventController.unsaveEvent);

// Check if event is saved
router.get("/:eventId/status", savedEventController.isEventSaved);

export default router;
