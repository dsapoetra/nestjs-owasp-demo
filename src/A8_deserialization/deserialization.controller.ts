/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/A8_deserialization/deserialization.controller.ts
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { DeserializationService } from './deserialization.service';

@Controller('deserialization')
export class DeserializationController {
  constructor(private readonly dsService: DeserializationService) {}

  /**
   * 🔴 Vulnerable: uses eval() on client-supplied code string
   *
   * POST /deserialization/eval
   * Body: { "script": "2 + 2" }  → returns 4
   * Body: { "script": "require('child_process').execSync('ls').toString()" }
   * → potential RCE / data exfiltration
   */
  @Post('eval')
  async unsafeEval(@Body('script') script: string) {
    try {
      return await this.dsService.runScript(script);
    } catch {
      throw new BadRequestException('Invalid script');
    }
  }
}
