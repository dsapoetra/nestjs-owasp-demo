/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/common/insecure-db.service.ts
import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class InsecureDb implements OnModuleDestroy {
  private pool: Pool;
  private readonly logger = new Logger(InsecureDb.name);

  constructor(private readonly configService: ConfigService) {
    // Read the full connection string
    const connectionString = this.configService.get<string>('DATABASE_URL');
    if (!connectionString) {
      throw new Error('DATABASE_URL must be set');
    }

    this.pool = new Pool({
      connectionString,
      // ALWAYS use SSL on Heroku; rejectUnauthorized:false permits self-signed cert
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
    });
  }

  async queryRaw(sql: string): Promise<any> {
    this.logger.debug(`Executing raw SQL: ${sql}`);
    const { rows } = await this.pool.query(sql);
    return rows;
  }

  async queryParam(sql: string, params: any[] = []): Promise<any> {
    this.logger.debug(
      `Executing param SQL: ${sql} -- ${JSON.stringify(params)}`,
    );
    const { rows } = await this.pool.query(sql, params);
    return rows;
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
