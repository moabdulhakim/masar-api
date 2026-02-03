import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { ApiResponseUtil } from 'src/common/utils/api-response.util';

@Controller({
  path: 'drivers',
  version: '1',
})
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  async create(@Body() createDriverDto: CreateDriverDto) {
    const driver = await this.driversService.create(createDriverDto);
    return ApiResponseUtil.success("Driver Profile created successfully", driver);
  }
}
