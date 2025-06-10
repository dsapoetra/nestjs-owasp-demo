/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/utils/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let responseBody: any = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const response = exception.getResponse();
      responseBody =
        typeof response === 'string'
          ? { statusCode: httpStatus, message: response }
          : { ...response, statusCode: httpStatus };
    } else {
      this.logger.error((exception as any).message, (exception as any).stack);
    }

    // In production, remove stack trace from response
    if (process.env.NODE_ENV !== 'development') {
      delete responseBody.stack;
    } else {
      // In development, include stack
      responseBody['stack'] = (exception as any).stack;
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
