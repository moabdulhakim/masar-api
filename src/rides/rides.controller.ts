import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RidesService } from './rides.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthJWTPayload } from 'src/auth/types/auth-jwtPayload';
import { ApiResponseUtil } from 'src/common/utils/api-response.util';

@Controller({
  path: 'rides',
  version: '1',
})
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @Get()
  async findAll() {
    const rides = await this.ridesService.findAll();
    return ApiResponseUtil.success("Rides fetched successfully", rides);
  }

  @Post()
  async create(@Body() createRideDto: CreateRideDto) {
    const ride = await this.ridesService.create(createRideDto);
    return ApiResponseUtil.success("Ride created successfully", ride);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':rideId/accept')
  async acceptRide(
    @Param('rideId', ParseUUIDPipe) rideId: string,
    @CurrentUser() user: AuthJWTPayload
  ) {
    const driverId = user.sub;
    const ride = await this.ridesService.acceptRide(rideId, driverId);
    
    return ApiResponseUtil.success("Ride accepted successfully", ride);
  }
}
