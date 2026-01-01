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

@Controller({
  path: 'rides',
  version: '1',
})
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @Get()
  findAll() {
    return this.ridesService.findAll();
  }

  @Post()
  create(@Body() createRideDto: CreateRideDto) {
    return this.ridesService.create(createRideDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':rideId/accept')
  acceptRide(
    @Param('rideId', ParseUUIDPipe) rideId: string,
    @CurrentUser() user: { id: string, email: string }
  ) {
    const driverId = user.id;
    return this.ridesService.acceptRide(rideId, driverId);
  }
}
