import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VehicleType } from '../drivers/dto/vehicle-type.enum';
import { Ride } from 'src/rides/rides.entity';
import { User } from 'src/users/user.entity';

@Entity()
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float', { default: 5.0 })
  rating: number;

  @Column({ enum: VehicleType, type: 'enum', default: VehicleType.CAR })
  vehicleType: VehicleType;

  @Column({ length: 100 })
  driverLicenseId: string;

  @Column({ type: 'jsonb', nullable: true })
  workingHours: { from: string; to: string };

  @Column({ default: true })
  isAvailable: boolean;

  @OneToMany(() => Ride, (ride) => ride.driver)
  rides: Ride[];

  @OneToOne(() => User, (user) => user.driverProfile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
