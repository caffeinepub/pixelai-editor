import {
  ChevronRight,
  Crown,
  Download,
  LogOut,
  Settings,
  Share2,
  Star,
} from "lucide-react";

const stats = [
  { label: "Projects", value: "24" },
  { label: "Exports", value: "156" },
  { label: "AI Credits", value: "847" },
];

const menuItems = [
  {
    icon: Crown,
    label: "Upgrade to Pro",
    desc: "Unlock all AI tools & 4K export",
    accent: true,
  },
  { icon: Star, label: "Saved Templates", desc: "12 templates saved" },
  { icon: Download, label: "Export History", desc: "156 exports total" },
  {
    icon: Share2,
    label: "Share PIXELAI",
    desc: "Invite friends & get credits",
  },
  { icon: Settings, label: "Settings", desc: "App preferences & account" },
];

export default function ProfileScreen() {
  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#000", overflowY: "auto" }}
    >
      {/* Header */}
      <div className="pt-12 pb-6 px-4">
        <h1 className="text-xl font-bold text-white mb-6 font-display">
          Profile
        </h1>
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div
            className="rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
            style={{
              width: 64,
              height: 64,
              background: "linear-gradient(135deg, #1d4ed8, #7c3aed)",
            }}
          >
            P
          </div>
          <div>
            <div className="text-base font-bold text-white">Creator Pro</div>
            <div className="text-sm" style={{ color: "#4b5563" }}>
              creator@pixelai.app
            </div>
            <div
              className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{ background: "#f59e0b22", color: "#f59e0b" }}
            >
              <Crown size={10} /> FREE PLAN
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 px-4 mb-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center py-3 rounded-2xl"
            style={{ background: "#111" }}
          >
            <span className="text-xl font-bold text-white">{s.value}</span>
            <span className="text-[10px]" style={{ color: "#4b5563" }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="px-4 flex flex-col gap-2">
        {menuItems.map((item, i) => (
          <button
            type="button"
            key={item.label}
            className="flex items-center gap-3 p-4 rounded-2xl text-left w-full transition-opacity active:opacity-70"
            style={{
              background: item.accent
                ? "linear-gradient(135deg, #1d4ed8, #7c3aed)"
                : "#111",
              border: item.accent ? "none" : "1px solid #1c1c1e",
            }}
            data-ocid={`profile.menu.item.${i + 1}`}
          >
            <div
              className="flex items-center justify-center rounded-xl shrink-0"
              style={{
                width: 40,
                height: 40,
                background: item.accent ? "rgba(255,255,255,0.15)" : "#1c1c1e",
              }}
            >
              <item.icon
                size={18}
                style={{ color: item.accent ? "#fff" : "#9ca3af" }}
              />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold" style={{ color: "#fff" }}>
                {item.label}
              </div>
              <div
                className="text-xs"
                style={{
                  color: item.accent ? "rgba(255,255,255,0.6)" : "#4b5563",
                }}
              >
                {item.desc}
              </div>
            </div>
            <ChevronRight
              size={16}
              style={{
                color: item.accent ? "rgba(255,255,255,0.5)" : "#2a2a2a",
              }}
            />
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="px-4 mt-4 mb-6">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium"
          style={{
            background: "#111",
            color: "#ef4444",
            border: "1px solid #1c1c1e",
          }}
          data-ocid="profile.logout.button"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      {/* Footer */}
      <footer className="text-center pb-4">
        <p className="text-xs" style={{ color: "#4b5563" }}>
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="underline"
            style={{ color: "#3b82f6" }}
            target="_blank"
            rel="noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
