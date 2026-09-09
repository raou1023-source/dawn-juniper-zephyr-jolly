import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { cn as _enum, gn as object, un as array, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { t as authMiddleware } from "./middleware-CsbL_reE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/watchlists-DgNC394U.js
var itemSchema = object({
	symbol: string().min(1).max(32).regex(/^[A-Za-z0-9.^%=_/-]+$/),
	name: string().min(1).max(80),
	exchange: string().max(40).optional(),
	kind: _enum([
		"jp",
		"overseas",
		"etf",
		"fund",
		"index",
		"commodity",
		"fx",
		"crypto",
		"bond"
	]).optional()
});
var listWatchlists_createServerFn_handler = createServerRpc({
	id: "e739ef90ea62487e5ca7da6ee4731232b91be35dc5585317bce4fa8741979211",
	name: "listWatchlists",
	filename: "src/lib/stocks/watchlists.ts"
}, (opts) => listWatchlists.__executeServer(opts));
var listWatchlists = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listWatchlists_createServerFn_handler, async ({ context }) => {
	const { getSql } = await import("./db-Cy8lrRvi.mjs").then((n) => n.t).then((n) => n.t);
	return (await (await getSql())`
      select id, name, items, selected, updated_at
      from watchlists
      where user_id = ${context.userId}
      order by updated_at desc
    `).map(toSaved);
});
var saveWatchlist_createServerFn_handler = createServerRpc({
	id: "e821b21ea8c6ca258aa4d70b6abaa109af638e18b1daff7b7d42ba536b7f5f1b",
	name: "saveWatchlist",
	filename: "src/lib/stocks/watchlists.ts"
}, (opts) => saveWatchlist.__executeServer(opts));
var saveWatchlist = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string().uuid().optional(),
	name: string().min(1).max(40),
	items: array(itemSchema).max(200),
	selected: string().max(32).optional()
})).handler(saveWatchlist_createServerFn_handler, async ({ context, data }) => {
	const { getSql } = await import("./db-Cy8lrRvi.mjs").then((n) => n.t).then((n) => n.t);
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
var deleteWatchlist_createServerFn_handler = createServerRpc({
	id: "cc482cc03f4b9cadf4b7c8e2860fae2bb1eca2e20cd525db1f95b95ccd8508ea",
	name: "deleteWatchlist",
	filename: "src/lib/stocks/watchlists.ts"
}, (opts) => deleteWatchlist.__executeServer(opts));
var deleteWatchlist = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string().uuid() })).handler(deleteWatchlist_createServerFn_handler, async ({ context, data }) => {
	const { getSql } = await import("./db-Cy8lrRvi.mjs").then((n) => n.t).then((n) => n.t);
	await (await getSql())`delete from watchlists where id = ${data.id} and user_id = ${context.userId}`;
	return { ok: true };
});
function toSaved(row) {
	let items = [];
	try {
		const parsed = JSON.parse(row.items);
		const checked = array(itemSchema).max(200).safeParse(parsed);
		if (checked.success) items = checked.data;
	} catch {
		items = [];
	}
	return {
		id: row.id,
		name: row.name,
		items,
		selected: row.selected ?? items[0]?.symbol ?? "",
		updatedAt: row.updated_at
	};
}
//#endregion
export { deleteWatchlist_createServerFn_handler, listWatchlists_createServerFn_handler, saveWatchlist_createServerFn_handler };
