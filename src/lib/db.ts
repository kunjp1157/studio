
import { Pool } from 'pg';

let pool: Pool;

if (!pool) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

export const db = pool;
