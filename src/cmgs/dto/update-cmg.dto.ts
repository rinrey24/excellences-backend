import { PartialType } from '@nestjs/mapped-types';
import { CreateCmgDto } from './create-cmg.dto';

export class UpdateCmgDto extends PartialType(CreateCmgDto) {}
