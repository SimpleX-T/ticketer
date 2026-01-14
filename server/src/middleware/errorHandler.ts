import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(`[Error] ${err.message}`, {
    path: req.path,
    method: req.method,
    stack: err.stack,
  });

  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation error",
      details: err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
    return;
  }

  // Known API errors
  if (err.statusCode) {
    res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
    return;
  }

  // Prisma errors
  if (err.code === "P2002") {
    res.status(409).json({
      error: "A record with this value already exists",
      code: "DUPLICATE_ENTRY",
    });
    return;
  }

  if (err.code === "P2025") {
    res.status(404).json({
      error: "Record not found",
      code: "NOT_FOUND",
    });
    return;
  }

  // Unknown errors
  res.status(500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
};

// Custom error class
export class AppError extends Error {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Common errors
export const notFound = (resource: string = "Resource") =>
  new AppError(`${resource} not found`, 404, "NOT_FOUND");

export const unauthorized = (message: string = "Unauthorized") =>
  new AppError(message, 401, "UNAUTHORIZED");

export const forbidden = (message: string = "Forbidden") =>
  new AppError(message, 403, "FORBIDDEN");

export const badRequest = (message: string) =>
  new AppError(message, 400, "BAD_REQUEST");

export const conflict = (message: string) =>
  new AppError(message, 409, "CONFLICT");
