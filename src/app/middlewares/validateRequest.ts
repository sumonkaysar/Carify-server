import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

const validateRequest = (zodSchema: ZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }
      req.body = await zodSchema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;
