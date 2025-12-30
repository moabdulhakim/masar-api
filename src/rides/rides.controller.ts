import { Body, Controller, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { RidesService } from "./rides.service";
import { CreateRideDto } from "./dto/create-ride.dto";


@Controller({
    path: "rides",
    version: "1",
})
export class RidesController {
    constructor(private readonly ridesService: RidesService){}

    @Post(":driverId")
    create(@Param("driverId", ParseUUIDPipe) driverId: string, @Body() createRideDto: CreateRideDto){
        return this.ridesService.create(driverId, createRideDto);
    }
}