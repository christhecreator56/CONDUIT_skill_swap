/// <reference types="vite/client" />
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Get database URL from environment variable
const databaseUrl = import.meta.env.VITE_DATABASE_URL || process.env.VITE_DATABASE_URL;

let db: any;

if (!databaseUrl) {
  console.warn('VITE_DATABASE_URL not found, using in-memory database for development');
  // For development, we'll use a mock database
  const mockDb = {
    select: () => ({ from: () => Promise.resolve([]) }),
    insert: () => ({ values: () => ({ returning: () => Promise.resolve([]) }) }),
    update: () => ({ set: () => ({ where: () => ({ returning: () => Promise.resolve([]) }) }) }),
    delete: () => ({ where: () => Promise.resolve() }),
  };
  db = mockDb;
} else {
  // Create the database connection
  const sql = neon(databaseUrl);
  db = drizzle(sql, { schema });
}

export { db };

// Export schema for migrations
export * from './schema'; 