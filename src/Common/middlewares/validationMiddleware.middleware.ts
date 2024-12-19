import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

@Injectable()
export class ValidationMiddleware implements NestMiddleware {
  constructor(private schema: ZodSchema<any>) {} // Inject your schema dynamically

  use(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate the request body using the schema
      this.schema.parseAsync({
        body: req.body,
        cookies: req.cookies,
      });
      return next();
    } catch (error) {
      next(error);
      throw new BadRequestException(error.errors || 'Validation failed');
    }
  }
}
