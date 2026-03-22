import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDeferredPrompt(null);
  };

  if (!deferredPrompt || dismissed) return null;

  return (
    <div
      className="flex items-center justify-between px-4 py-2 text-sm"
      style={{
        background: "linear-gradient(90deg, #4C1D95, #7C3AED)",
        color: "#fff",
      }}
      data-ocid="install.panel"
    >
      <span className="font-medium">
        ✨ Install PIXELAI Editor as an app for offline access
      </span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleInstall}
          className="px-3 py-1 rounded text-xs font-semibold transition-opacity hover:opacity-80"
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
          data-ocid="install.primary_button"
        >
          Install
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="hover:opacity-70 transition-opacity"
          data-ocid="install.close_button"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
