/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/main.ts
import 'reflect-metadata';
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import {
  ValidationPipe,
  UnprocessableEntityException,
  Logger,
} from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './utils/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  // 1) Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errs) => new UnprocessableEntityException(errs),
    }),
  );

  // 2) Security headers
  app.use(helmet());

  // 3) CORS
  app.use(
    cors({
      origin:
        configService.get<string>('NODE_ENV') === 'development'
          ? true
          : ['https://owasp-demo-7a4022e402b5.herokuapp.com/'],
      credentials: true,
    }),
  );

  // 4) Rate limiting (read the two env vars directly)
  const windowMs = configService.get<number>('RATE_LIMIT_WINDOW_MS', 60000);
  const max = configService.get<number>('RATE_LIMIT_MAX', 100);
  app.use(
    rateLimit({
      windowMs,
      max,
      message: 'Too many requests, please try again later.',
    }),
  );

  // 5) Exception filter
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // 6) Express tweaks
  const expressApp = httpAdapter.httpAdapter.getInstance();
  expressApp.enable('trust proxy');
  expressApp.set('x-powered-by', false);

  // 7) Start listening
  await app.listen(port);
  Logger.log(`Server running on http://0.0.0.0:${port}`, 'Bootstrap');
}

bootstrap();
