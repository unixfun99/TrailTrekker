import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to configure your database?",
  );
}

// Validate MySQL connection string
if (!process.env.DATABASE_URL.startsWith('mysql://')) {
  throw new Error('DATABASE_URL must start with mysql:// - This application requires MySQL/MariaDB');
}

// Create MySQL database connection
const pool = mysql.createPool(process.env.DATABASE_URL);
export const db = drizzle(pool, { schema, mode: 'default' });
