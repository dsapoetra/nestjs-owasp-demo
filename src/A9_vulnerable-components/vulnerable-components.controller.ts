/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
// src/A9_vulnerable-components/vulnerable-components.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { VulnerableComponentsService } from './vulnerable-components.service';

@Controller('vuln-components')
export class VulnerableComponentsController {
  constructor(private readonly vcService: VulnerableComponentsService) {}

  /**
   * 🔴 Vulnerable: merges user‐provided object into a default using lodash@4.17.4
   * Prototype‐pollution can occur if payload includes `__proto__`.
   *
   * POST /vuln-components/merge
   * Body: { "__proto__": { "isAdmin": true } }
   * → returns { isAdmin: true, name: “guest” }
   */
  @Post('merge')
  async merge(@Body() payload: any) {
    return this.vcService.mergeObjects(payload);
  }
}
