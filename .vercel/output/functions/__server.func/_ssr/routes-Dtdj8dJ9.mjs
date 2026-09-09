import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { n as safeHttpUrl, r as safeSymbol } from "./safe-BMATx3RK.mjs";
import { cn as _enum, gn as object, un as array, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { i as signOut, t as authClient } from "./client-CVqXY6bk.mjs";
import { a as hasGateSessionMarker } from "./server-C5GEOtV8.mjs";
import { n as classify, o as normalizeSymbol, r as isCodeName, s as prettyName } from "./catalog-V-Nx7IgK.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as isIntraday, c as translate, d as useT, i as cn, l as useDesk, n as LanguageSwitch, o as kindKey, r as PERIODS, s as periodKey, t as LOCALE_BCP, u as useLocale } from "./language-switch-BLK4ogdS.mjs";
import { t as isBigMoveNews } from "./news-o1u9YgPd.mjs";
import { a as Plus, c as Bell, i as RotateCcw, n as Trash2, o as Download, r as Search, s as ChevronDown } from "../_libs/lucide-react.mjs";
import { i as keepPreviousData } from "../_libs/tanstack__query-core.mjs";
import { t as authMiddleware } from "./middleware-CsbL_reE.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { t as Ve } from "../_libs/lightweight-charts.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Dtdj8dJ9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var RANGE = _enum([
	"1d",
	"5d",
	"1mo",
	"3mo",
	"6mo",
	"1y",
	"5y",
	"max"
]);
var INTERVAL = _enum([
	"1m",
	"5m",
	"15m",
	"1d",
	"1wk",
	"1mo"
]);
var getChart = createServerFn({ method: "GET" }).validator(object({
	symbol: string().min(1).max(32).regex(/^[A-Za-z0-9.^%=_/-]+$/),
	range: RANGE,
	interval: INTERVAL
})).handler(createSsrRpc("8a39ad0927f9f32f6df01b399d78c677c818cf89d228207b9786a5856492cee8"));
var searchSymbols = createServerFn({ method: "GET" }).validator(object({ q: string().max(48) })).handler(createSsrRpc("9c82990dab2849d74dad22bf16fad01dc184d7d546cf39559e0fed03baf07304"));
var getQuotes = createServerFn({ method: "GET" }).validator(object({ symbols: string().max(800) })).handler(createSsrRpc("14c19c7f2d3dae54f052cf6027cd45dd86f7beff1e5122644fc484e1673cf4ce"));
var getNews = createServerFn({ method: "GET" }).validator(object({
	symbol: string().max(32).regex(/^[A-Za-z0-9.^%=_/-]+$/).optional(),
	locale: _enum([
		"ja",
		"en",
		"zh",
		"ko"
	]).optional()
})).handler(createSsrRpc("0d90211aed90cb465a40e7120eb2e41c2a6b2bdb209cb691fee7a5211e526a69"));
var getFundamentals = createServerFn({ method: "GET" }).validator(object({ symbol: string().min(1).max(32).regex(/^[A-Za-z0-9.^%=_/-]+$/) })).handler(createSsrRpc("efe8593ebb2a40d1d139cc4f78a4a98df07e480f2b2846cd6e44bceee7710270"));
var ZERO_DEC = /* @__PURE__ */ new Set(["JPY", "KRW"]);
var YIELD = /^\^(TNX|TYX|FVX|IRX)$/i;
function formatPrice(n, currency, symbol = "", locale = "ja") {
	const tag = LOCALE_BCP[locale];
	if (YIELD.test(symbol)) return `${n.toLocaleString(tag, {
		minimumFractionDigits: 3,
		maximumFractionDigits: 3
	})}%`;
	if (symbol.endsWith("=X")) {
		const digits = symbol.includes("JPY") ? 3 : 5;
		return n.toLocaleString(tag, {
			minimumFractionDigits: digits,
			maximumFractionDigits: digits
		});
	}
	if (/-(USD|JPY|EUR)$/.test(symbol) && n >= 1e3) return n.toLocaleString(tag, {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	});
	const digits = ZERO_DEC.has(currency) ? 0 : 2;
	return n.toLocaleString(tag, {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits
	});
}
function currencySuffix(currency, symbol = "", locale = "ja") {
	if (YIELD.test(symbol)) return "";
	if (symbol.endsWith("=X") && symbol.includes("JPY")) return locale === "ja" ? "円" : "";
	if (currency === "JPY") return locale === "ja" ? "円" : "";
	if (symbol.endsWith("=F")) return currency === "USD" ? "USD" : currency || "USD";
	return currency || "";
}
function revealChart() {
	const node = document.getElementById("kabu-chart");
	if (!node) return;
	node.scrollIntoView({
		behavior: "smooth",
		block: "start"
	});
}
function PwaBoot() {
	(0, import_react.useEffect)(() => {
		if (!("serviceWorker" in navigator)) return;
		if (!window.isSecureContext) return;
		navigator.serviceWorker.register("/sw.js");
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PwaInstallButton, {});
}
function PwaInstallButton() {
	const t = useT();
	const [prompt, setPrompt] = (0, import_react.useState)(null);
	const [installed, setInstalled] = (0, import_react.useState)(false);
	const [ios, setIos] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (window.matchMedia("(display-mode: standalone)").matches || "standalone" in navigator && Boolean(navigator.standalone)) {
			setInstalled(true);
			return;
		}
		const ua = navigator.userAgent;
		setIos(/iPhone|iPad|iPod/i.test(ua) && !/CriOS|FxiOS/i.test(ua));
		const onPrompt = (event) => {
			event.preventDefault();
			setPrompt(event);
		};
		const onInstalled = () => {
			setInstalled(true);
			setPrompt(null);
		};
		window.addEventListener("beforeinstallprompt", onPrompt);
		window.addEventListener("appinstalled", onInstalled);
		return () => {
			window.removeEventListener("beforeinstallprompt", onPrompt);
			window.removeEventListener("appinstalled", onInstalled);
		};
	}, []);
	if (installed) return null;
	async function install() {
		if (!prompt) return;
		await prompt.prompt();
		if ((await prompt.userChoice).outcome === "accepted") setInstalled(true);
		setPrompt(null);
	}
	if (!prompt && !ios) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => {
			if (prompt) install();
			else window.alert(t("iosInstall"));
		},
		className: cn("inline-flex h-8 items-center gap-1 rounded-md bg-elevated px-2 text-xs text-muted hover:text-fg"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), t("install")]
	});
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/** Render children only when a user is present (real session, or the disabled-auth dev user). */
function SignedIn({ children }) {
	const { user } = useCurrentUserState();
	return user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children }) : null;
}
/**
* Render children only once we KNOW the visitor is signed out (`isPending` has
* cleared and there is no user). Hidden while the session is still loading.
*/
function SignedOut({ children }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending || user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
function AccountMenu() {
	const { isPending } = useCurrentUserState();
	const t = useT();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-16 rounded-md bg-elevated" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/login",
		className: "inline-flex h-8 items-center rounded-md bg-elevated px-2.5 text-xs text-muted hover:text-fg",
		children: t("login")
	}) })] });
}
function AlertWatcher({ quotes, news }) {
	const watchlist = useDesk((s) => s.watchlist);
	const notifyEnabled = useDesk((s) => s.notifyEnabled ?? true);
	const notifyThreshold = useDesk((s) => s.notifyThreshold ?? 5);
	const browserNotify = useDesk((s) => s.browserNotify ?? false);
	const pushAlert = useDesk((s) => s.pushAlert);
	const seen = (0, import_react.useRef)(new Set(useDesk.getState().alerts?.map((a) => a.id) ?? []));
	(0, import_react.useEffect)(() => {
		if (!notifyEnabled) return;
		for (const item of watchlist) {
			const quote = quotes.get(item.symbol.toUpperCase());
			if (!quote) continue;
			if (Math.abs(quote.changePercent) < notifyThreshold) continue;
			const id = `move:${item.symbol}:${(/* @__PURE__ */ new Date()).toISOString().slice(0, 13)}`;
			if (seen.current.has(id)) continue;
			seen.current.add(id);
			const locale = useDesk.getState().locale ?? "ja";
			const dirKey = quote.changePercent >= 0 ? "moveUp" : "moveDown";
			const title = translate(locale, dirKey, { s: item.symbol });
			const body = translate(locale, "moveBody", {
				name: item.name,
				pct: `${quote.changePercent >= 0 ? "+" : ""}${quote.changePercent.toFixed(2)}`,
				n: notifyThreshold
			});
			pushAlert({
				id,
				kind: "move",
				title,
				body,
				symbol: item.symbol,
				at: Date.now()
			});
			toast(title, { description: body });
			notifyBrowser(browserNotify, title, body);
		}
	}, [
		quotes,
		watchlist,
		notifyEnabled,
		notifyThreshold,
		browserNotify,
		pushAlert
	]);
	(0, import_react.useEffect)(() => {
		if (!notifyEnabled) return;
		const symbols = new Set(watchlist.map((w) => w.symbol.toUpperCase()));
		const names = watchlist.map((w) => w.name);
		for (const item of news) {
			if (!isBigMoveNews(item)) continue;
			if (!(item.symbols.some((s) => symbols.has(s.toUpperCase())) || names.some((n) => item.title.includes(n))) && item.symbols.length) continue;
			const id = `news:${item.id}`;
			if (seen.current.has(id)) continue;
			seen.current.add(id);
			const locale = useDesk.getState().locale ?? "ja";
			const title = translate(locale, item.impact === "up" ? "newsUp" : "newsDown");
			pushAlert({
				id,
				kind: "news",
				title,
				body: item.title,
				symbol: item.symbols[0],
				at: item.publishedAt
			});
			toast(title, { description: item.title });
			notifyBrowser(browserNotify, title, item.title);
		}
	}, [
		news,
		watchlist,
		notifyEnabled,
		browserNotify,
		pushAlert
	]);
	return null;
}
function notifyBrowser(enabled, title, body) {
	if (!enabled || typeof Notification === "undefined") return;
	if (Notification.permission !== "granted") return;
	try {
		new Notification(title, { body });
	} catch {}
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-accent/90",
			ghost: "bg-transparent text-fg hover:bg-elevated",
			outline: "border border-border bg-transparent text-fg hover:bg-elevated",
			subtle: "bg-elevated text-fg hover:bg-subtle",
			danger: "bg-down/15 text-down hover:bg-down/25"
		},
		size: {
			default: "h-10 px-3.5 text-sm",
			sm: "h-8 px-2.5 text-xs",
			lg: "h-11 px-4 text-sm",
			icon: "size-10",
			"icon-sm": "size-8"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
var THRESHOLDS = [
	3,
	5,
	8
];
function AlertsMenu() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const alerts = useDesk((s) => s.alerts ?? []);
	const unread = alerts.filter((a) => !a.read).length;
	const notifyEnabled = useDesk((s) => s.notifyEnabled ?? true);
	const notifyThreshold = useDesk((s) => s.notifyThreshold ?? 5);
	const browserNotify = useDesk((s) => s.browserNotify ?? false);
	const setNotifyEnabled = useDesk((s) => s.setNotifyEnabled);
	const setNotifyThreshold = useDesk((s) => s.setNotifyThreshold);
	const setBrowserNotify = useDesk((s) => s.setBrowserNotify);
	const markAlertsRead = useDesk((s) => s.markAlertsRead);
	const t = useT();
	async function enableBrowser() {
		if (typeof Notification === "undefined") return;
		const perm = await Notification.requestPermission();
		setBrowserNotify(perm === "granted");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "sm",
			variant: open ? "default" : "subtle",
			onClick: () => {
				setOpen((v) => !v);
				if (!open) markAlertsRead();
			},
			"aria-label": t("notify"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-3.5" }),
				t("notify"),
				unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-0.5 inline-flex min-w-4 justify-center rounded-full bg-down px-1 text-[10px] text-fg",
					children: unread
				}) : null
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute top-10 right-0 z-30 w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-border bg-surface p-3 shadow-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-fg",
						children: t("notifyTitle")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setNotifyEnabled(!notifyEnabled),
						className: cn("h-7 rounded-md px-2 text-[11px]", notifyEnabled ? "bg-accent text-accent-fg" : "bg-elevated text-muted"),
						children: notifyEnabled ? "ON" : "OFF"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 flex gap-1",
					children: THRESHOLDS.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setNotifyThreshold(n),
						className: cn("h-7 flex-1 rounded-md text-[11px]", notifyThreshold === n ? "bg-accent text-accent-fg" : "bg-elevated text-muted"),
						children: t("notifyPct", { n })
					}, n))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => void enableBrowser(),
					className: "mb-3 h-8 w-full rounded-md bg-elevated text-xs text-muted hover:text-fg",
					children: browserNotify ? t("browserOn") : t("browserOff")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "max-h-64 overflow-y-auto",
					children: alerts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "px-1 py-4 text-center text-xs text-muted",
						children: t("noAlerts")
					}) : alerts.slice(0, 12).map((alert) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-t border-border py-2 first:border-t-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-fg",
							children: alert.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-[11px] text-muted",
							children: alert.body
						})]
					}, alert.id))
				})
			]
		}) : null]
	});
}
var KINDS = [
	{
		key: "candle",
		label: "candle"
	},
	{
		key: "bar",
		label: "bar"
	},
	{
		key: "line",
		label: "line"
	},
	{
		key: "area",
		label: "area"
	}
];
var TOGGLES = [
	{
		key: "showGrid",
		label: "grid"
	},
	{
		key: "showVolume",
		label: "volume"
	},
	{
		key: "showCrosshair",
		label: "crosshair"
	},
	{
		key: "showLastPrice",
		label: "lastPrice"
	},
	{
		key: "logScale",
		label: "log"
	},
	{
		key: "sma20",
		label: "sma20"
	},
	{
		key: "sma50",
		label: "sma50"
	},
	{
		key: "sma200",
		label: "sma200"
	},
	{
		key: "ema12",
		label: "ema12"
	},
	{
		key: "ema26",
		label: "ema26"
	},
	{
		key: "bollinger",
		label: "bollinger"
	}
];
function CustomizePanel() {
	const settings = useDesk((s) => s.settings);
	const patch = useDesk((s) => s.patchSettings);
	const reset = useDesk((s) => s.resetSettings);
	const [open, setOpen] = (0, import_react.useState)(false);
	const t = useT();
	const kind = t(KINDS.find((k) => k.key === settings.kind)?.label ?? "candle");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "border-b border-border bg-surface px-4 py-2 md:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setOpen((v) => !v),
				className: "inline-flex items-center gap-1 text-xs tracking-wide text-muted hover:text-fg",
				children: [
					t("custom"),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-faint",
						children: ["· ", kind]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-3.5 transition-transform", open && "rotate-180") })
				]
			}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: reset,
				className: "inline-flex h-7 items-center gap-1 rounded-md px-2 text-[11px] text-muted hover:text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3" }), t("reset")]
			}) : null]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 flex flex-wrap items-center gap-1.5",
			children: [
				KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => patch({ kind: k.key }),
					className: cn("h-8 rounded-md px-2.5 text-xs", settings.kind === k.key ? "bg-accent text-accent-fg" : "bg-elevated text-muted hover:text-fg"),
					children: t(k.label)
				}, k.key)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mx-1 h-5 w-px bg-border" }),
				["ink", "paper"].map((bg) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => patch({ background: bg }),
					className: cn("h-8 rounded-md px-2.5 text-xs", settings.background === bg ? "bg-accent text-accent-fg" : "bg-elevated text-muted hover:text-fg"),
					children: t(bg)
				}, bg)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorChip, {
					label: t("colorUp"),
					value: settings.upColor,
					onChange: (upColor) => patch({ upColor })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorChip, {
					label: t("colorDown"),
					value: settings.downColor,
					onChange: (downColor) => patch({ downColor })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorChip, {
					label: t("wick"),
					value: settings.wickColor,
					onChange: (wickColor) => patch({ wickColor })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mx-1 h-5 w-px bg-border" }),
				TOGGLES.map((item) => {
					const on = Boolean(settings[item.key]);
					const label = item.label === "sma20" || item.label === "sma50" || item.label === "sma200" || item.label === "ema12" || item.label === "ema26" || item.label === "bollinger" ? item.label === "bollinger" ? "BB" : item.label.toUpperCase() : t(item.label);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => patch({ [item.key]: !on }),
						className: cn("h-8 rounded-md px-2.5 text-xs", on ? "bg-accent text-accent-fg" : "bg-elevated text-muted hover:text-fg"),
						children: label
					}, item.key);
				})
			]
		}) : null]
	});
}
function ColorChip({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "inline-flex h-8 items-center gap-1.5 rounded-md bg-elevated px-2 text-xs text-muted",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "color",
			value,
			onChange: (e) => onChange(e.target.value),
			className: "size-4 cursor-pointer rounded-sm border-0 bg-transparent p-0"
		})]
	});
}
var SPEEDS = [
	{
		ms: 5e3,
		key: "s5"
	},
	{
		ms: 15e3,
		key: "s15"
	},
	{
		ms: 3e4,
		key: "s30"
	}
];
function LiveControls({ updatedAt, fetching, locked }) {
	const live = useDesk((s) => s.live);
	const liveMs = useDesk((s) => s.liveMs);
	const setLive = useDesk((s) => s.setLive);
	const setLiveMs = useDesk((s) => s.setLiveMs);
	const locale = useLocale();
	const t = useT();
	const on = locked || live;
	const stamp = updatedAt ? new Date(updatedAt).toLocaleTimeString(LOCALE_BCP[locale], {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit"
	}) : "—";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => {
					if (!locked) setLive(!live);
				},
				disabled: locked,
				className: cn("flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs transition-colors duration-[var(--motion-quick)]", on ? "bg-elevated text-fg" : "bg-elevated text-muted", locked && "opacity-100"),
				"aria-pressed": on,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1.5 rounded-full", on ? "bg-up animate-live-pulse" : "bg-faint") }), locked ? t("liveAlways") : on ? t("liveOn") : t("liveOff")]
			}),
			!locked && on ? SPEEDS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setLiveMs(s.ms),
				className: cn("hidden h-8 rounded-md px-2 text-[11px] sm:inline-flex sm:items-center", liveMs === s.ms ? "bg-accent text-accent-fg" : "bg-elevated text-muted"),
				children: t(s.key)
			}, s.ms)) : null,
			locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hidden text-[11px] text-muted sm:inline",
				children: t("live3s")
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hidden font-mono text-[10px] text-faint tabular-nums md:inline",
				children: fetching ? t("updating") : stamp
			})
		]
	});
}
function NewsPanel({ symbol, name }) {
	const t = useT();
	const locale = useLocale();
	const symbolQ = useQuery({
		queryKey: [
			"news",
			symbol ?? "",
			locale
		],
		queryFn: () => getNews({ data: {
			symbol: symbol || void 0,
			locale
		} }),
		staleTime: 12e4,
		refetchInterval: 18e4
	});
	const marketQ = useQuery({
		queryKey: [
			"news",
			"market",
			locale
		],
		queryFn: () => getNews({ data: { locale } }),
		staleTime: 12e4,
		refetchInterval: 18e4
	});
	const symbolNews = symbolQ.data ?? [];
	const marketNews = (marketQ.data ?? []).filter((n) => !symbol || !symbolNews.some((s) => s.id === n.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "bg-bg px-4 py-4 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg tracking-tight",
					children: t("news")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-faint",
					children: t("newsOnly")
				})]
			}),
			symbol ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsGroup, {
				label: name || symbol,
				items: symbolNews,
				loading: symbolQ.isLoading
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsGroup, {
				label: t("market"),
				items: marketNews,
				loading: marketQ.isLoading
			})
		]
	});
}
function NewsGroup({ label, items, loading }) {
	const t = useT();
	const locale = useLocale();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 last:mb-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-2 text-[11px] tracking-wide text-faint uppercase",
			children: label
		}), loading && items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: t("newsLoading")
		}) : items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: t("noNews")
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col gap-1",
			children: items.filter((item) => safeHttpUrl(item.url)).slice(0, 6).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: item.url,
				target: "_blank",
				rel: "noopener noreferrer",
				className: "block rounded-md px-2 py-2 hover:bg-elevated",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-fg",
						children: item.title
					}), item.impact !== "none" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("shrink-0 text-[10px]", item.impact === "up" ? "text-up" : "text-down"),
						children: item.impact === "up" ? t("newsUp") : t("newsDown")
					}) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "mt-1 block text-[11px] text-faint",
					children: [
						item.source,
						" · ",
						formatAgo(item.publishedAt, t, locale)
					]
				})]
			}) }, item.id))
		})]
	});
}
function formatAgo(ts, t, locale) {
	const min = Math.max(0, Math.round((Date.now() - ts) / 6e4));
	if (min < 1) return t("justNow");
	if (min < 60) return t("minutesAgo", { n: min });
	const hr = Math.round(min / 60);
	if (hr < 24) return t("hoursAgo", { n: hr });
	return new Date(ts).toLocaleDateString(LOCALE_BCP[locale]);
}
function FundamentalsPanel({ symbol, currency = "", week52High, week52Low }) {
	const t = useT();
	const locale = useLocale();
	const q = useQuery({
		queryKey: ["fundamentals", symbol ?? ""],
		enabled: Boolean(symbol),
		queryFn: () => getFundamentals({ data: { symbol } }),
		staleTime: 9e5
	});
	const data = q.data;
	if (!symbol) return null;
	const cells = [
		{
			key: "statPer",
			value: fmtRatio(data?.per)
		},
		{
			key: "statPbr",
			value: fmtRatio(data?.pbr)
		},
		{
			key: "statEps",
			value: fmtNum(data?.eps, currency, symbol, locale)
		},
		{
			key: "statDiv",
			value: fmtNum(data?.dividendRate, currency, symbol, locale)
		},
		{
			key: "statYield",
			value: fmtPct(data?.dividendYield)
		},
		{
			key: "statPayout",
			value: fmtPct(data?.payout)
		},
		{
			key: "statRoe",
			value: fmtPct(data?.roe)
		},
		{
			key: "statCap",
			value: fmtCap(data?.marketCap, locale)
		},
		{
			key: "statHigh",
			value: fmtNum(data?.week52High ?? week52High, currency, symbol, locale)
		},
		{
			key: "statLow",
			value: fmtNum(data?.week52Low ?? week52Low, currency, symbol, locale)
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "shrink-0 border-t border-border bg-bg pb-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-between px-4 pt-2 md:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] tracking-wide text-faint uppercase",
				children: t("company")
			})
		}), q.isLoading && !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "px-4 py-2 text-xs text-muted md:px-6",
			children: t("newsLoading")
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto overscroll-x-contain px-4 pb-2 md:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "flex min-w-max gap-4",
				children: cells.map((cell) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-20 shrink-0 py-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-[10px] text-faint",
						children: t(cell.key)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-mono text-sm tabular-nums text-fg",
						children: cell.value
					})]
				}, cell.key))
			})
		})]
	});
}
function fmtRatio(n) {
	if (n == null || !Number.isFinite(n) || n <= 0) return "—";
	return n.toFixed(2);
}
function fmtPct(n) {
	if (n == null || !Number.isFinite(n)) return "—";
	return `${(Math.abs(n) <= 1.5 ? n * 100 : n).toFixed(2)}%`;
}
function fmtNum(n, currency, symbol, locale) {
	if (n == null || !Number.isFinite(n)) return "—";
	return formatPrice(n, currency, symbol, locale);
}
function fmtCap(n, locale) {
	if (n == null || !Number.isFinite(n) || n <= 0) return "—";
	const abs = Math.abs(n);
	if (locale === "ja") {
		if (abs >= 0xe8d4a51000) return `${(n / 0xe8d4a51000).toFixed(2)}兆`;
		if (abs >= 1e8) return `${(n / 1e8).toFixed(2)}億`;
		return n.toLocaleString("ja-JP");
	}
	if (abs >= 0xe8d4a51000) return `${(n / 0xe8d4a51000).toFixed(2)}T`;
	if (abs >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
	if (abs >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
	return n.toLocaleString(locale === "zh" ? "zh-CN" : locale === "ko" ? "ko-KR" : "en-US");
}
function sma(candles, period) {
	const out = [];
	let sum = 0;
	for (let i = 0; i < candles.length; i++) {
		sum += candles[i].close;
		if (i >= period) sum -= candles[i - period].close;
		if (i >= period - 1) out.push({
			time: candles[i].time,
			value: sum / period
		});
	}
	return out;
}
function ema(candles, period) {
	const out = [];
	if (candles.length === 0) return out;
	const k = 2 / (period + 1);
	let prev = candles[0].close;
	for (let i = 0; i < candles.length; i++) {
		const val = candles[i].close * k + prev * (1 - k);
		prev = val;
		if (i >= period - 1) out.push({
			time: candles[i].time,
			value: val
		});
	}
	return out;
}
function bollinger(candles, period = 20, mult = 2) {
	const mid = [];
	const upper = [];
	const lower = [];
	for (let i = period - 1; i < candles.length; i++) {
		let sum = 0;
		for (let j = i - period + 1; j <= i; j++) sum += candles[j].close;
		const mean = sum / period;
		let sq = 0;
		for (let j = i - period + 1; j <= i; j++) {
			const d = candles[j].close - mean;
			sq += d * d;
		}
		const sd = Math.sqrt(sq / period);
		const t = candles[i].time;
		mid.push({
			time: t,
			value: mean
		});
		upper.push({
			time: t,
			value: mean + mult * sd
		});
		lower.push({
			time: t,
			value: mean - mult * sd
		});
	}
	return {
		mid,
		upper,
		lower
	};
}
var SMA_COLORS = {
	20: "#7aa2c4",
	50: "#c4a36a",
	200: "#9b8fd4"
};
function PriceChart({ candles, settings, symbol = "", currency = "", period }) {
	const hostRef = (0, import_react.useRef)(null);
	const chartRef = (0, import_react.useRef)(null);
	const mainRef = (0, import_react.useRef)(null);
	const extraRef = (0, import_react.useRef)([]);
	const candlesRef = (0, import_react.useRef)(candles);
	const periodRef = (0, import_react.useRef)(period);
	candlesRef.current = candles;
	periodRef.current = period;
	const countRef = (0, import_react.useRef)(0);
	const hoverRef = (0, import_react.useRef)(null);
	const pressRef = (0, import_react.useRef)(null);
	const timerRef = (0, import_react.useRef)(0);
	const axisHintRef = (0, import_react.useRef)(null);
	const [inspect, setInspect] = (0, import_react.useState)(null);
	candlesRef.current = candles;
	(0, import_react.useEffect)(() => {
		const host = hostRef.current;
		if (!host) return;
		const ink = settings.background === "ink";
		const bg = ink ? "#14161a" : "#f3f1ec";
		const text = ink ? "#8b909a" : "#5c616b";
		const grid = settings.showGrid ? ink ? "rgba(232,234,238,0.06)" : "rgba(22,24,29,0.08)" : "transparent";
		const border = ink ? "#2a2e36" : "#d7d2c8";
		const chart = Ve(host, {
			layout: {
				background: { color: bg },
				textColor: text,
				fontFamily: "IBM Plex Sans, Hiragino Sans, sans-serif",
				fontSize: 12
			},
			grid: {
				vertLines: { color: grid },
				horzLines: { color: grid }
			},
			crosshair: {
				mode: settings.showCrosshair ? 1 : 2,
				vertLine: {
					visible: settings.showCrosshair,
					color: ink ? "rgba(197,205,216,0.35)" : "rgba(22,24,29,0.25)",
					width: 1,
					style: 3
				},
				horzLine: {
					visible: settings.showCrosshair,
					color: ink ? "rgba(197,205,216,0.35)" : "rgba(22,24,29,0.25)",
					width: 1,
					style: 3
				}
			},
			rightPriceScale: {
				borderColor: border,
				mode: settings.logScale ? 1 : 0
			},
			timeScale: {
				borderColor: border,
				visible: true,
				timeVisible: true,
				secondsVisible: false,
				ticksVisible: true,
				barSpacing: 8,
				minBarSpacing: 4,
				rightOffset: 3,
				lockVisibleTimeRangeOnResize: true,
				shiftVisibleRangeOnNewBar: true,
				fixLeftEdge: false,
				fixRightEdge: false
			},
			localization: {
				locale: "ja-JP",
				dateFormat: "yyyy/MM/dd",
				timeFormatter: (time) => formatAxisTime(time, candlesRef.current, periodRef.current, "label")
			},
			handleScroll: {
				mouseWheel: true,
				pressedMouseMove: true,
				horzTouchDrag: true,
				vertTouchDrag: true
			},
			handleScale: {
				mouseWheel: true,
				pinch: true,
				axisPressedMouseMove: {
					time: true,
					price: true
				},
				axisDoubleClickReset: {
					time: false,
					price: true
				}
			}
		});
		chartRef.current = chart;
		clampBarSpacing(chart);
		if (settings.kind === "candle") mainRef.current = chart.addCandlestickSeries({
			upColor: settings.upColor,
			downColor: settings.downColor,
			borderUpColor: settings.upColor,
			borderDownColor: settings.downColor,
			wickUpColor: settings.wickColor || settings.upColor,
			wickDownColor: settings.wickColor || settings.downColor,
			lastValueVisible: settings.showLastPrice,
			priceLineVisible: settings.showLastPrice
		});
		else if (settings.kind === "bar") mainRef.current = chart.addBarSeries({
			upColor: settings.upColor,
			downColor: settings.downColor,
			lastValueVisible: settings.showLastPrice,
			priceLineVisible: settings.showLastPrice
		});
		else if (settings.kind === "area") mainRef.current = chart.addAreaSeries({
			lineColor: settings.lineColor,
			topColor: settings.areaTop,
			bottomColor: settings.areaBottom,
			lineWidth: 2,
			lastValueVisible: settings.showLastPrice,
			priceLineVisible: settings.showLastPrice
		});
		else mainRef.current = chart.addLineSeries({
			color: settings.lineColor,
			lineWidth: 2,
			lastValueVisible: settings.showLastPrice,
			priceLineVisible: settings.showLastPrice
		});
		extraRef.current = [];
		paintSeries(chart, settings, candlesRef.current, mainRef, extraRef);
		countRef.current = candlesRef.current.length;
		chart.timeScale().fitContent();
		clampBarSpacing(chart);
		const onRange = () => {
			const span = chart.timeScale().getVisibleRange();
			if (!span || !axisHintRef.current) return;
			const from = formatAxisTime(span.from, candlesRef.current, periodRef.current, "label");
			const to = formatAxisTime(span.to, candlesRef.current, periodRef.current, "label");
			axisHintRef.current.textContent = from && to ? `${from}  →  ${to}` : "";
		};
		chart.timeScale().subscribeVisibleTimeRangeChange(onRange);
		requestAnimationFrame(onRange);
		const onMove = (param) => {
			hoverRef.current = candleAt(candlesRef.current, param);
		};
		chart.subscribeCrosshairMove(onMove);
		const clearTimer = () => {
			if (timerRef.current) window.clearTimeout(timerRef.current);
			timerRef.current = 0;
		};
		const onDown = (e) => {
			pressRef.current = {
				x: e.clientX,
				y: e.clientY,
				t: Date.now()
			};
			clearTimer();
			timerRef.current = window.setTimeout(() => {
				const candle = hoverRef.current ?? nearestCandle(candlesRef.current, chart, e, host);
				if (!candle) return;
				const box = host.getBoundingClientRect();
				setInspect({
					candle,
					x: Math.min(Math.max(12, e.clientX - box.left), box.width - 180),
					y: Math.min(Math.max(12, e.clientY - box.top - 8), box.height - 120)
				});
			}, 420);
		};
		const onMovePtr = (e) => {
			const start = pressRef.current;
			if (!start) return;
			if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > 12) {
				pressRef.current = null;
				clearTimer();
			}
		};
		const onUp = () => {
			pressRef.current = null;
			clearTimer();
		};
		host.addEventListener("pointerdown", onDown);
		host.addEventListener("pointermove", onMovePtr);
		host.addEventListener("pointerup", onUp);
		host.addEventListener("pointercancel", onUp);
		host.addEventListener("contextmenu", (e) => e.preventDefault());
		const ro = new ResizeObserver(() => {
			const { width, height } = host.getBoundingClientRect();
			if (width > 0 && height > 0) {
				chart.applyOptions({
					width,
					height
				});
				clampBarSpacing(chart);
			}
		});
		ro.observe(host);
		return () => {
			ro.disconnect();
			clearTimer();
			host.removeEventListener("pointerdown", onDown);
			host.removeEventListener("pointermove", onMovePtr);
			host.removeEventListener("pointerup", onUp);
			host.removeEventListener("pointercancel", onUp);
			chart.timeScale().unsubscribeVisibleTimeRangeChange(onRange);
			chart.unsubscribeCrosshairMove(onMove);
			chart.remove();
			chartRef.current = null;
			mainRef.current = null;
			extraRef.current = [];
		};
	}, [settings]);
	(0, import_react.useEffect)(() => {
		const chart = chartRef.current;
		const main = mainRef.current;
		if (!chart || !main || !candles.length) return;
		const last = candles[candles.length - 1];
		const prevCount = countRef.current;
		const sameLen = candles.length === prevCount;
		const range = chart.timeScale().getVisibleLogicalRange();
		if (sameLen && settings.kind === "candle") main.update({
			time: last.time,
			open: last.open,
			high: last.high,
			low: last.low,
			close: last.close
		});
		else if (sameLen && settings.kind !== "bar") main.update({
			time: last.time,
			value: last.close
		});
		else {
			paintSeries(chart, settings, candles, mainRef, extraRef);
			if (range) {
				const shift = candles.length - prevCount;
				chart.timeScale().setVisibleLogicalRange({
					from: range.from + Math.max(0, shift),
					to: range.to + Math.max(0, shift)
				});
			}
		}
		clampBarSpacing(chart);
		countRef.current = candles.length;
	}, [candles, settings]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 w-full flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: hostRef,
			className: "relative min-h-0 flex-1 touch-manipulation",
			children: inspect ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandleTip, {
				inspect,
				symbol,
				currency,
				onClose: () => setInspect(null)
			}) : null
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			ref: axisHintRef,
			className: "shrink-0 border-t border-border bg-surface px-3 py-1 text-center font-mono text-[11px] text-muted tabular-nums"
		})]
	});
}
function candleAt(candles, param) {
	const time = param.time;
	if (typeof time !== "number") return null;
	return candles.find((c) => c.time === time) ?? null;
}
function nearestCandle(candles, chart, e, host) {
	if (!candles.length) return null;
	const x = e.clientX - host.getBoundingClientRect().left;
	const time = chart.timeScale().coordinateToTime(x);
	if (typeof time !== "number") return candles[candles.length - 1] ?? null;
	let best = candles[0];
	let gap = Math.abs(best.time - time);
	for (const c of candles) {
		const d = Math.abs(c.time - time);
		if (d < gap) {
			best = c;
			gap = d;
		}
	}
	return best;
}
function CandleTip({ inspect, symbol, currency, onClose }) {
	const t = useT();
	const locale = useLocale();
	const c = inspect.candle;
	const up = c.close >= c.open;
	const when = (/* @__PURE__ */ new Date(c.time * 1e3)).toLocaleString(LOCALE_BCP[locale], {
		month: "numeric",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		timeZone: "Asia/Tokyo"
	});
	const n = (v) => formatPrice(v, currency, symbol, locale);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute z-20 min-w-40 rounded-md border border-border bg-elevated/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm",
		style: {
			left: inspect.x,
			top: inspect.y
		},
		onPointerDown: (e) => e.stopPropagation(),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-1 flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-muted",
				children: when
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onClose,
				className: "text-[11px] text-faint hover:text-fg",
				children: t("dismiss")
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
			className: "grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono tabular-nums",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-faint",
					children: t("open")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "text-right text-fg",
					children: n(c.open)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-faint",
					children: t("high")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "text-right text-fg",
					children: n(c.high)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-faint",
					children: t("low")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "text-right text-fg",
					children: n(c.low)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-faint",
					children: t("close")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: up ? "text-right text-up" : "text-right text-down",
					children: n(c.close)
				})
			]
		})]
	});
}
function paintSeries(chart, settings, candles, mainRef, extraRef) {
	const mapped = candles.map((c) => ({
		time: c.time,
		open: c.open,
		high: c.high,
		low: c.low,
		close: c.close
	}));
	const lineData = candles.map((c) => ({
		time: c.time,
		value: c.close
	}));
	const main = mainRef.current;
	if (!main) return;
	if (settings.kind === "candle" || settings.kind === "bar") main.setData(mapped);
	else main.setData(lineData);
	for (const s of extraRef.current) try {
		chart.removeSeries(s);
	} catch {}
	extraRef.current = [];
	const addLine = (pts, color, width = 1) => {
		if (pts.length < 2) return;
		const s = chart.addLineSeries({
			color,
			lineWidth: width,
			priceLineVisible: false,
			lastValueVisible: false,
			crosshairMarkerVisible: false
		});
		s.setData(pts.map((p) => ({
			time: p.time,
			value: p.value
		})));
		extraRef.current.push(s);
	};
	const ink = settings.background === "ink";
	if (settings.sma20) addLine(sma(candles, 20), SMA_COLORS[20]);
	if (settings.sma50) addLine(sma(candles, 50), SMA_COLORS[50]);
	if (settings.sma200) addLine(sma(candles, 200), SMA_COLORS[200], 2);
	if (settings.ema12) addLine(ema(candles, 12), "#6ec8c0");
	if (settings.ema26) addLine(ema(candles, 26), "#d08a6a");
	if (settings.bollinger) {
		const bb = bollinger(candles);
		addLine(bb.upper, ink ? "rgba(197,205,216,0.45)" : "rgba(22,24,29,0.35)");
		addLine(bb.mid, ink ? "rgba(197,205,216,0.7)" : "rgba(22,24,29,0.5)");
		addLine(bb.lower, ink ? "rgba(197,205,216,0.45)" : "rgba(22,24,29,0.35)");
	}
	if (settings.showVolume) {
		const vol = chart.addHistogramSeries({
			priceFormat: { type: "volume" },
			priceScaleId: "vol",
			lastValueVisible: false,
			priceLineVisible: false
		});
		chart.priceScale("vol").applyOptions({ scaleMargins: {
			top: .78,
			bottom: 0
		} });
		vol.setData(candles.map((c) => ({
			time: c.time,
			value: c.volume,
			color: c.close >= c.open ? settings.upColor + "99" : settings.downColor + "99"
		})));
		extraRef.current.push(vol);
	}
}
var MIN_BAR = 4;
var MAX_BAR = 16;
function clampBarSpacing(chart) {
	const current = chart.timeScale().options().barSpacing ?? 8;
	if (current < MIN_BAR) chart.timeScale().applyOptions({ barSpacing: MIN_BAR });
	if (current > MAX_BAR) chart.timeScale().applyOptions({ barSpacing: MAX_BAR });
}
function isIntradayData(candles) {
	if (candles.length < 2) return false;
	return candles[1].time - candles[0].time < 72e3;
}
function formatAxisTime(time, candles, period, mark) {
	const unix = typeof time === "number" ? time : typeof time === "object" && time && "timestamp" in time ? Number(time.timestamp) : NaN;
	if (!Number.isFinite(unix)) return "";
	const date = /* @__PURE__ */ new Date(unix * 1e3);
	const parts = new Intl.DateTimeFormat("ja-JP", {
		timeZone: "Asia/Tokyo",
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false
	}).formatToParts(date);
	const pick = (type) => parts.find((p) => p.type === type)?.value ?? "";
	const y = pick("year");
	const mo = pick("month");
	const d = pick("day");
	const clock = `${pick("hour")}:${pick("minute")}`;
	const day = `${mo}/${d}`;
	const intraday = period === "1d" || period === "5d" || isIntradayData(candles);
	if (mark === "label") return intraday ? `${day} ${clock}` : `${y}/${day}`;
	if (mark >= 3 || intraday && mark >= 2) return clock;
	if (mark === 2) return intraday ? `${day} ${clock}` : day;
	if (mark === 1) return `${y}/${mo}`;
	return y;
}
var FILTERS = [
	{
		key: "all",
		label: "すべて"
	},
	{
		key: "jp",
		label: "日本株"
	},
	{
		key: "overseas",
		label: "海外株"
	},
	{
		key: "etf",
		label: "ETF"
	},
	{
		key: "fund",
		label: "投信"
	},
	{
		key: "index",
		label: "指数"
	},
	{
		key: "commodity",
		label: "商品"
	},
	{
		key: "fx",
		label: "為替"
	},
	{
		key: "crypto",
		label: "暗号"
	},
	{
		key: "bond",
		label: "債券"
	}
];
function SearchDock() {
	const watchlist = useDesk((s) => s.watchlist);
	const addItem = useDesk((s) => s.addItem);
	const t = useT();
	const [q, setQ] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [hits, setHits] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!open && !q.trim()) return;
		const handle = window.setTimeout(async () => {
			setBusy(true);
			try {
				const rows = await searchSymbols({ data: { q } });
				setHits(rows);
			} catch {
				setHits([]);
			} finally {
				setBusy(false);
			}
		}, 160);
		return () => window.clearTimeout(handle);
	}, [q, open]);
	const known = (0, import_react.useMemo)(() => new Set(watchlist.map((w) => w.symbol.toUpperCase())), [watchlist]);
	const visible = (0, import_react.useMemo)(() => {
		return hits.filter((h) => {
			const kind = h.kind ?? classify(h.symbol, h.type, h.exchange);
			return filter === "all" || kind === filter;
		});
	}, [hits, filter]);
	function addHit(hit) {
		const symbol = safeSymbol(normalizeSymbol(hit.symbol)) ?? normalizeSymbol(hit.symbol);
		addItem({
			symbol,
			name: hit.name,
			exchange: hit.exchange,
			kind: hit.kind ?? classify(hit.symbol, hit.type, hit.exchange)
		});
		if (useDesk.getState().watchlist.some((w) => w.symbol.toUpperCase() === symbol)) {
			toast.success(`${hit.name} · ${symbol}`);
			setQ("");
			setOpen(false);
			window.setTimeout(revealChart, 50);
		}
	}
	function addTyped() {
		const raw = q.trim();
		if (!raw) return;
		const code = normalizeSymbol(raw);
		const match = visible.find((h) => {
			const sym = h.symbol.toUpperCase();
			return sym === code || sym === raw.toUpperCase() || sym.replace(/\.T$/, "") === raw.toUpperCase();
		});
		if (match) {
			addHit({
				...match,
				symbol: normalizeSymbol(match.symbol)
			});
			return;
		}
		addItem({
			symbol: code,
			name: code,
			kind: classify(code)
		});
		setQ("");
		setOpen(false);
		window.setTimeout(revealChart, 50);
	}
	const showResults = open && (q.trim().length > 0 || filter !== "all" || hits.length > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm",
		children: [showResults ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-h-64 overflow-y-auto border-b border-border px-3 pt-2 pb-2 md:px-6",
			children: busy && visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-2 py-3 text-xs text-muted",
				children: t("searching")
			}) : visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-2 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: t("noHits")
				}), q.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: addTyped,
					className: "mt-2 inline-flex h-8 items-center gap-1 rounded-md bg-accent px-3 text-xs text-accent-fg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }),
						t("add"),
						" ",
						q.trim().toUpperCase()
					]
				}) : null]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mx-auto flex max-w-5xl flex-col",
				children: visible.slice(0, 12).map((hit) => {
					const added = known.has(hit.symbol.toUpperCase());
					const kind = hit.kind ?? classify(hit.symbol, hit.type, hit.exchange);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-2 border-b border-border/60 py-1.5 last:border-b-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate text-sm text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs",
									children: hit.symbol
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-muted",
									children: hit.name
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-faint",
								children: t(kindKey(kind))
							})]
						}), added ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 rounded-md bg-elevated px-2 py-1 text-[11px] text-muted",
							children: t("added")
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => addHit(hit),
							className: "inline-flex h-8 shrink-0 items-center gap-1 rounded-md bg-accent px-2.5 text-xs text-accent-fg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), t("add")]
						})]
					}, hit.symbol);
				})
			})
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2 px-3 py-2 md:flex-row md:items-center md:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "hidden shrink-0 text-[11px] tracking-wide text-faint uppercase md:block",
					children: t("search")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex min-w-0 flex-1 gap-1 overflow-x-auto",
					children: FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setFilter(f.key);
							setOpen(true);
						},
						className: cn("h-8 shrink-0 rounded-md px-2 text-[11px]", filter === f.key ? "bg-accent text-accent-fg" : "bg-elevated text-muted"),
						children: f.key === "all" ? t("all") : t(kindKey(f.key))
					}, f.key))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "relative flex w-full md:max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: q,
							onChange: (e) => {
								setQ(e.target.value);
								setOpen(true);
							},
							onFocus: () => setOpen(true),
							onKeyDown: (e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									addTyped();
								}
								if (e.key === "Escape") setOpen(false);
							},
							placeholder: t("searchPh"),
							className: "h-11 w-full rounded-md border border-border bg-bg pr-20 pl-10 text-sm text-fg placeholder:text-faint outline-none focus:ring-2 focus:ring-ring"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: addTyped,
							disabled: !q.trim(),
							className: "absolute top-1/2 right-1 inline-flex h-9 -translate-y-1/2 items-center gap-1 rounded-md bg-accent px-2.5 text-xs text-accent-fg disabled:opacity-40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), t("add")]
						})
					]
				})
			]
		})]
	});
}
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
var listWatchlists = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e739ef90ea62487e5ca7da6ee4731232b91be35dc5585317bce4fa8741979211"));
var saveWatchlist = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string().uuid().optional(),
	name: string().min(1).max(40),
	items: array(itemSchema).max(200),
	selected: string().max(32).optional()
})).handler(createSsrRpc("e821b21ea8c6ca258aa4d70b6abaa109af638e18b1daff7b7d42ba536b7f5f1b"));
var deleteWatchlist = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string().uuid() })).handler(createSsrRpc("cc482cc03f4b9cadf4b7c8e2860fae2bb1eca2e20cd525db1f95b95ccd8508ea"));
function WatchlistSync() {
	const { user, isPending } = useCurrentUserState();
	const watchlist = useDesk((s) => s.watchlist);
	const selected = useDesk((s) => s.selected);
	const listId = useDesk((s) => s.listId);
	const listName = useDesk((s) => s.listName ?? "メイン");
	const replaceWatchlist = useDesk((s) => s.replaceWatchlist);
	const setListMeta = useDesk((s) => s.setListMeta);
	const t = useT();
	const [lists, setLists] = (0, import_react.useState)([]);
	const [nameDraft, setNameDraft] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [status, setStatus] = (0, import_react.useState)("この端末に保存");
	const boot = (0, import_react.useRef)(false);
	const skip = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (isPending || !user) {
			boot.current = false;
			setLists([]);
			setStatus(t("savedLocal"));
			return;
		}
		let cancelled = false;
		listWatchlists().then((rows) => {
			if (cancelled) return;
			setLists(rows);
			const current = useDesk.getState();
			const match = rows.find((r) => r.id === current.listId) ?? rows[0];
			if (match) {
				const local = current.watchlist;
				const cloudNewer = match.items.length >= local.length;
				skip.current = true;
				if (cloudNewer) replaceWatchlist(match.items, match.selected);
				setListMeta(match.id, match.name);
				setStatus(`${match.name} を同期`);
			} else persist("メイン", current.watchlist, current.selected);
			boot.current = true;
		}).catch(() => {
			setStatus(t("savedLocal"));
		});
		return () => {
			cancelled = true;
		};
	}, [
		user,
		isPending,
		replaceWatchlist,
		setListMeta
	]);
	(0, import_react.useEffect)(() => {
		if (!user || !boot.current) return;
		if (skip.current) {
			skip.current = false;
			return;
		}
		const handle = window.setTimeout(() => {
			persist(listName || "メイン", watchlist, selected, listId ?? void 0);
		}, 800);
		return () => window.clearTimeout(handle);
	}, [
		user,
		watchlist,
		selected,
		listId,
		listName
	]);
	async function persist(name, items, sel, id) {
		if (!items.length) return;
		setBusy(true);
		try {
			const saved = await saveWatchlist({ data: {
				id,
				name,
				items,
				selected: sel
			} });
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
	async function load(row) {
		skip.current = true;
		replaceWatchlist(row.items, row.selected);
		setListMeta(row.id, row.name);
		setStatus(`${row.name} を表示`);
	}
	async function remove(id) {
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
	if (isPending || !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "border-t border-border px-3 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] tracking-wide text-faint uppercase",
				children: t("save")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[11px] text-muted",
				children: t("savedLocal")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[11px] text-faint",
				children: t("saveHint")
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "border-t border-border px-3 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] tracking-wide text-faint uppercase",
				children: t("save")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[11px] text-muted",
				children: busy ? t("saving") : status
			}),
			user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: nameDraft,
					onChange: (e) => setNameDraft(e.target.value),
					placeholder: t("newName"),
					className: "h-8 min-w-0 flex-1 rounded-md border border-border bg-bg px-2 text-xs text-fg outline-none"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => void saveAs(),
					className: "h-8 rounded-md bg-accent px-2 text-[11px] text-accent-fg",
					children: t("saveAs")
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 flex flex-col gap-1",
				children: lists.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => void load(row),
						className: cn("h-8 min-w-0 flex-1 truncate rounded-md px-2 text-left text-xs", row.id === listId ? "bg-accent text-accent-fg" : "bg-elevated text-muted"),
						children: [
							row.name,
							" · ",
							row.items.length
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void remove(row.id),
						className: "h-8 rounded-md px-2 text-[11px] text-faint hover:text-down",
						children: t("delete")
					})]
				}, row.id))
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[11px] text-faint",
				children: t("saveHint")
			})
		]
	});
}
function WatchlistPanel({ quotes }) {
	const watchlist = useDesk((s) => s.watchlist);
	const selected = useDesk((s) => s.selected);
	const select = useDesk((s) => s.select);
	const removeItem = useDesk((s) => s.removeItem);
	const t = useT();
	const locale = useLocale();
	const items = (0, import_react.useMemo)(() => watchlist, [watchlist]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex h-full min-h-0 flex-col border-r border-border bg-surface",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-4 pt-4 pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg tracking-tight text-fg",
					children: t("watch")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: t("watchHint", { n: items.length })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "min-h-0 flex-1 overflow-y-auto px-2 pb-4",
				children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "px-2 py-8 text-center text-sm text-muted",
					children: t("watchEmpty")
				}) : items.map((item) => {
					const active = item.symbol === selected;
					const quote = quotes.get(item.symbol.toUpperCase());
					const up = (quote?.change ?? 0) >= 0;
					const kind = item.kind ?? classify(item.symbol, void 0, item.exchange);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "group relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => select(item.symbol),
							className: cn("flex w-full items-start justify-between gap-2 rounded-md py-2.5 pr-9 pl-3 text-left transition-colors duration-[var(--motion-quick)]", active ? "bg-elevated" : "hover:bg-elevated/60"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block font-mono text-[13px] text-fg",
										children: item.symbol
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate text-[11px] text-muted",
										children: prettyName(item.symbol, item.name, quote?.name)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-0.5 block text-[10px] text-faint",
										children: t(kindKey(kind))
									})
								]
							}), quote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "shrink-0 text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-mono text-[12px] tabular-nums text-fg",
									children: formatPrice(quote.price, quote.currency, item.symbol, locale)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: cn("block font-mono text-[10px] tabular-nums", up ? "text-up" : "text-down"),
									children: [
										up ? "+" : "",
										quote.changePercent.toFixed(2),
										"%"
									]
								})]
							}) : null]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": `${item.symbol} を削除`,
							onClick: () => removeItem(item.symbol),
							className: "absolute top-2 right-1 flex size-8 items-center justify-center rounded-sm text-faint hover:bg-subtle hover:text-down md:size-7 md:opacity-0 md:group-hover:opacity-100",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
						})]
					}, item.symbol);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WatchlistSync, {})
		]
	});
}
function DeskApp() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskShell, {});
}
function DeskShell() {
	(0, import_react.useEffect)(() => {
		useDesk.persist.rehydrate();
	}, []);
	const selected = useDesk((s) => s.selected);
	const watchlist = useDesk((s) => s.watchlist);
	const period = useDesk((s) => s.period);
	const setPeriod = useDesk((s) => s.setPeriod);
	const settings = useDesk((s) => s.settings);
	const live = useDesk((s) => s.live);
	const liveMs = useDesk((s) => s.liveMs);
	const renameMany = useDesk((s) => s.renameMany);
	const locale = useLocale();
	const t = useT();
	const item = watchlist.find((w) => w.symbol === selected);
	const spec = PERIODS.find((p) => p.key === period) ?? PERIODS[5];
	const streamLive = isIntraday(period) || live;
	const quoteMs = isIntraday(period) ? 3e3 : liveMs;
	const chartMs = isIntraday(period) ? 2e4 : liveMs;
	const chartQ = useQuery({
		queryKey: [
			"chart",
			selected,
			spec.range,
			spec.interval
		],
		enabled: Boolean(selected),
		queryFn: () => getChart({ data: {
			symbol: selected,
			range: spec.range,
			interval: spec.interval
		} }),
		staleTime: streamLive ? 8e3 : 6e4,
		refetchInterval: streamLive ? chartMs : false,
		refetchIntervalInBackground: false,
		placeholderData: (prev, q) => q?.queryKey[1] === selected ? prev : void 0
	});
	const symbolsKey = watchlist.map((w) => w.symbol).join(",");
	const quotesQ = useQuery({
		queryKey: ["quotes", symbolsKey],
		enabled: watchlist.length > 0,
		queryFn: () => getQuotes({ data: { symbols: symbolsKey } }),
		staleTime: streamLive ? 2e3 : 6e4,
		refetchInterval: streamLive ? quoteMs : false,
		refetchIntervalInBackground: false,
		placeholderData: keepPreviousData
	});
	const marketNewsQ = useQuery({
		queryKey: [
			"news",
			"market",
			locale
		],
		queryFn: () => getNews({ data: { locale } }),
		staleTime: 12e4,
		refetchInterval: 18e4
	});
	const symbolNewsQ = useQuery({
		queryKey: [
			"news",
			selected ?? "",
			locale
		],
		enabled: Boolean(selected),
		queryFn: () => getNews({ data: {
			symbol: selected,
			locale
		} }),
		staleTime: 12e4,
		refetchInterval: 18e4
	});
	const quotes = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const q of quotesQ.data ?? []) map.set(q.symbol.toUpperCase(), q);
		return map;
	}, [quotesQ.data]);
	const allNews = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const n of [...symbolNewsQ.data ?? [], ...marketNewsQ.data ?? []]) map.set(n.id, n);
		return [...map.values()];
	}, [symbolNewsQ.data, marketNewsQ.data]);
	const liveQuote = selected && quotes.get(selected.toUpperCase())?.source !== "sample" ? quotes.get(selected.toUpperCase()) : void 0;
	const meta = liveQuote ?? chartQ.data?.meta;
	(0, import_react.useEffect)(() => {
		const pending = [];
		for (const row of watchlist) {
			if (!isCodeName(row.name, row.symbol)) continue;
			const quote = quotes.get(row.symbol.toUpperCase());
			const fromChart = row.symbol === selected ? chartQ.data?.meta : void 0;
			const next = prettyName(row.symbol, quote?.name, fromChart?.name, row.name);
			if (next && !isCodeName(next, row.symbol)) pending.push({
				symbol: row.symbol,
				name: next
			});
		}
		if (pending.length) renameMany(pending);
	}, [
		quotes,
		chartQ.data?.meta,
		selected,
		renameMany
	]);
	const candles = (0, import_react.useMemo)(() => applyQuote(chartQ.data?.candles, liveQuote), [chartQ.data?.candles, liveQuote]);
	const [tab, setTab] = (0, import_react.useState)("chart");
	const firstSelect = (0, import_react.useRef)(true);
	(0, import_react.useEffect)(() => {
		if (firstSelect.current) {
			firstSelect.current = false;
			return;
		}
		setTab("chart");
		if (window.matchMedia("(max-width: 767px)").matches) revealChart();
	}, [selected]);
	(0, import_react.useEffect)(() => {
		const mq = window.matchMedia("(min-width: 768px)");
		const sync = () => {
			if (mq.matches) setTab((t) => t === "watch" ? "chart" : t);
		};
		sync();
		mq.addEventListener("change", sync);
		return () => mq.removeEventListener("change", sync);
	}, []);
	const up = (meta?.change ?? 0) >= 0;
	const currency = currencySuffix(meta?.currency ?? "", selected, locale);
	(0, import_react.useEffect)(() => {
		document.documentElement.lang = locale;
	}, [locale]);
	const fetching = chartQ.isFetching || quotesQ.isFetching;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl tracking-tight",
						children: "KABU"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "hidden text-xs text-muted sm:block",
						children: t("tagline")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveControls, {
							updatedAt: quotesQ.dataUpdatedAt || chartQ.dataUpdatedAt,
							fetching,
							locked: isIntraday(period)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageSwitch, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PwaBoot, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertsMenu, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountMenu, {})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomizePanel, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "order-2 hidden min-h-0 overflow-hidden md:order-1 md:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WatchlistPanel, { quotes })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					id: "kabu-chart",
					className: "order-1 flex min-h-0 min-w-0 flex-col overflow-hidden md:order-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1 border-b border-border px-4 pt-3 md:px-6",
						children: [
							["chart", t("tabChart")],
							["news", t("tabNews")],
							["watch", t("tabWatch")]
						].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setTab(key),
							className: cn("h-9 rounded-t-md px-3 text-sm", key === "watch" && "md:hidden", tab === key ? "bg-surface text-fg" : "text-muted hover:text-fg"),
							children: label
						}, key))
					}), tab === "news" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-h-0 flex-1 overflow-y-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsPanel, {
							symbol: selected,
							name: prettyName(selected, item?.name, meta?.name)
						})
					}) : tab === "watch" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-h-0 flex-1 overflow-hidden md:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WatchlistPanel, { quotes })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-h-0 flex-1 overflow-y-auto overscroll-y-contain pb-40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "shrink-0 border-b border-border px-4 py-3 md:px-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-end justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-xs text-muted",
										children: selected || "—"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-2xl tracking-tight md:text-3xl",
										children: prettyName(selected, item?.name, meta?.name) || t("pickSymbol")
									})] }), meta ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-mono text-2xl tabular-nums tracking-tight",
											children: [formatPrice(meta.price, meta.currency, selected, locale), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "ml-1 text-xs text-muted",
												children: currency
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: cn("font-mono text-sm tabular-nums", up ? "text-up" : "text-down"),
											children: [
												up ? "+" : "",
												formatPrice(meta.change, meta.currency, selected, locale),
												" (",
												up ? "+" : "",
												meta.changePercent.toFixed(2),
												"%)"
											]
										})]
									}) : null]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 flex flex-wrap gap-1.5",
									children: PERIODS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setPeriod(p.key),
										className: cn("h-8 rounded-md px-2.5 text-xs transition-colors duration-[var(--motion-quick)]", period === p.key ? "bg-accent text-accent-fg" : "bg-elevated text-muted hover:text-fg"),
										children: t(periodKey(p.key))
									}, p.key))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative h-[38vh] min-h-56 shrink-0 bg-surface",
								children: [!selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { msg: t("addWatchFirst") }) : chartQ.isLoading && !candles.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { msg: t("chartLoading") }) : !candles.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { msg: t("chartEmpty") }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceChart, {
									candles,
									settings,
									symbol: selected,
									currency: meta?.currency,
									period
								}), chartQ.data?.source === "sample" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "pointer-events-none absolute right-3 bottom-3 text-[10px] text-faint",
									children: t("sampleData")
								}) : null]
							}),
							selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FundamentalsPanel, {
								symbol: selected,
								currency: meta?.currency,
								week52High: meta?.week52High,
								week52Low: meta?.week52Low
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-8 shrink-0",
								"aria-hidden": true
							})] }) : null
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchDock, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertWatcher, {
				quotes,
				news: allNews
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "top-right",
				toastOptions: { className: "bg-elevated text-fg border border-border" }
			})
		]
	});
}
function applyQuote(candles, quote) {
	if (!candles?.length) return [];
	if (!quote || quote.source === "sample") return candles;
	const last = candles[candles.length - 1];
	if (last.close === quote.price) return candles;
	const next = candles.slice();
	next[next.length - 1] = {
		...last,
		close: quote.price,
		high: Math.max(last.high, quote.price),
		low: Math.min(last.low, quote.price)
	};
	return next;
}
function Empty({ msg }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-full min-h-72 items-center justify-center text-sm text-muted",
		children: msg
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskApp, {});
}
//#endregion
export { Home as component };
