import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateHospitalDto {
    @IsNotEmpty()
    code!: string;

    @IsNotEmpty()
    name!: string;

    @IsNotEmpty()
    class!: string;

    @IsNotEmpty()
    address!: string;
    
    @IsOptional()
    phone!: string;
}
