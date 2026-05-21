import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateCmgDto {
  @IsNotEmpty()
  code_cmg!: string;

  @IsNotEmpty()
  description!: string;

  @IsBoolean()
  @IsNotEmpty()
  is_active!: boolean;
}
