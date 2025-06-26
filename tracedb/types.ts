import type { drizzle } from "drizzle-orm/pglite";
import type * as schema from "./schema";

export type Schema = typeof schema;
export type Database = ReturnType<typeof drizzle<Schema>>;
