import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to configure your database?",
  );
}

// Create Neon HTTP connection for PostgreSQL
const sql = neon(process.env.DATABASE_URL);

// Create drizzle instance with Neon PostgreSQL
export const db = drizzle(sql, { schema });
