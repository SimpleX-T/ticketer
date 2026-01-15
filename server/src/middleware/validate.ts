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
      // For body, we can assign back the parsed data
      // For query/params, we store in res.locals since they're readonly
      if (target === "body") {
        (req as any).body = data;
      } else {
        // Store validated data in res.locals for later access
        res.locals[
          `validated${target.charAt(0).toUpperCase() + target.slice(1)}`
        ] = data;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
