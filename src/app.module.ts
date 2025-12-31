import { Module } from "@nestjs/common";
import { DriversModule } from "./drivers/drivers.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { RidesModule } from "./rides/rides.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env"
        }),
        TypeOrmModule.forRoot({
            type: "postgres",
            url: process.env.DATABASE_URL,
            autoLoadEntities: true,
            synchronize: true,
            logging: false, // for debugging
            ssl: true,
        }),
        DriversModule,
        RidesModule,
    ],
})
export class AppModule {}