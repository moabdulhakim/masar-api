import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { VehicleType } from './vehicle-type.enum';

export class CreateDriverDto {
  @IsString({ message: 'The name must be a string' })
  @IsNotEmpty()
  name: string;

  @IsEnum(VehicleType, { message: 'Vehicle Type must be a string' })
  @IsNotEmpty()
  vehicleType: VehicleType;

  @IsString({ message: 'Phone must be a string' })
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString({ message: 'Driver License ID must be a string' })
  @IsNotEmpty()
  driverLicenseId: string;
}
