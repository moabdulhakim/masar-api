import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { VehicleType } from './vehicle-type.enum';

export class CreateDriverDto {
  @IsString({ message: 'The name must be a string' })
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsEnum(VehicleType, { message: 'Vehicle Type must be a string' })
  @IsNotEmpty()
  vehicleType: VehicleType;

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

  @IsString({ message: 'Driver License ID must be a string' })
  @IsNotEmpty()
  @MaxLength(100)
  driverLicenseId: string;
}
