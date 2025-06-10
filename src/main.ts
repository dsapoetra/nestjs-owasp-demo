/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/main.ts
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import {
  ValidationPipe,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import * as cors from 'cors';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './utils/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');

  // 1) Global validation pipe for DTOs (reject unknown and auto-transform)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );

  // 2) Security headers
  app.use(helmet.default());

  // 3) CORS (allow only a whitelist of origins in production)
  app.use(
    cors({
      origin:
        configService.get('NODE_ENV') === 'development'
          ? true
          : ['https://your-production-domain.com'],
      credentials: true,
    }),
  );

  // 4) Rate limiting
  const rateLimitConfig = configService.get('rateLimit');
  app.use(
    rateLimit.default({
      windowMs: rateLimitConfig.windowMs,
      max: rateLimitConfig.max,
      message: 'Too many requests, please try again later.',
    }),
  );

  // 5) Global exception filter (hide stack traces in production)
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // 6) (Optional) Disable “x-powered-by” header and enable trust proxy
  const expressInstance = httpAdapter.httpAdapter.getInstance();
  expressInstance.enable('trust proxy');
  expressInstance.set('x-powered-by', false);

  await app.listen(port!);
  Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
