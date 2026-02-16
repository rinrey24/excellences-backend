import { IsNotEmpty, IsNumber, IsOptional, Min, ValidateIf } from "class-validator";

export class CreateOverstayDto {
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
