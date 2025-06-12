/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import 'dotenv/config'; // 1) load .env into process.env
import { Pool } from 'pg';
import { readdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

async function runMigrations() {
  // 2) Create a pool from DATABASE_URL
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌  DATABASE_URL is not defined in environment.');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
    ssl:
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
  });

  try {
    // 3) Locate the migrations directory
    const migrationsDir = resolve(__dirname);
    const files = readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      console.log('⚠️  No .sql files found in', migrationsDir);
      return;
    }

    // 4) Execute each SQL file in order
    for (const file of files) {
      const filePath = join(migrationsDir, file);
      const sql = readFileSync(filePath, 'utf8');
      console.log(`⏳ Running migration ${file}...`);
      await pool.query(sql);
      console.log(`✅  Migration ${file} applied.`);
    }
    console.log('🎉 All migrations completed successfully.');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();
