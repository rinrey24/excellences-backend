import { PartialType } from '@nestjs/mapped-types';
import { CreateHospitalDto } from './create-hospital.dto';
import { IsOptional } from 'class-validator';

export class UpdateHospitalDto extends PartialType(CreateHospitalDto) {
    @IsOptional()
    code?: string;

    @IsOptional()
    name?: string;

    @IsOptional()
    class?: string;

    @IsOptional()
    address?: string;
    
    @IsOptional()
    phone?: string;
}
