/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/common/insecure-db.service.ts
import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { createPool, Pool, PoolOptions } from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InsecureDb implements OnModuleDestroy {
  private pool: Pool;
  private readonly logger = new Logger(InsecureDb.name);

  constructor(private readonly configService: ConfigService) {
    const mysqlConfig = this.configService.get('mysql');
    const poolOptions: PoolOptions = {
      host: mysqlConfig.host,
      port: mysqlConfig.port,
      user: mysqlConfig.user,
      password: mysqlConfig.password,
      database: mysqlConfig.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };
    this.pool = createPool(poolOptions);
  }

  /**
   * 🔴 Vulnerable: Executes raw SQL (string interpolation).
   *    Use ONLY for A1_Injection vulnerable demo.
   */
  async queryRaw(sql: string): Promise<any> {
    this.logger.debug(`Executing raw SQL: ${sql}`);
    const [rows] = await this.pool.query(sql);
    return rows;
  }

  /**
   * ✅ Secure: Parameterized queries to prevent injection
   *    Use for all “secure” variants.
   */
  async queryParam(sql: string, params: any[] = []): Promise<any> {
    this.logger.debug(
      `Executing param SQL: ${sql} -- ${JSON.stringify(params)}`,
    );
    const [rows] = await this.pool.execute(sql, params);
    return rows;
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
