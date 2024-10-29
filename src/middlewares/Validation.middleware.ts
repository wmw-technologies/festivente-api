import { NextFunction, Response } from 'express';
import { z, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';

function validate(schema: z.ZodObject<any, any>) {
  return async (req: any, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string> = {};

        error.errors.forEach((issue: any) => {
          errors[issue.path.join('.')] = issue.message;
        });

        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid data', errors });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
      }
    }
  };
}

export { validate };
