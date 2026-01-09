import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

// Create NeonDB client
export const sql = databaseUrl ? neon(databaseUrl) : null;

export const isDbConfigured = !!sql;

// Helper function to execute queries safely
export async function query<T = any>(sqlQuery: string, params: any[] = []): Promise<T[]> {
  if (!sql) {
    console.warn('Database not configured. DATABASE_URL present:', !!databaseUrl);
    return [];
  }

  try {
    const result = await sql(sqlQuery, params);
    return result as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}