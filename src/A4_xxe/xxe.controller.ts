/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
// src/A4_xxe/xxe.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { XxeService } from './xxe.service';

@Controller('xxe')
export class XxeController {
  constructor(private readonly xxeService: XxeService) {}

  /**
   * 🔴 Vulnerable: parses XML without disabling external entity resolution.
   *
   * POST /xxe/parse
   * Body: { "xml": "<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><foo>&xxe;</foo>" }
   */
  @Post('parse')
  async parseXml(@Body('xml') xml: string) {
    return this.xxeService.parse(xml);
  }
}
