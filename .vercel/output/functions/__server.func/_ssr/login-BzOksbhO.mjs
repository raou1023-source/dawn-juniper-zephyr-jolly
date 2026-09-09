import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { r as signIn } from "./client-CVqXY6bk.mjs";
import { t as GROK_PROVIDERS } from "./server-C5GEOtV8.mjs";
import { d as useT, n as LanguageSwitch } from "./language-switch-BLK4ogdS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BzOksbhO.js
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const t = useT();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-bg px-6 text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl tracking-tight",
						children: "KABU"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageSwitch, {})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-lg text-fg",
					children: t("loginTitle")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: t("loginBody")
				}),
				GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => signIn(p.providerId, { callbackURL: "/" }),
					className: "h-10 w-full rounded-md bg-accent text-sm text-accent-fg",
					children: t("continueWith", { p: p.label })
				}, p.providerId)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "block text-center text-xs text-faint hover:text-muted",
					children: t("skipLogin")
				})
			]
		})
	});
}
//#endregion
export { Login as component };
