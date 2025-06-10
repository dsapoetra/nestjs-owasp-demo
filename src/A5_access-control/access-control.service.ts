/* eslint-disable @typescript-eslint/require-await */
// src/A5_access-control/access-control.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccessControlService {
  async isAdmin(role: string): Promise<boolean> {
    // 🔴 Naïve check: trusts whatever the client sends for `role`
    return role === 'admin';
  }
}
