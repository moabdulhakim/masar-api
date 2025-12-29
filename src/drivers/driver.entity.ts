import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { VehicleType } from "./dto/vehicle-type.enum";


@Entity()
export class Driver {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column({unique: true})
    phone: string;

    @Column("float", {default: 5.0})
    rating: number;

    @Column({enum: VehicleType, type: "enum", default: VehicleType.CAR})
    vehicleType: VehicleType;

    @Column()
    driverLicenseId: string;

    @Column({default: "offline"})
    status: string;

    @Column({type: "json", nullable: true})
    location: string;

    @Column({default: true})
    isAvailable: boolean;
}
