import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RideStatus } from "./dto/ride-status.enum";
import { Driver } from "src/drivers/driver.entity";


@Entity()
export class Ride {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("jsonb")
    startLocation: {lat: number, lng: number};

    @Column({type: "jsonb"})
    endLocation: {lat: number, lng: number};

    @Column("float")
    cost: number;

    @Column({type: "enum", enum: RideStatus, default: RideStatus.PENDING})
    status: RideStatus;

    @ManyToOne(()=> Driver, (driver)=> driver.rides)
    driver: Driver;
}