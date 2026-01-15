import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import eventRoutes from "./event.routes";
import ticketRoutes, { ticketTypesRouter } from "./ticket.routes";
import savedEventRoutes from "./savedEvent.routes";

const router = Router();

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Mount routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/events", eventRoutes);
router.use("/tickets", ticketRoutes);
router.use("/ticket-types", ticketTypesRouter);
router.use("/saved-events", savedEventRoutes);

export default router;
