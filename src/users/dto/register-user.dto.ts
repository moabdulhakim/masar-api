import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsString({ message: 'The name must be a string' })
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString({ message: 'Phone must be a string' })
  @IsNotEmpty()
  @MaxLength(15)
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  password: string;
}
