import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRideDto } from './dto/create-ride.dto';
import { Ride } from './rides.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, OptimisticLockVersionMismatchError, Repository } from 'typeorm';
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
      const ride = await queryRunner.manager.findOne(Ride, {where: { id: rideId }});

      if (!ride) {
        throw new NotFoundException('Invalid Ride Id');
      }

      if (ride.status !== RideStatus.REQUESTED) {
        throw new BadRequestException('This ride is already taken or cancelled');
      }

      const driver = await queryRunner.manager.findOne(Driver, {where: { id: driverId }});

      if (!driver) {
        throw new NotFoundException('Invalid Driver Id');
      }

      if (!driver.isAvailable) {
        throw new BadRequestException(
          'You are not available right now, try after this ride is completed',
        );
      }

      driver.isAvailable = false;
      await queryRunner.manager.save(driver);

      const resultOfUpdateRide = await queryRunner.manager
      .createQueryBuilder()
      .update(Ride)
      .set({status: RideStatus.PENDING})
      .where("id = :id", { id: rideId })
      .andWhere("version = :currentVersion", { currentVersion: ride.version })
      .execute();

      if(resultOfUpdateRide.affected == 0){
        throw new OptimisticLockVersionMismatchError('Ride', ride.version, ride.version+1);
      }

      const updatedRide = await queryRunner.manager.findOne(Ride, { where: { id: rideId } });

      await queryRunner.commitTransaction();
      return updatedRide;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      if(err instanceof OptimisticLockVersionMismatchError) {
        throw new BadRequestException('Ups! Someone else took this ride just now.');
      }

      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
