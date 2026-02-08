// auth/dto/login.dto.ts
import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  username: string;

  @MinLength(6)
  password: string;
}
