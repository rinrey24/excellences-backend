import { PartialType } from '@nestjs/mapped-types';
import { CreateProcedureDto } from './create-procedure.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateProcedureDto extends PartialType(CreateProcedureDto) {
        @IsNotEmpty()
        code!: string;
    
        @IsNotEmpty()
        description!: string;
}
