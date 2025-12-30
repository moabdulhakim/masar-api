import { Module } from "@nestjs/common";
import { RidesController } from "./rides.controller";
import { RidesService } from "./rides.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Ride } from "./rides.entity";
import { Driver } from "src/drivers/driver.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Ride, Driver])],
    controllers: [RidesController],
    providers: [RidesService],
})
export class RidesModule {}
