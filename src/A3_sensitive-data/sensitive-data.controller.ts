/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
// src/A3_sensitive-data/sensitive-data.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { SensitiveDataService } from './sensitive-data.service';

@Controller('sensitive-data')
export class SensitiveDataController {
  constructor(private readonly sdService: SensitiveDataService) {}

  /**
   * 🔴 Vulnerable: returns full credit card data in cleartext.
   * GET /sensitive-data/credit-card?userId=1
   */
  @Get('credit-card')
  async getCreditCard(@Query('userId') userId: string) {
    return this.sdService.getCreditCard(userId);
  }
}
