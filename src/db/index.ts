import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "./schema.ts";
import fs from "fs";

export const createPool = () => {
  let host = process.env.SQL_HOST;
  const isProduction = process.env.NODE_ENV === "production";

  if (host && host.startsWith("/cloudsql")) {
    const alt = host.replace("/cloudsql", "/app/cloudsql");
    try {
      const hostSocket = `${host}/.s.PGSQL.5432`;
      const altSocket = `${alt}/.s.PGSQL.5432`;
      if (!fs.existsSync(hostSocket) && fs.existsSync(altSocket)) {
        host = alt;
      }
    } catch (e) {
      console.warn("Error checking cloudsql directories:", e);
    }
  }

  const user = process.env.SQL_USER || process.env.SQL_ADMIN_USER;
  const password = process.env.SQL_USER ? process.env.SQL_PASSWORD : process.env.SQL_ADMIN_PASSWORD;

  console.log(`[DB] Initializing pool for ${process.env.SQL_DB_NAME} at host: ${host}`);

  return new Pool({
    host,
    user,
    password,
    database: process.env.SQL_DB_NAME,
    max: 10,
    idleTimeoutMillis: 30000, 
    connectionTimeoutMillis: 10000,
    keepAlive: true,
  });
};

const pool = createPool();

pool.on("error", (err) => {
  console.error("Unexpected error on idle SQL pool client:", err);
});

export const db = drizzle(pool, { schema });
