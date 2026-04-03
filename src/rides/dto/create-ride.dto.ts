import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  lng: number;
}

export class CreateRideDto {
  @ValidateNested()
  @Type(() => LocationDto)
  startLocation: LocationDto;

  @ValidateNested()
  @Type(() => LocationDto)
  endLocation: LocationDto;

  @IsNumber()
  @IsNotEmpty()
  cost: number;
}
