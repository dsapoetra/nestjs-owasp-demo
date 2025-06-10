/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/A2_broken-auth/broken-auth.controller.ts
import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
  Headers,
} from '@nestjs/common';
import { BrokenAuthService } from './broken-auth.service';

@Controller('broken-auth')
export class BrokenAuthController {
  constructor(private readonly authService: BrokenAuthService) {}

  /**
   * 🔴 Vulnerable login: checks plaintext password, no hashing or salting.
   * Returns a JWT without expiration or strong secret.
   */
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const token = await this.authService.login(body.username, body.password);
    if (!token) throw new UnauthorizedException('Invalid credentials');
    return { token };
  }

  /**
   * 🔴 Vulnerable profile: trusts JWT signed with a weak secret.
   * No expiration check, no algorithm enforcement.
   */
  @Get('profile')
  async getProfile(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing token');
    }
    const token = authHeader.replace('Bearer ', '');
    const payload = await this.authService.verify(token);
    if (!payload) throw new UnauthorizedException('Invalid token');
    return { username: payload.username, role: payload.role };
  }
}
