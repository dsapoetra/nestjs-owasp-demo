// src/migrations/run-migrations.ts

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { createPool, Pool } from 'mysql2/promise';
import * as dotenv from 'dotenv';

// 1. Load environment variables from .env
dotenv.config();

async function run() {
  // 2. Read MySQL connection info from process.env
  const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } =
    process.env;

  if (!MYSQL_HOST || !MYSQL_PORT || !MYSQL_USER || !MYSQL_DATABASE) {
    console.error('❌ Missing required MYSQL_* environment variables.');
    process.exit(1);
  }

  // 3. Create a connection pool
  const pool: Pool = createPool({
    host: MYSQL_HOST,
    port: parseInt(MYSQL_PORT, 10),
    user: MYSQL_USER,
    password: MYSQL_PASSWORD || undefined,
    database: MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    multipleStatements: true, // allows multiple statements per query
  });

  try {
    console.log('🔄 Running migrations...');

    // 4. Locate the migrations directory
    const migrationsDir = join(__dirname, '../../migrations');
    const files = readdirSync(migrationsDir)
      .filter((fn) => fn.endsWith('.sql'))
      .sort(); // ensure ascending lex order: 001-..., 002-...

    for (const file of files) {
      const filePath = join(migrationsDir, file);
      console.log(`→ Applying ${file}...`);

      // 5. Read the SQL file’s contents
      const sql = readFileSync(filePath, 'utf-8');

      // 6. Execute the SQL (multipleStatements: true allows all commands in one go)
      await pool.query(sql);

      console.log(`✅ ${file} applied.`);
    }

    console.log('🎉 All migrations applied successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
