import { Response, NextFunction } from "express";
import * as savedEventService from "../services/savedEvent.service";
import { AuthRequest } from "../middleware/auth";

interface EventIdParams {
  eventId: string;
}

// Save event
export const saveEvent = async (
  req: AuthRequest & { params: EventIdParams },
  res: Response,
  next: NextFunction
) => {
  try {
    const savedEvent = await savedEventService.saveEvent(
      req.user!.userId,
      req.params.eventId
    );
    res.status(201).json(savedEvent);
  } catch (error) {
    next(error);
  }
};

// Unsave event
export const unsaveEvent = async (
  req: AuthRequest & { params: EventIdParams },
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await savedEventService.unsaveEvent(
      req.user!.userId,
      req.params.eventId
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Get saved events
export const getSavedEvents = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const events = await savedEventService.getSavedEvents(req.user!.userId);
    res.json(events);
  } catch (error) {
    next(error);
  }
};

// Check if event is saved
export const isEventSaved = async (
  req: AuthRequest & { params: EventIdParams },
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await savedEventService.isEventSaved(
      req.user!.userId,
      req.params.eventId
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};
