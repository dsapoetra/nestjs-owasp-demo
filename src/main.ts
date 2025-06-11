/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

  // 5. Rate Limiting with custom keyGenerator
  const rlConfig = configService.get<{
    windowMs: number;
    max: number;
  }>('rateLimit');
  app.use(
    rateLimit({
      windowMs: rlConfig?.windowMs,
      max: rlConfig?.max,
      message: 'Too many requests, please try again later.',
      keyGenerator: (req: Request) => {
        // 1) Try X-Forwarded-For header (comma-separated list)
        const xff = req.headers['x-forwarded-for'];
        if (typeof xff === 'string' && xff.length) {
          return xff.split(',')[0].trim();
        }
        // 2) Fallback to req.ip
        if (req.ip) {
          return req.ip;
        }
        // 3) Final fallback to socket remoteAddress
        return req.socket.remoteAddress ?? 'unknown';
      },
    }),
  );

  // 6. Global Exception Filter
  const httpAdapterHost = app.get<HttpAdapterHost>(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  // 7. Express-specific settings
  const expressApp = httpAdapterHost.httpAdapter.getInstance();
  expressApp.enable('trust proxy', true);
  expressApp.set('x-powered-by', false);

  // 8. Initialize the app (no listen for serverless)
  await app.init();
  return expressApp;
}

// Cache the server across lambda invocations
let server: import('express').Express;

export default serverless(async (req: Request, res: Response) => {
  server = server ?? (await createNestServer());
  return server(req, res);
});
