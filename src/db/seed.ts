import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getEntityManagerToken, getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from '../users/user.entity';
import { Driver } from '../drivers/driver.entity';
import { Ride } from '../rides/rides.entity';
import { RideStatus } from '../rides/dto/ride-status.enum';
import { EntityManager, Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { VehicleType } from '../drivers/dto/vehicle-type.enum';
import { faker } from '@faker-js/faker';

async function bootstrap() {
  if (process.env.NODE_ENV === 'production') {
    console.error('Seeding is only allowed in development environment');
    process.exit(1);
  }

  process.env.NODE_ENV = 'development';

  const app = await NestFactory.createApplicationContext(AppModule);

  const entityManager = app.get<EntityManager>(getEntityManagerToken());
  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));
  const driverRepository = app.get<Repository<Driver>>(
    getRepositoryToken(Driver),
  );
  const rideRepository = app.get<Repository<Ride>>(getRepositoryToken(Ride));

  console.log('Clearing existing data...');
  // Requirement 5: Proper Reset Strategy using TRUNCATE CASCADE
  // Quoting "user" is important as it's a reserved keyword in Postgres
  await entityManager.query('TRUNCATE TABLE "ride", "driver", "user" RESTART IDENTITY CASCADE;');

  console.log('Seeding data...');

  const password = await argon2.hash('password123');

  // Requirement 4: Deterministic Test Accounts
  console.log('Creating deterministic test accounts...');
  
  // Create fixed riders
  const fixedRiders = [
    userRepository.create({
      name: 'Fixed Rider 1',
      phone: '+966500000001',
      email: 'rider1@test.com',
      password,
      roles: [UserRole.RIDER],
      status: 'online',
      location: { lat: 24.7136, lng: 46.6753 },
    }),
    userRepository.create({
      name: 'Fixed Rider 2',
      phone: '+966500000002',
      email: 'rider2@test.com',
      password,
      roles: [UserRole.RIDER],
      status: 'offline',
      location: { lat: 24.7136, lng: 46.6753 },
    }),
  ];
  await userRepository.save(fixedRiders);

  // Create fixed drivers
  const fixedDriverUsers = [
    userRepository.create({
      name: 'Fixed Driver 1',
      phone: '+966500000003',
      email: 'driver1@test.com',
      password,
      roles: [UserRole.DRIVER],
      status: 'online',
      location: { lat: 24.7136, lng: 46.6753 },
    }),
    userRepository.create({
      name: 'Fixed Driver 2',
      phone: '+966500000004',
      email: 'driver2@test.com',
      password,
      roles: [UserRole.DRIVER],
      status: 'online',
      location: { lat: 24.7136, lng: 46.6753 },
    }),
  ];
  await userRepository.save(fixedDriverUsers);

  const fixedDriversProfiles = fixedDriverUsers.map((user, index) =>
    driverRepository.create({
      rating: 5.0,
      vehicleType: index === 0 ? VehicleType.CAR : VehicleType.VAN,
      driverLicenseId: `FIXED_DL_${index + 1}`,
      isAvailable: true,
      user: user,
    }),
  );
  await driverRepository.save(fixedDriversProfiles);

  // 2. Generate Random Riders
  console.log('Generating Random Riders...');
  const randomRidersToCreate = Array.from({ length: 100 }).map(() =>
    userRepository.create({
      name: faker.person.fullName(),
      phone: faker.phone.number({ style: 'international' }).slice(0, 15),
      email: faker.internet.email(),
      password,
      roles: [UserRole.RIDER],
      status: faker.helpers.arrayElement(['online', 'offline']),
      location: {
        lat: faker.location.latitude({ max: 25.0, min: 24.0 }),
        lng: faker.location.longitude({ max: 47.0, min: 46.0 }),
      },
    }),
  );
  const randomRiders = await userRepository.save(randomRidersToCreate, { chunk: 50 });
  const allRiders = [...fixedRiders, ...randomRiders];

  // 3. Generate Random Drivers
  console.log('Generating Random Drivers...');
  const randomDriverUsersToCreate = Array.from({ length: 30 }).map(() =>
    userRepository.create({
      name: faker.person.fullName(),
      phone: faker.phone.number({ style: 'international' }).slice(0, 15),
      email: faker.internet.email(),
      password,
      roles: [UserRole.DRIVER],
      status: faker.helpers.arrayElement(['online', 'offline']),
      location: {
        lat: faker.location.latitude({ max: 25.0, min: 24.0 }),
        lng: faker.location.longitude({ max: 47.0, min: 46.0 }),
      },
    }),
  );
  const randomDriverUsers = await userRepository.save(randomDriverUsersToCreate, { chunk: 50 });

  const randomDriversProfilesToCreate = randomDriverUsers.map((user) =>
    driverRepository.create({
      rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
      vehicleType: faker.helpers.enumValue(VehicleType),
      driverLicenseId: faker.string.alphanumeric(10).toUpperCase(),
      isAvailable: user.status === 'online',
      user: user,
    }),
  );
  const randomDrivers = await driverRepository.save(randomDriversProfilesToCreate, { chunk: 50 });
  const allDrivers = [...fixedDriversProfiles, ...randomDrivers];

  // 4. Generate Rides
  console.log('Generating Rides...');
  const ridesToCreate = Array.from({ length: 200 }).map(() => {
    const randomDriver = faker.helpers.arrayElement(allDrivers);
    const randomRider = faker.helpers.arrayElement(allRiders);
    const hasDriver = faker.datatype.boolean({ probability: 0.8 });

    return rideRepository.create({
      startLocation: {
        lat: faker.location.latitude({ max: 25.0, min: 24.0 }),
        lng: faker.location.longitude({ max: 47.0, min: 46.0 }),
      },
      endLocation: {
        lat: faker.location.latitude({ max: 25.0, min: 24.0 }),
        lng: faker.location.longitude({ max: 47.0, min: 46.0 }),
      },
      cost: faker.number.float({ min: 10, max: 250, fractionDigits: 2 }),
      status: faker.helpers.enumValue(RideStatus),
      // Requirement 3: Assign random rider. (Using 'as any' to avoid TS error if the relation isn't explicitly defined in the entity yet)
      rider: randomRider as any,
      // Requirement 1: Conditionally add driver without passing null
      ...(hasDriver ? { driver: randomDriver } : {}),
    });
  });
  await rideRepository.save(ridesToCreate, { chunk: 50 });

  console.log(`\nSeeding completed successfully:`);
  console.log(`- ${allRiders.length} Riders created`);
  console.log(`- ${allDrivers.length} Drivers created`);
  console.log(`- ${ridesToCreate.length} Rides created`);

  console.log(`\n--- Test Accounts (Password: 'password123') ---`);
  console.log(`Riders:`);
  fixedRiders.forEach((r) => console.log(`  - Email: ${r.email}`));
  console.log(`Drivers:`);
  fixedDriverUsers.forEach((d) => console.log(`  - Email: ${d.email}`));
  console.log(`-----------------------------------------------\n`);

  await app.close();
}

bootstrap().catch((err) => {
  console.error('Seeding failed', err);
  process.exit(1);
});
