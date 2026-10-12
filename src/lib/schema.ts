import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  client: text("client"),
  location: text("location"),
  duration: text("duration"),
  services: text("services"),
  overview: text("overview"), // texto plano; párrafos separados por "\n\n"
  thumbnail: text("thumbnail"), // path to thumbnail image
  status: text("status").default("draft").notNull(), // 'draft' | 'published'
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP").notNull(),
});

export const projectImages = sqliteTable("project_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  src: text("src").notNull(),
  alt: text("alt"),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export type NewProject = typeof projects.$inferInsert;
