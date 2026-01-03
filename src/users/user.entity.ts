import { Driver } from 'src/drivers/driver.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';


export enum UserRole {
  DRIVER = 'driver',
  RIDER = 'rider',
  ADMIN = 'admin',
}


@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({length: 50})
  name: string;

  @Column({ unique: true, length: 15 })
  phone: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({length: 100})
  password: string;

  @Column({ type: 'jsonb', nullable: true })
  location: { lat: number; lng: number };

  @Column({ default: 'online' }) // online or offline
  status: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    array: true,
    default: [UserRole.RIDER]
  })
  roles: UserRole[];

  @Column({ nullable: true })
  hashedRefreshToken: string | null;

  @OneToOne(() => Driver, (driver) => driver.user, {nullable: true})
  driverProfile: Driver;
}
