import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  VersionColumn,
} from 'typeorm';
import { RideStatus } from 'src/rides/dto/ride-status.enum';
import { Driver } from '../drivers/driver.entity';
import { User } from 'src/users/user.entity';

@Entity()
export class Ride {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('jsonb')
  startLocation: { lat: number; lng: number };

  @Column({ type: 'jsonb' })
  endLocation: { lat: number; lng: number };

  @Column('float')
  cost: number;

  @Column({ type: 'enum', enum: RideStatus, default: RideStatus.REQUESTED })
  status: RideStatus;

  @ManyToOne(() => Driver, (driver) => driver.rides, { nullable: true })
  driver: Driver;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'riderId' })
  rider: User;

  @VersionColumn()
  version: number;
}
