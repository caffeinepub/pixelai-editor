import type { Screen } from "@/App";
import { Grid2X2, Home, Sparkles, User, Video } from "lucide-react";

interface Props {
  active: Screen;
  onNavigate: (s: Screen) => void;
}

const tabs: {
  id: Screen;
  label: string;
  Icon: React.ComponentType<{
    size?: number;
    className?: string;
    style?: React.CSSProperties;
  }>;
}[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "templates", label: "Templates", Icon: Grid2X2 },
  { id: "editor", label: "Editor", Icon: Video },
  { id: "ai", label: "AI Tools", Icon: Sparkles },
  { id: "profile", label: "Profile", Icon: User },
];

export default function BottomNav({ active, onNavigate }: Props) {
  return (
    <nav
      className="flex items-center justify-around px-2 py-2 shrink-0"
      style={{
        background: "#111111",
        borderTop: "1px solid #2a2a2a",
        paddingBottom: "env(safe-area-inset-bottom, 8px)",
      }}
      data-ocid="app.tab"
    >
      {tabs.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            type="button"
            key={id}
            onClick={() => onNavigate(id)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200"
            style={{ minWidth: 56 }}
            data-ocid={`nav.${id}.button`}
          >
            {id === "editor" ? (
              <div
                className="flex items-center justify-center rounded-xl mb-0.5"
                style={{
                  width: 44,
                  height: 32,
                  background: isActive
                    ? "linear-gradient(135deg, #1d4ed8, #3b82f6)"
                    : "#1c1c1e",
                  boxShadow: isActive ? "0 0 12px rgba(37,99,235,0.4)" : "none",
                  transition: "all 0.2s",
                }}
              >
                <Icon size={18} className="text-white" />
              </div>
            ) : (
              <Icon
                size={22}
                className="transition-colors duration-200"
                style={{ color: isActive ? "#3b82f6" : "#4b5563" }}
              />
            )}
            <span
              className="text-[10px] font-medium tracking-wide transition-colors duration-200"
              style={{ color: isActive ? "#3b82f6" : "#4b5563" }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
