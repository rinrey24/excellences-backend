import { PartialType } from '@nestjs/mapped-types';
import { CreateOverstayDto } from './create-overstay.dto';
import { IsNotEmpty, IsNumber, Min, ValidateIf, IsOptional } from 'class-validator';

export class UpdateOverstayDto extends PartialType(CreateOverstayDto) {
        @IsNotEmpty()
        category!: string;
    
        @IsNotEmpty()
        @IsNumber()
        @Min(0)
        value_start!: number;
    
        @IsNotEmpty()
        @IsNumber()
        @ValidateIf(o => o.value_end !== undefined)
        @Min(0) // Logic to compare: ensure maxPrice >= minPrice
        value_end!: number; 
    
        @IsOptional()
        description?: string;
        
        @IsNotEmpty()
        is_overstay!: boolean;
    
        @IsNotEmpty()
        is_active!: boolean;
}
