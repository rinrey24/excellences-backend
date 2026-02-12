import { IsNotEmpty } from "class-validator";

export class CreateHospitalDto {
    @IsNotEmpty()
    kode_rs!: number;

    @IsNotEmpty()
    name!: string;

    @IsNotEmpty()
    kelas_rs!: string;

    @IsNotEmpty()
    address!: string;
}
