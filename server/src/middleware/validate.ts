import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodSchema } from "zod";

type ValidateTarget = "body" | "query" | "params";

export const validate = (
  schema: ZodSchema,
  target: ValidateTarget = "body"
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = schema.parse(req[target]);
      req[target] = data;
      next();
    } catch (error) {
      next(error);
    }
  };
};
