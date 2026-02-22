import { PartialType } from '@nestjs/mapped-types';
import { CreateHospitalDto } from './create-hospital.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateHospitalDto extends PartialType(CreateHospitalDto) {
    @IsNotEmpty()
    code?: string;

    @IsNotEmpty()
    name?: string;

    @IsNotEmpty()
    class?: string;

    @IsNotEmpty()
    address?: string;
    
    @IsOptional()
    phone?: string;
        
    @IsNotEmpty()
    max_visit_rj_permonth!: number;

    @IsNotEmpty()
    max_visit_ri_permonth!: number;
}
