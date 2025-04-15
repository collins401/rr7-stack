import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { Logger } from "drizzle-orm/logger";
import * as schema from "./schema";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite, {
  schema,
  logger: {
    logQuery: (query, params) => {
      // console.log("---Query---", query);
      // console.log("---Params---", params);
    }
  }
});

export default db;
