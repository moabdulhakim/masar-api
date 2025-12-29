import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { PostgresErrorFilter } from "./common/filters/postgres-error.filter";


async function bootstrap(){
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix("api");

    app.enableVersioning({
        type: VersioningType.URI,
    })

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        
    }))

    app.useGlobalFilters(new PostgresErrorFilter());

    await app.listen(3000);
}

bootstrap();