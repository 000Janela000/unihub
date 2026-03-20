import { pgTable, text, timestamp, integer, boolean, uuid, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // NextAuth user ID (Google sub)
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  groupCode: text("group_code"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const conspects = pgTable("conspects", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  description: text("description"),
  fileUrl: text("file_url").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(), // bytes
  fileType: text("file_type").notNull(), // pdf, docx, pptx, etc.
  authorId: text("author_id").notNull().references(() => users.id),
  faculty: text("faculty"), // faculty ID for filtering
  semester: integer("semester"), // 1-8
  upvotes: integer("upvotes").default(0).notNull(),
  downvotes: integer("downvotes").default(0).notNull(),
  downloads: integer("downloads").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const votes = pgTable(
  "votes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull().references(() => users.id),
    conspectId: uuid("conspect_id").notNull().references(() => conspects.id, { onDelete: "cascade" }),
    value: integer("value").notNull(), // 1 = upvote, -1 = downvote
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userConspectUnique: uniqueIndex("user_conspect_unique").on(table.userId, table.conspectId),
  })
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  conspects: many(conspects),
  votes: many(votes),
}));

export const conspectsRelations = relations(conspects, ({ one, many }) => ({
  author: one(users, { fields: [conspects.authorId], references: [users.id] }),
  votes: many(votes),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  user: one(users, { fields: [votes.userId], references: [users.id] }),
  conspect: one(conspects, { fields: [votes.conspectId], references: [conspects.id] }),
}));
