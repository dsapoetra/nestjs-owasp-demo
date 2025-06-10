// src/A6_misconfig/misconfig.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('misconfig')
export class MisconfigController {
  /**
   * 🔴 Vulnerable: throws an unhandled error, exposing stack trace (if NODE_ENV!=='production').
   * GET /misconfig/error
   */
  @Get('error')
  throwError() {
    throw new Error('Intentional server crash for stack-trace demo');
  }

  /**
   * 🔴 Vulnerable: publicly accessible “internal” route with no auth.
   * GET /misconfig/secret
   */
  @Get('secret')
  getSecret() {
    return { superSecret: 'Never share this in production!' };
  }
}
