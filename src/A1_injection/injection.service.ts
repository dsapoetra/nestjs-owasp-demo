// src/A1_injection/injection.service.ts
import { Injectable } from '@nestjs/common';
import { InsecureDb } from '../common/insecure-db.service';

@Injectable()
export class InjectionService {
  constructor(private readonly db: InsecureDb) {}

  async findByUsername(username: string): Promise<any> {
    // 🔴 Vulnerable: raw SQL with string interpolation
    const sql = `SELECT * FROM users WHERE username = '${username}';`;
    return this.db.queryRaw(sql);
  }
}
