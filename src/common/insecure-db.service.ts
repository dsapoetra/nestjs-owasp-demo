/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* src/common/insecure-db.service.ts */
import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { URL } from 'url';

@Injectable()
export class InsecureDb implements OnModuleDestroy {
  private pool: Pool;
  private readonly logger = new Logger(InsecureDb.name);

  constructor(private readonly configService: ConfigService) {
    // parse DATABASE_URL
    const dbUrlString = this.configService.get<string>('databaseUrl');
    if (!dbUrlString) {
      throw new Error(
        'DATABASE_URL is not set in environment or configuration',
      );
    }
    const dbUrl = new URL(dbUrlString);
    this.pool = new Pool({
      host: dbUrl.hostname,
      port: parseInt(dbUrl.port, 10) || 5432,
      user: dbUrl.username,
      password: dbUrl.password,
      database: dbUrl.pathname.slice(1), // strip leading "/"
      ssl:
        this.configService.get<string>('nodeEnv') === 'production'
          ? { rejectUnauthorized: false }
          : false,
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
