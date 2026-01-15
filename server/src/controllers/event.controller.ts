import { Request, Response, NextFunction } from "express";
import * as eventService from "../services/event.service";
import { AuthRequest } from "../middleware/auth";

interface IdParams {
  id: string;
}

// Create event
export const createEvent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const event = await eventService.createEvent(req.user!.userId, req.body);
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

// Get event by ID
export const getEventById = async (
  req: Request<IdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    res.json(event);
  } catch (error) {
    next(error);
  }
};

// List events
export const listEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Use validated query from middleware or raw query
    const query = res.locals.validatedQuery || req.query;
    const result = await eventService.listEvents(query as any);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Get upcoming events
export const getUpcomingEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const events = await eventService.getUpcomingEvents(limit);
    res.json(events);
  } catch (error) {
    next(error);
  }
};

// Get recent events
export const getRecentEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = parseInt(req.query.limit as string) || 6;
    const events = await eventService.getRecentEvents(limit);
    res.json(events);
  } catch (error) {
    next(error);
  }
};

// Update event
export const updateEvent = async (
  req: AuthRequest & { params: IdParams },
  res: Response,
  next: NextFunction
) => {
  try {
    const event = await eventService.updateEvent(
      req.params.id,
      req.user!.userId,
      req.user!.role,
      req.body
    );
    res.json(event);
  } catch (error) {
    next(error);
  }
};

// Delete event
export const deleteEvent = async (
  req: AuthRequest & { params: IdParams },
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await eventService.deleteEvent(
      req.params.id,
      req.user!.userId,
      req.user!.role
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Get ticket type by ID
export const getTicketTypeById = async (
  req: Request<IdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const ticketType = await eventService.getTicketTypeById(req.params.id);
    res.json(ticketType);
  } catch (error) {
    next(error);
  }
};
