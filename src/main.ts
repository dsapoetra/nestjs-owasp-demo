/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/main.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NestFactory } from '@nestjs/core';
import { HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe, UnprocessableEntityException } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import serverless from 'serverless-http';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './utils/all-exceptions.filter';
import type { Request, Response } from 'express';

async function createNestServer(): Promise<Express.Application> {
  // 1. Create Nest application
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // 2. Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );

  // 3. Security Headers
  app.use(helmet());

  // 4. CORS Configuration
  const configService = app.get(ConfigService);
  app.use(
    cors({
      origin:
        configService.get<string>('NODE_ENV') === 'development'
          ? true
          : ['https://your-production-domain.com'],
      credentials: true,
    }),
  );

  // 5. Rate Limiting
  const rlConfig = configService.get<{
    windowMs: number;
    max: number;
  }>('rateLimit');
  app.use(
    rateLimit({
      windowMs: rlConfig?.windowMs,
      max: rlConfig?.max,
      message: 'Too many requests, please try again later.',
    }),
  );

  // 6. Global Exception Filter
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  // 7. Express-specific settings
  const expressApp = httpAdapterHost.httpAdapter.getInstance();
  expressApp.enable('trust proxy');
  expressApp.set('x-powered-by', false);

  // 8. Initialize the app (no listen for serverless)
  await app.init();

  return expressApp;
}

// Cache the server across lambda invocations
let cachedServer: import('express').Express;

export default serverless(async (req: Request, res: Response) => {
  cachedServer = cachedServer ?? (await createNestServer());
  return cachedServer(req, res);
});
