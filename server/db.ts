import { drizzle as drizzlePg } from 'drizzle-orm/neon-http';
import { drizzle as drizzleMysql } from 'drizzle-orm/mysql2';
import { neon } from '@neondatabase/serverless';
import mysql from 'mysql2/promise';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to configure your database?",
  );
}

// Detect database type from URL
const isPostgres = process.env.DATABASE_URL.startsWith('postgres://') || process.env.DATABASE_URL.startsWith('postgresql://');
const isMysql = process.env.DATABASE_URL.startsWith('mysql://');

if (!isPostgres && !isMysql) {
  throw new Error('DATABASE_URL must start with postgres://, postgresql://, or mysql://');
}

// Create appropriate database connection
export const db = isPostgres 
  ? drizzlePg(neon(process.env.DATABASE_URL), { schema })
  : drizzleMysql(mysql.createPool(process.env.DATABASE_URL), { schema, mode: 'default' });
