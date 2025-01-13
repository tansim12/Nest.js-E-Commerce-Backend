import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
export declare class ValidationMiddleware implements NestMiddleware {
    private schema;
    constructor(schema: ZodSchema<any>);
    use(req: Request, res: Response, next: NextFunction): void;
}
