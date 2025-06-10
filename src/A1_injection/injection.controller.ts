/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
// src/A1_injection/injection.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { InjectionService } from './injection.service';

@Controller('injection')
export class InjectionController {
  constructor(private readonly injectionService: InjectionService) {}

  /**
   * 🔴 Vulnerable: concatenates `username` into SQL directly.
   * Example: /injection/users?username=alice
   * Malicious: /injection/users?username=' OR '1'='1
   */
  @Get('users')
  async getUserByUsername(@Query('username') username: string) {
    return this.injectionService.findByUsername(username);
  }
}
