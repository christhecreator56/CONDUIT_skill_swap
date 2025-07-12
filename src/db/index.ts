/// <reference types="vite/client" />
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Get database URL from environment variable
const databaseUrl = import.meta.env.VITE_DATABASE_URL;

if (!databaseUrl) {
  throw new Error('VITE_DATABASE_URL environment variable is required');
}

// Create the database connection
const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });

// Export schema for migrations
export * from './schema'; 