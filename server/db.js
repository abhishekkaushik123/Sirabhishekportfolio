import pg from "pg";

// A pool keeps a few database connections open and reuses them.
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Neon closes idle connections while it sleeps. Without this, that would crash the server.
pool.on("error", (error) => {
  console.error("Database connection dropped:", error.message);
});