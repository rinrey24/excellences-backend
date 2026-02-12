import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateHospitalDto {
    @IsNotEmpty()
    kode_rs!: string;

    @IsNotEmpty()
    name!: string;

    @IsNotEmpty()
    kelas_rs!: string;

    @IsNotEmpty()
    address!: string;
    
    @IsOptional()
    phone!: string;
}
