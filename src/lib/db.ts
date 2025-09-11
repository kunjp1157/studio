
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in the .env file. Please provide a valid PostgreSQL connection string.');
}

// This creates a single, shared pool of database connections.
// The pool is configured using the DATABASE_URL environment variable.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// The query function is a simple wrapper around the pool's query method.
// This allows us to easily execute queries from anywhere in our application.
export const query = (text: string, params?: any[]) => pool.query(text, params);
