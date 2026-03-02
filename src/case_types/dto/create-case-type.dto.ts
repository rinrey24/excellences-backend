import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateCaseTypeDto {
  @IsNotEmpty()
  tipe_kasus!: string;

  @IsNotEmpty()
  description!: string;

  @IsBoolean()
  @IsNotEmpty()
  is_active!: boolean;
}
