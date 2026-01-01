import { Module } from '@nestjs/common';
import { DriversModule } from './drivers/drivers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RidesModule } from './rides/rides.module';
import { AuthModule } from './auth/auth.module';
import dbConfigDevelopment from './config/db.config.development';
import dbConfigProduction from './config/db.config.production';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: process.env.NODE_ENV === 'development' ? dbConfigDevelopment : dbConfigProduction,
    }),
    DriversModule,
    RidesModule,
    AuthModule,
  ],
})
export class AppModule {}
