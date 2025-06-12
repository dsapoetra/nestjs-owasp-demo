/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/A9_vulnerable-components/vulnerable-components.controller.ts

import { Controller, Post, Body, Get } from '@nestjs/common';
import { VulnerableComponentsService } from './vulnerable-components.service';

@Controller('vuln-components')
export class VulnerableComponentsController {
  constructor(private readonly vulnService: VulnerableComponentsService) {}

  /**
   * Vulnerable merge that performs prototype pollution.
   * Merges the user payload into Object.prototype.
   */
  @Post('merge')
  merge(@Body() payload: any) {
    return this.vulnService.mergeObjects(payload);
  }

  /**
   * Prototype Pollution Check Endpoint
   * Returns a fresh object’s isAdmin property, which will be inherited
   * from Object.prototype if it has been polluted.
   */
  @Get('check')
  checkPollution() {
    const obj: any = {};
    return { isAdmin: obj.isAdmin };
  }
}
