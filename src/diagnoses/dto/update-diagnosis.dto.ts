import { PartialType } from '@nestjs/mapped-types';
import { CreateDiagnosisDto } from './create-diagnosis.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateDiagnosisDto extends PartialType(CreateDiagnosisDto) {
        @IsNotEmpty()
        code!: string;
    
        @IsNotEmpty()
        description!: string;
}
