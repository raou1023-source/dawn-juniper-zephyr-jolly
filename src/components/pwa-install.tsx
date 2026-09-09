import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { useT } from "@/lib/use-t";
import { cn } from "@/lib/utils";

type PromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function PwaBoot() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const secure = window.isSecureContext;
    if (!secure) return;
    void navigator.serviceWorker.register("/sw.js");
  }, []);
  return <PwaInstallButton />;
}

function PwaInstallButton() {
  const t = useT();
  const [prompt, setPrompt] = useState<PromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator && Boolean((navigator as { standalone?: boolean }).standalone));
    if (standalone) {
      setInstalled(true);
      return;
    }
    const ua = navigator.userAgent;
    setIos(/iPhone|iPad|iPod/i.test(ua) && !/CriOS|FxiOS/i.test(ua));
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event as PromptEvent);
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
    const choice = await prompt.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setPrompt(null);
  }

  if (!prompt && !ios) return null;

  return (
    <button
      type="button"
      onClick={() => {
        if (prompt) void install();
        else window.alert(t("iosInstall"));
      }}
      className={cn(
        "inline-flex h-8 items-center gap-1 rounded-md bg-elevated px-2 text-xs text-muted hover:text-fg",
      )}
    >
      <Download className="size-3.5" />
      {t("install")}
    </button>
  );
}
