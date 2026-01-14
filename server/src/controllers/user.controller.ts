import { Response, NextFunction } from "express";
import * as userService from "../services/user.service";
import { AuthRequest } from "../middleware/auth";

interface IdParams {
  id: string;
}

// Get user by ID
export const getUserById = async (
  req: AuthRequest & { params: IdParams },
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Update user
export const updateUser = async (
  req: AuthRequest & { params: IdParams },
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.updateUser(
      req.params.id,
      req.user!.userId,
      req.body
    );
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Update user role
export const updateUserRole = async (
  req: AuthRequest & { params: IdParams },
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.updateUserRole(
      req.params.id,
      req.user!.userId,
      req.body
    );
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Get user's events
export const getUserEvents = async (
  req: AuthRequest & { params: IdParams },
  res: Response,
  next: NextFunction
) => {
  try {
    const events = await userService.getUserEvents(req.params.id);
    res.json(events);
  } catch (error) {
    next(error);
  }
};

// Get user's tickets
export const getUserTickets = async (
  req: AuthRequest & { params: IdParams },
  res: Response,
  next: NextFunction
) => {
  try {
    const tickets = await userService.getUserTickets(req.params.id);
    res.json(tickets);
  } catch (error) {
    next(error);
  }
};
