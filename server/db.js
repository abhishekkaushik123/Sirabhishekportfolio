import pg from "pg";

// A pool keeps a few database connections open and reuses them.
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});