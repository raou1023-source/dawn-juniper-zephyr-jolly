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

export function WatchlistSync() {
  const { user, isPending } = useCurrentUserState();
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
  const [status, setStatus] = useState("この端末に保存");
  const boot = useRef(false);
  const skip = useRef(false);
  const restored = useRef(false);

  useEffect(() => {
    if (isPending || !user) {
      boot.current = false;
      setLists([]);
      setStatus(t("savedLocal"));
      return;
    }
    let cancelled = false;
    listWatchlists()
      .then((rows) => {
        if (cancelled) return;
        setLists(rows);
        const current = useDesk.getState();
        const match =
          rows.find((r) => r.id === current.listId) ?? rows[0];
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
          setListMeta(match.id, match.name);
          setStatus(`${match.name} を同期`);
        } else {
          void persist("メイン", current.watchlist, current.selected);
        }
        boot.current = true;
      })
      .catch(() => {
        setStatus(t("savedLocal"));
      });
    return () => {
      cancelled = true;
    };
  }, [user, isPending, replaceWatchlist, setListMeta]);

  useEffect(() => {
    if (!user || !boot.current) return;
    if (skip.current) {
      skip.current = false;
      return;
    }
    const handle = window.setTimeout(() => {
      void persist(listName || "メイン", watchlist, selected, listId ?? undefined);
    }, 800);
    return () => window.clearTimeout(handle);
  }, [user, watchlist, selected, listId, listName]);

  async function persist(
    name: string,
    items: typeof watchlist,
    sel: string,
    id?: string,
  ) {
    if (!items.length) return;
    setBusy(true);
    try {
      const saved = await saveWatchlist({
        data: { id, name, items, selected: sel },
      });
      setListMeta(saved.id, name);
      const rows = await listWatchlists();
      setLists(rows);
      setStatus(t("savedCloud"));
    } catch {
      setStatus(t("saveFail"));
    } finally {
      setBusy(false);
    }
  }

  async function saveAs() {
    const name = nameDraft.trim() || `リスト ${lists.length + 1}`;
    setNameDraft("");
    await persist(name, watchlist, selected);
    toast("リストを保存しました", { description: name });
  }

  async function load(row: SavedList) {
    skip.current = true;
    replaceWatchlist(row.items, row.selected);
    setListMeta(row.id, row.name);
    setStatus(`${row.name} を表示`);
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

  if (isPending || !user) {
    return (
      <section className="border-t border-border px-3 py-3">
        <p className="text-[11px] tracking-wide text-faint uppercase">{t("save")}</p>
        <p className="mt-1 text-[11px] text-muted">{t("savedLocal")}</p>
        <p className="mt-2 text-[11px] text-faint">{t("saveHint")}</p>
      </section>
    );
  }

  return (
    <section className="border-t border-border px-3 py-3">
      <p className="text-[11px] tracking-wide text-faint uppercase">{t("save")}</p>
      <p className="mt-1 text-[11px] text-muted">{busy ? t("saving") : status}</p>
      {user ? (
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
              className="h-8 rounded-md bg-accent px-2 text-[11px] text-accent-fg"
            >
              {t("saveAs")}
            </button>
          </div>
          <ul className="mt-2 flex flex-col gap-1">
            {lists.map((row) => (
              <li key={row.id} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => void load(row)}
                  className={cn(
                    "h-8 min-w-0 flex-1 truncate rounded-md px-2 text-left text-xs",
                    row.id === listId ? "bg-accent text-accent-fg" : "bg-elevated text-muted",
                  )}
                >
                  {row.name} · {row.items.length}
                </button>
                <button
                  type="button"
                  onClick={() => void remove(row.id)}
                  className="h-8 rounded-md px-2 text-[11px] text-faint hover:text-down"
                >
                  {t("delete")}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-2 text-[11px] text-faint">{t("saveHint")}</p>
      )}
    </section>
  );
}
