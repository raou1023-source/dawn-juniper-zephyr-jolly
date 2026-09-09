import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import type { WatchItem } from "./types";

export type SavedList = {
  id: string;
  name: string;
  items: WatchItem[];
  selected: string;
  updatedAt: string;
};

const itemSchema = z.object({
  symbol: z.string().min(1).max(32).regex(/^[A-Za-z0-9.^%=_/-]+$/),
  name: z.string().min(1).max(80),
  exchange: z.string().max(40).optional(),
  kind: z.enum(["jp", "overseas", "etf", "fund", "index", "commodity", "fx", "crypto", "bond"]).optional(),
});

export const listWatchlists = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      name: string;
      items: string;
      selected: string | null;
      updated_at: string;
    }>`
      select id, name, items, selected, updated_at
      from watchlists
      where user_id = ${context.userId}
      order by updated_at desc
    `;
    return rows.map(toSaved);
  });

export const saveWatchlist = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.string().uuid().optional(),
      name: z.string().min(1).max(40),
      items: z.array(itemSchema).max(200),
      selected: z.string().max(32).regex(/^[A-Za-z0-9.^%=_/-]*$/).optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const id = data.id ?? crypto.randomUUID();
    const payload = JSON.stringify(data.items);
    const selected = data.selected ?? data.items[0]?.symbol ?? "";
    await sql`
      insert into watchlists (id, user_id, name, items, selected, updated_at)
      values (${id}, ${context.userId}, ${data.name}, ${payload}, ${selected}, now())
      on conflict (id) do update
        set name = excluded.name,
            items = excluded.items,
            selected = excluded.selected,
            updated_at = now()
        where watchlists.user_id = ${context.userId}
    `;
    return { id };
  });

export const deleteWatchlist = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ context, data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql`delete from watchlists where id = ${data.id} and user_id = ${context.userId}`;
    return { ok: true };
  });

function toSaved(row: {
  id: string;
  name: string;
  items: string;
  selected: string | null;
  updated_at: string;
}): SavedList {
  let items: WatchItem[] = [];
  try {
    const parsed = JSON.parse(row.items);
    const checked = z.array(itemSchema).max(200).safeParse(parsed);
    if (checked.success) items = checked.data;
  } catch {
    items = [];
  }
  return {
    id: row.id,
    name: row.name,
    items,
    selected: row.selected ?? items[0]?.symbol ?? "",
    updatedAt: row.updated_at,
  };
}
