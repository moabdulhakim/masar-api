import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateRideDto } from "./dto/create-ride.dto";
import { Ride } from "./rides.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Driver } from "src/drivers/driver.entity";
import { RideStatus } from "./dto/ride-status.enum";


@Injectable()
export class RidesService {
    constructor(
        @InjectRepository(Ride)
        private readonly ridesRepository: Repository<Ride>,

        @InjectRepository(Driver)
        private readonly driversRepository: Repository<Driver>,
    ) {}

    async create(driverId: string, createRideDto: CreateRideDto){
        const driver = await this.driversRepository.findOneBy({id: driverId});

        if(!driver){
            throw new NotFoundException(`Driver with id ${driverId} not found`);
        }

        if(!driver.isAvailable){
            throw new BadRequestException(`${driver.name} is busy right now, please try again later`);
        }

        const newRide = this.ridesRepository.create({
            ...createRideDto,
            driver,
        })

        driver.isAvailable = false;
        await this.driversRepository.save(driver);

        return await this.ridesRepository.save(newRide);
    }
}