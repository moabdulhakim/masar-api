import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRideDto } from './dto/create-ride.dto';
import { Ride } from './rides.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Driver } from 'src/drivers/driver.entity';
import { RideStatus } from './dto/ride-status.enum';

@Injectable()
export class RidesService {
  constructor(
    @InjectRepository(Ride)
    private readonly ridesRepository: Repository<Ride>,

    private readonly dataSource: DataSource,
  ) {}

  async findAll() {
    return await this.ridesRepository.find();
  }

  async create(createRideDto: CreateRideDto) {
    const newRide = this.ridesRepository.create({ ...createRideDto });
    return await this.ridesRepository.save(newRide);
  }

  async acceptRide(rideId: string, driverId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const ride = await queryRunner.manager.findOne(Ride, {
        where: { id: rideId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!ride) {
        throw new NotFoundException('Invalid Ride Id');
      }

      if (ride.status !== RideStatus.REQUESTED) {
        throw new BadRequestException('This ride is already taken or cancelled');
      }

      const driver = await queryRunner.manager.findOne(Driver, {
        where: { id: driverId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!driver) {
        throw new NotFoundException('Invalid Driver Id');
      }

      if (!driver.isAvailable) {
        throw new BadRequestException(
          'You are not available right now, try after this ride is completed',
        );
      }

      ride.status = RideStatus.PENDING;
      driver.isAvailable = false;

      await queryRunner.manager.save(ride);
      await queryRunner.manager.save(driver);

      await queryRunner.commitTransaction();
      return ride;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
