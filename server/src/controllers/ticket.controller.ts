import { Request, Response, NextFunction } from "express";
import * as ticketService from "../services/ticket.service";
import { AuthRequest } from "../middleware/auth";

interface IdParams {
  id: string;
}

interface CodeParams {
  code: string;
}

// Book ticket
export const bookTicket = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const ticket = await ticketService.bookTicket(req.user!.userId, req.body);
    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
};

// Get ticket by ID
export const getTicketById = async (
  req: AuthRequest & { params: IdParams },
  res: Response,
  next: NextFunction
) => {
  try {
    const ticket = await ticketService.getTicketById(
      req.params.id,
      req.user!.userId,
      req.user!.role
    );
    res.json(ticket);
  } catch (error) {
    next(error);
  }
};

// Cancel ticket
export const cancelTicket = async (
  req: AuthRequest & { params: IdParams },
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await ticketService.cancelTicket(
      req.params.id,
      req.user!.userId,
      req.user!.role
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Check in ticket
export const checkInTicket = async (
  req: AuthRequest & { params: IdParams },
  res: Response,
  next: NextFunction
) => {
  try {
    const ticket = await ticketService.checkInTicket(
      req.params.id,
      req.user!.userId,
      req.user!.role
    );
    res.json(ticket);
  } catch (error) {
    next(error);
  }
};

// Verify ticket by code
export const verifyTicketByCode = async (
  req: Request<CodeParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await ticketService.verifyTicketByCode(req.params.code);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
