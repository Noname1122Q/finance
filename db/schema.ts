import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountAggregatorId: text("accountAggregatorId"),
  name: text("name").notNull(),
  userId: text("userId").notNull(),
});
export const accountsRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactions),
}));
export const insertAccountSchema = createInsertSchema(accounts);

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("userId").notNull(),
});
export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));
export const insertCategorySchema = createInsertSchema(categories);

export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  payee: text("payee").notNull(),
  notes: text("notes"),
  amount: integer("amount").notNull(),
  date: timestamp("date", { mode: "date" }).notNull(),
  accountId: text("accountId")
    .references(() => accounts.id, { onDelete: "cascade" })
    .notNull(),
  categoryId: text("categoryId").references(() => categories.id, {
    onDelete: "set null",
  }),
});
export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));
export const insertTransactionSchema = createInsertSchema(transactions, {
  date: z.coerce.date(),
});
