import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;
  
  @IsNotEmpty()
  name: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  role: string;
}
