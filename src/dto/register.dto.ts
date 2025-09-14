import { IsEmail, IsNotEmpty, MinLength, IsNumber } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNumber()
  @IsNotEmpty()
  roleId: number;
}
