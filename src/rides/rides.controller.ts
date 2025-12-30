import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { RidesService } from "./rides.service";
import { CreateRideDto } from "./dto/create-ride.dto";


@Controller({
    path: "rides",
    version: "1",
})
export class RidesController {
    constructor(private readonly ridesService: RidesService){}

    @Get()
    findAll(){
        return this.ridesService.findAll();
    }
    
    @Post()
    create(@Body() createRideDto: CreateRideDto){
        return this.ridesService.create(createRideDto);
    }

    @Post(":rideId/accept/:driverId")
    acceptRide(@Param("rideId", ParseUUIDPipe) rideId: string, @Param("driverId", ParseUUIDPipe) driverId: string){
        return this.ridesService.acceptRide(rideId, driverId);
    }
}