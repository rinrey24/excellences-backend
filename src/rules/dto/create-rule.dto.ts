import {  IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateRuleDto {
    @IsNotEmpty()
    name!: string;

    @IsOptional()
    description?: string;

    @IsNotEmpty()
    category!: string;

    @IsNotEmpty()
    severity_level!: string;

    @IsNotEmpty()
    @IsNumber()
    score!: number;

    @IsNotEmpty()
    expression!: any;

    @IsNotEmpty()
    is_active!: boolean;
    
}
