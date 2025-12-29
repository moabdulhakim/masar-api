import { Body, Controller, Get, NotFoundException, Param, Post } from "@nestjs/common";
import { DriversService } from "./drivers.service";
import { CreateDriverDto } from "./dto/create-driver.dto";
import { Repository } from "typeorm";
import { Driver } from "./driver.entity";


@Controller({
    path: "drivers",
    version: "1",
})
export class DriversController {

    constructor(private readonly driversService: DriversService){}

    @Get()
    getAll(){
        return this.driversService.getAllDrivers();
    }

    @Get(":id")
    getById(@Param("id") id: string){
        const driver = this.driversService.getById(id);

        if(!driver){
            throw new NotFoundException(`Driver with id ${id} not found`);
        }

        return driver;
    }

    @Post()
    create(@Body() createDriverDto: CreateDriverDto){
        return this.driversService.create(createDriverDto);
    }
}