import { pgTable, serial, text, timestamp, uniqueIndex, integer, json, index, foreignKey, boolean } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    name: text("name"),
    clerkId: text("clerk_id"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (users) => ({
    emailIndex: uniqueIndex("users_email_idx").on(users.email),
    clerkIdIndex: uniqueIndex("users_clerk_id_idx").on(users.clerkId),
  }),
)

export const shortenedLinks = pgTable(
  "shortened_links",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    shortCode: text("short_code").notNull(),
    originalUrl: text("original_url").notNull(),
    title: text("title"),
    description: text("description"),
    metadata: json("metadata"),
    qrCode: text("qr_code"),
    clicks: integer("clicks").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (shortenedLinks) => ({
    shortCodeIndex: uniqueIndex("shortened_links_short_code_idx").on(shortenedLinks.shortCode),
    userIdIndex: index("shortened_links_user_id_idx").on(shortenedLinks.userId),
    userFk: foreignKey({
      columns: [shortenedLinks.userId],
      foreignColumns: [users.id],
      name: "shortened_links_user_id_fk",
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  }),
)

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  shortenedLinks: many(shortenedLinks),
}))

export const shortenedLinksRelations = relations(shortenedLinks, ({ one }) => ({
  user: one(users, {
    fields: [shortenedLinks.userId],
    references: [users.id],
  }),
}))
