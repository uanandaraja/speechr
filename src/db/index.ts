import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client/web";
import { Env } from "../env";
import * as schema from "./schema";

export { schema };

export function getDbClient(env: Env) {
  const turso = createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });
  return drizzle(turso, { schema });
}