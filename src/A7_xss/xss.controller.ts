// src/A7_xss/xss.controller.ts
import { Controller, Get, Query, Header } from '@nestjs/common';
import { XssService } from './xss.service';

@Controller('xss')
export class XssController {
  constructor(private readonly xssService: XssService) {}

  /**
   * 🔴 Vulnerable: reflects user input into HTML without escaping.
   * GET /xss/echo?msg=<script>alert("XSS")</script>
   */
  @Get('echo')
  @Header('Content-Type', 'text/html')
  echo(@Query('msg') msg: string) {
    return this.xssService.wrapHtml(msg);
  }
}
