import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  deleteWatchlist,
  listWatchlists,
  saveWatchlist,
  type SavedList,
} from "@/lib/stocks/watchlists";
import { useT } from "@/lib/use-t";
import { useDesk } from "@/stores/desk";
import { cn } from "@/lib/utils";

function snapshot(
  name: string,
  items: { symbol: string; name: string }[],
  selected: string,
) {
  return JSON.stringify({
    name,
    selected,
    items: items.map((w) => `${w.symbol}:${w.name}`),
  });
}

export function WatchlistSync() {
  const { user, isPending } = useCurrentUserState();
  const userId = user?.id ?? "";
  const watchlist = useDesk((s) => s.watchlist);
  const selected = useDesk((s) => s.selected);
  const listId = useDesk((s) => s.listId);
  const listName = useDesk((s) => s.listName ?? "メイン");
  const replaceWatchlist = useDesk((s) => s.replaceWatchlist);
  const setListMeta = useDesk((s) => s.setListMeta);
  const t = useT();
  const [lists, setLists] = useState<SavedList[]>([]);
  const [nameDraft, setNameDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const boot = useRef(false);
  const skip = useRef(false);
  const restored = useRef(false);
  const last = useRef("");

  useEffect(() => {
    if (isPending || !userId) {
      boot.current = false;
      setLists([]);
      setStatus((s) => (s === t("savedLocal") ? s : t("savedLocal")));
      return;
    }
    let cancelled = false;
    listWatchlists()
      .then((rows) => {
        if (cancelled) return;
        setLists(rows);
        const current = useDesk.getState();
        const match = rows.find((r) => r.id === current.listId) ?? rows[0];
        if (match) {
          skip.current = true;
          if (!restored.current) {
            restored.current = true;
            const keep =
              current.selected && match.items.some((w) => w.symbol === current.selected)
                ? current.selected
                : match.selected;
            replaceWatchlist(match.items, keep);
          }
          if (current.listId !== match.id || current.listName !== match.name) {
            setListMeta(match.id, match.name);
          }
          last.current = snapshot(match.name, match.items, match.selected);
          setStatus(t("savedCloud"));
        }
        boot.current = true;
      })
      .catch(() => {
        setStatus(t("savedLocal"));
      });
    return () => {
      cancelled = true;
    };
  }, [userId, isPending, replaceWatchlist, setListMeta, t]);

  useEffect(() => {
    if (!userId || !boot.current) return;
    if (skip.current) {
      skip.current = false;
      return;
    }
    const stamp = snapshot(listName || "メイン", watchlist, selected);
    if (stamp === last.current) return;
    const handle = window.setTimeout(() => {
      void persist(listName || "メイン", watchlist, selected, listId ?? undefined, true);
    }, 2500);
    return () => window.clearTimeout(handle);
  }, [userId, watchlist, selected, listId, listName]);

  async function persist(
    name: string,
    items: typeof watchlist,
    sel: string,
    id?: string,
    silent = false,
  ) {
    if (!items.length) return;
    const stamp = snapshot(name, items, sel);
    if (silent && stamp === last.current) return;
    if (!silent) setBusy(true);
    try {
      const saved = await saveWatchlist({
        data: { id, name, items, selected: sel },
      });
      last.current = stamp;
      const current = useDesk.getState();
      if (current.listId !== saved.id || current.listName !== name) {
        skip.current = true;
        setListMeta(saved.id, name);
      }
      const rows = await listWatchlists();
      setLists(rows);
      setStatus(t("savedCloud"));
    } catch {
      setStatus(t("saveFail"));
    } finally {
      if (!silent) setBusy(false);
    }
  }

  async function saveAs() {
    const name = nameDraft.trim() || `リスト ${lists.length + 1}`;
    setNameDraft("");
    last.current = "";
    await persist(name, watchlist, selected, undefined, false);
    toast("リストを保存しました", { description: name });
  }

  async function load(row: SavedList) {
    skip.current = true;
    last.current = snapshot(row.name, row.items, row.selected);
    replaceWatchlist(row.items, row.selected);
    setListMeta(row.id, row.name);
    setStatus(t("savedCloud"));
  }

  async function remove(id: string) {
    setBusy(true);
    try {
      await deleteWatchlist({ data: { id } });
      const rows = await listWatchlists();
      setLists(rows);
      if (listId === id) {
        const next = rows[0];
        if (next) await load(next);
        else setListMeta(null, "メイン");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="shrink-0 border-b border-border px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] text-muted">{busy ? t("saving") : status || t("savedLocal")}</p>
        <p className="text-[10px] text-faint">{t("save")}</p>
      </div>
      {userId ? (
        <>
          <div className="mt-2 flex gap-1">
            <input
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              placeholder={t("newName")}
              className="h-8 min-w-0 flex-1 rounded-md border border-border bg-bg px-2 text-xs text-fg outline-none"
            />
            <button
              type="button"
              onClick={() => void saveAs()}
              className="h-8 shrink-0 rounded-md bg-accent px-2 text-[11px] text-accent-fg"
            >
              {t("saveAs")}
            </button>
          </div>
          {lists.length > 0 ? (
            <ul className="mt-2 flex max-h-20 flex-col gap-1 overflow-y-auto">
              {lists.map((row) => (
                <li key={row.id} className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => void load(row)}
                    className={cn(
                      "h-7 min-w-0 flex-1 truncate rounded-md px-2 text-left text-xs",
                      row.id === listId ? "bg-accent text-accent-fg" : "bg-elevated text-muted",
                    )}
                  >
                    {row.name} · {row.items.length}
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(row.id)}
                    className="h-7 rounded-md px-2 text-[11px] text-faint hover:text-down"
                  >
                    {t("delete")}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : (
        <p className="mt-1 text-[11px] text-faint">{t("saveHint")}</p>
      )}
    </section>
  );
}
