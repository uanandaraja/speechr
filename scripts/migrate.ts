import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { createClient } from "@libsql/client";
import dotenv from "dotenv";

// Load environment variables from .dev.vars
dotenv.config({ path: ".dev.vars" });

async function runMigrations() {
  const databaseUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!databaseUrl || !authToken) {
    throw new Error(
      "TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is not set in .dev.vars",
    );
  }

  const client = createClient({
    url: databaseUrl,
    authToken: authToken,
  });

  const db = drizzle(client);

  console.log("Running migrations...");

  await migrate(db, { migrationsFolder: "./drizzle" });

  console.log("Migrations complete!");

  await client.close();
}

runMigrations().catch(console.error);
