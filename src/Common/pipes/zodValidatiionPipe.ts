/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { AnyZodObject } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: AnyZodObject) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      // Validate the incoming request body using Zod
      const validatedData = await this.schema.parseAsync({ body: value });

      // Return only the validated body
      return validatedData.body;
    } catch (error) {
      // Throw error if validation fails
      throw new BadRequestException(error.errors);
    }
  }
}
