import { PartialType } from '@nestjs/mapped-types';
import { CreateCAndSubCDto } from './create-c-and-sub-c.dto';

export class UpdateCAndSubCDto extends PartialType(CreateCAndSubCDto) {}
