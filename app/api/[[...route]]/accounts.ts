import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { createId } from "@paralleldrive/cuid2";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { accounts, insertAccountSchema } from "@/db/schema";

const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
      return c.json({ error: "Unauthorised" }, 401);
    }

    const data = await db
      .select({ id: accounts.id, name: accounts.name })
      .from(accounts)
      .where(eq(accounts.userId, auth.userId));

    return c.json({ data });
  })
  .get(
    "/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorised" }, 401);
      }

      const { id } = c.req.valid("param");
      if (!id) {
        return c.json({ error: "Bad Request - Missing Id" }, 400);
      }

      const [data] = await db
        .select({
          id: accounts.id,
          name: accounts.name,
        })
        .from(accounts)
        .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)));

      if (!data) {
        return c.json({ error: "Account Not Found" }, 404);
      }

      return c.json({ data });
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertAccountSchema.pick({ name: true })),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorised" }, 401);
      }

      const values = c.req.valid("json");

      const [data] = await db
        .insert(accounts)
        .values({
          id: createId(),
          userId: auth.userId,
          ...values,
        })
        .returning();

      return c.json({ data });
    }
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator("json", z.object({ ids: z.array(z.string()) })),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorised" }, 401);
      }

      const values = c.req.valid("json");

      const data = await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.userId, auth.userId),
            inArray(accounts.id, values.ids)
          )
        )
        .returning({
          id: accounts.id,
        });

      return c.json({ data });
    }
  )
  .patch(
    "/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator("json", insertAccountSchema.pick({ name: true })),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorised" }, 401);
      }

      const { id } = c.req.valid("param");
      if (!id) {
        return c.json({ error: "Bad Request - Missing Id" }, 400);
      }

      const values = c.req.valid("json");

      const [data] = await db
        .update(accounts)
        .set(values)
        .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))
        .returning();

      if (!data) {
        return c.json({ error: "Account Not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .delete(
    "/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorised" }, 401);
      }

      const { id } = c.req.valid("param");
      if (!id) {
        return c.json({ error: "Bad Request - Missing Id" }, 400);
      }

      const [data] = await db
        .delete(accounts)
        .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))
        .returning({
          id: accounts.id,
        });

      if (!data) {
        return c.json({ error: "Account Not found" }, 404);
      }

      return c.json({ data });
    }
  );

export default app;
