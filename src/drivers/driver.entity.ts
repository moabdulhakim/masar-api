import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VehicleType } from './dto/vehicle-type.enum';
import { Ride } from 'src/rides/rides.entity';

@Entity()
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  phone: string;

  @Column({unique: true})
  email: string;

  @Column()
  password: string;

  @Column('float', { default: 5.0 })
  rating: number;

  @Column({ enum: VehicleType, type: 'enum', default: VehicleType.CAR })
  vehicleType: VehicleType;

  @Column()
  driverLicenseId: string;

  @Column({ default: 'online' }) // online or offline
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  workingHours: { from: string; to: string };

  @Column({ type: 'jsonb', nullable: true })
  location: { lat: number; lng: number };

  @Column({ default: true })
  isAvailable: boolean;

  @OneToMany(() => Ride, (ride) => ride.driver)
  rides: Ride[];
}
