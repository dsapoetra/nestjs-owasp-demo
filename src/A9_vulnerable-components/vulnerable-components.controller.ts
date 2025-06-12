/* eslint-disable @typescript-eslint/no-unsafe-call */
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
   * Step 1: Prototype pollution endpoint.
   * Posting {"__proto__": { isAdmin: true }} will pollute Object.prototype.
   */
  @Post('merge')
  merge(@Body() payload: any) {
    // Call the service's 'merge' method (not 'mergeObjects')
    return this.vulnService.merge(payload);
  }

  /**
   * Step 2: Check pollution.
   * Returns a fresh object’s isAdmin property, which
   * will be `true` if the prototype was polluted.
   */
  @Get('check')
  checkPollution() {
    const obj: any = {};
    return { isAdmin: obj.isAdmin };
  }
}
