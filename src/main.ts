import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { PostgresErrorFilter } from './common/filters/postgres-error.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const trustProxy = process.env.TRUST_PROXY ?? 'loopback';
  app.set('trust proxy', trustProxy);

  app.use(helmet({
    contentSecurityPolicy: false,
  }));

  const defaultCorsOrigins = ['http://localhost:3001', 'http://localhost:3000'];
  const configuredCorsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
    : undefined;
  const corsOrigins =
    configuredCorsOrigins ?? (process.env.NODE_ENV === 'development' ? defaultCorsOrigins : []);

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(
    new PostgresErrorFilter(),
    new HttpExceptionFilter()
  );

  app.use(cookieParser());

  await app.listen(3000);
}

bootstrap();
