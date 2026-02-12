import { PartialType } from '@nestjs/mapped-types';
import { CreateHospitalDto } from './create-hospital.dto';
import { IsOptional } from 'class-validator';

export class UpdateHospitalDto extends PartialType(CreateHospitalDto) {
    @IsOptional()
    kode_rs?: number;

    @IsOptional()
    name?: string;

    @IsOptional()
    kelas_rs?: string;

    @IsOptional()
    address?: string;
}
