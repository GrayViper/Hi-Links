import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

// Using the standard pg driver over TCP instead of @neondatabase/serverless HTTP.
// The dns-patch.js loaded via --require patches dns.lookup so pg's TCP connections
// resolve .neon.tech correctly even on networks with local DNS blocks.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
});

export const db = drizzle(pool);
