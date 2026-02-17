import { IsNotEmpty } from "class-validator";

export class CreateDiagnosisDto {
    @IsNotEmpty()
    code!: string;

    @IsNotEmpty()
    description!: string;
}
