// src/A5_access-control/access-control.controller.ts
import { Controller, Get, Query, ForbiddenException } from '@nestjs/common';
import { AccessControlService } from './access-control.service';

@Controller('access-control')
export class AccessControlController {
  constructor(private readonly acService: AccessControlService) {}

  /**
   * 🔴 Vulnerable: trusts client-supplied `role` param.
   * GET /access-control/admin-data?user=alice&role=user
   * If role==='admin', returns sensitive info—no real check.
   */
  @Get('admin-data')
  async getAdminData(@Query('user') user: string, @Query('role') role: string) {
    if (await this.acService.isAdmin(role)) {
      return { secret: '42 is the answer.' };
    }
    throw new ForbiddenException('Not an admin');
  }
}
