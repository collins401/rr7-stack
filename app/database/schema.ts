import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const user = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()), // 改为 cuid,
  username: text("username").notNull(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  avatar: text("avatar"),
  provider: text("provider"),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull()
});

export const todo = sqliteTable(
  "todo",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    userId: text("userId")
      .references(() => user.id)
      .notNull(),
    completed: integer("completed").notNull().default(0),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull()
  },
  todo => [index("todo_userId_idx").on(todo.userId)]
);
// 添加 todo 表的关系定义
export const todoRelations = relations(todo, ({ one }) => ({
  user: one(user, {
    fields: [todo.userId],
    references: [user.id]
  })
}));

export const visitorStats = sqliteTable(
  "visitor_stats",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    ip: text("ip").notNull().unique(),
    visitCount: integer("visit_count").notNull().default(1),
    firstVisit: integer("first_visit", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    lastVisit: integer("last_visit", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull()
  },
  visitorStats => [index("visitor_stats_ip_idx").on(visitorStats.ip)]
);
