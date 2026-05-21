import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateDischargeDto {
  @IsNotEmpty()
  discharge_status!: string;

  @IsNotEmpty()
  description!: string;

  @IsBoolean()
  @IsNotEmpty()
  is_active!: boolean;
}
