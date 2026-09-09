import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { useT } from "@/lib/use-t";
import { LanguageSwitch } from "@/components/language-switch";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const t = useT();
  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-6 text-fg">
      <div className="w-full max-w-sm space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-display text-3xl tracking-tight">KABU</p>
          <LanguageSwitch />
        </div>
        <h1 className="text-lg text-fg">{t("loginTitle")}</h1>
        <p className="text-sm text-muted">{t("loginBody")}</p>
        {authEnabled ? (
          GROK_PROVIDERS.map((p) => (
            <button
              key={p.providerId}
              type="button"
              onClick={() => signIn(p.providerId, { callbackURL: "/" })}
              className="h-10 w-full rounded-md bg-accent text-sm text-accent-fg"
            >
              {t("continueWith", { p: p.label })}
            </button>
          ))
        ) : (
          <p className="text-sm text-muted">{t("loginOff")}</p>
        )}
        <Link to="/" className="block text-center text-xs text-faint hover:text-muted">
          {t("skipLogin")}
        </Link>
      </div>
    </main>
  );
}
