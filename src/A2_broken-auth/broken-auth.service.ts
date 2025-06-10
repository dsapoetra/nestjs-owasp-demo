/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/require-await */
// src/A2_broken-auth/broken-auth.service.ts
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class BrokenAuthService {
  // 🔴 Weak in‐code JWT secret (should come from .env in production!)
  private readonly JWT_SECRET = 'my-awsome-secret';
  private readonly users = [
    { username: 'alice', password: 'password123', role: 'user' },
    { username: 'bob', password: 'qwerty', role: 'admin' },
  ];

  async login(username: string, password: string): Promise<string | null> {
    const user = this.users.find(
      (u) => u.username === username && u.password === password,
    );
    if (!user) return null;
    // 🔴 No expiration ("exp") claim, no “issuer” or “audience”
    return jwt.sign(
      { username: user.username, role: user.role },
      this.JWT_SECRET,
    );
  }

  async verify(token: string): Promise<any | null> {
    try {
      // 🔴 No algorithm enforcement or expiration check
      return jwt.verify(token, this.JWT_SECRET);
    } catch {
      return null;
    }
  }
}
