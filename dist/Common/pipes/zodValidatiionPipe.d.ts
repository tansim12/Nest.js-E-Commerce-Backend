import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { AnyZodObject } from 'zod';
export declare class ZodValidationPipe implements PipeTransform {
    private schema;
    constructor(schema: AnyZodObject);
    transform(value: any, metadata: ArgumentMetadata): Promise<any>;
}
