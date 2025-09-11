import mysql from 'mysql2/promise';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in the .env file. Please provide a valid MySQL connection string for XAMPP.');
}

// Create a connection pool for MySQL. This is more efficient than creating a new
// connection for every query.
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// The query function is a simple wrapper around the pool's query method.
// This allows us to easily execute queries from anywhere in our application.
export const query = (text: string, params?: any[]) => pool.query(text, params);
