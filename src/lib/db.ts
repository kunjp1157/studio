import { Pool } from 'pg';

// This creates a single, shared pool of database connections.
// The pool is configured using environment variables.
// `next dev` will automatically load variables from `.env`.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// The query function is a simple wrapper around the pool's query method.
// This allows us to easily execute queries from anywhere in our application.
export const query = (text: string, params?: any[]) => pool.query(text, params);
