/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/A10_logging/logging.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { LoggingService } from './logging.service';

@Controller('insufficient-logs')
export class LoggingController {
  constructor(private readonly logService: LoggingService) {}

  /**
   * 🔴 Vulnerable: swallows exceptions and never logs them.
   * GET /insufficient-logs/process?itemId=abc
   */
  @Get('process')
  async processItem(@Query('itemId') itemId: string) {
    try {
      return this.logService.doWork(itemId);
    } catch {
      // 🔴 No logging of the error
      return { message: 'Failed' };
    }
  }
}
