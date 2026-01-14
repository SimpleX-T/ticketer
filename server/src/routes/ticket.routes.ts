import { Router } from "express";
import * as ticketController from "../controllers/ticket.controller";
import * as eventController from "../controllers/event.controller";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { bookTicketSchema } from "../validators/ticket";

const router = Router();

// All routes require authentication except verify
router.get("/verify/:code", ticketController.verifyTicketByCode);

// Protected routes
router.post(
  "/",
  authMiddleware,
  validate(bookTicketSchema),
  ticketController.bookTicket
);

router.get("/:id", authMiddleware, ticketController.getTicketById);

router.delete("/:id", authMiddleware, ticketController.cancelTicket);

router.post("/:id/check-in", authMiddleware, ticketController.checkInTicket);

export default router;

// Ticket types route (separate)
export const ticketTypesRouter = Router();
ticketTypesRouter.get("/:id", eventController.getTicketTypeById);
