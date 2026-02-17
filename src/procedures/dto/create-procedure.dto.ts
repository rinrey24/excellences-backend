import { IsNotEmpty } from "class-validator";

export class CreateProcedureDto {
    @IsNotEmpty()
    code!: string;

    @IsNotEmpty()
    description!: string;
}
