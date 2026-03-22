import type { Screen } from "@/App";
import {
  Bell,
  Captions,
  ChevronRight,
  Mic,
  Play,
  Plus,
  Scissors,
  Sparkles,
  Type,
  Wand2,
  Zap,
} from "lucide-react";

const recentProjects = [
  {
    id: 1,
    title: "Summer Vlog 2026",
    duration: "2:34",
    date: "Today",
    gradient: "linear-gradient(135deg, #1d4ed8, #7c3aed)",
  },
  {
    id: 2,
    title: "Product Launch",
    duration: "1:15",
    date: "Yesterday",
    gradient: "linear-gradient(135deg, #7c3aed, #ec4899)",
  },
  {
    id: 3,
    title: "Travel Montage",
    duration: "3:42",
    date: "Mar 20",
    gradient: "linear-gradient(135deg, #ea580c, #f59e0b)",
  },
  {
    id: 4,
    title: "Birthday Reel",
    duration: "0:58",
    date: "Mar 18",
    gradient: "linear-gradient(135deg, #059669, #0ea5e9)",
  },
];

const templatePreviews = [
  {
    id: 1,
    title: "Cinematic",
    badge: "Trending",
    gradient: "linear-gradient(135deg, #0f172a, #1e3a5f, #0ea5e9)",
  },
  {
    id: 2,
    title: "TikTok Viral",
    badge: "New",
    gradient: "linear-gradient(135deg, #1a0533, #7c3aed, #ec4899)",
  },
  {
    id: 3,
    title: "YouTube Intro",
    badge: "Hot",
    gradient: "linear-gradient(135deg, #7f1d1d, #ef4444, #f59e0b)",
  },
  {
    id: 4,
    title: "Instagram Reel",
    badge: "Popular",
    gradient: "linear-gradient(135deg, #0c2a1a, #059669, #34d399)",
  },
];

const aiTools = [
  {
    icon: Captions,
    name: "Auto Captions",
    desc: "Generate subtitles automatically",
    color: "#3b82f6",
  },
  {
    icon: Wand2,
    name: "BG Remover",
    desc: "Remove background instantly",
    color: "#8b5cf6",
  },
  {
    icon: Mic,
    name: "Voice AI",
    desc: "Clone & transform your voice",
    color: "#ec4899",
  },
  {
    icon: Scissors,
    name: "Auto Cut",
    desc: "Smart scene detection",
    color: "#f59e0b",
  },
  {
    icon: Type,
    name: "Subtitle Gen",
    desc: "Multi-language subtitles",
    color: "#10b981",
  },
  {
    icon: Zap,
    name: "Text to Video",
    desc: "Generate clips from text",
    color: "#ef4444",
  },
];

interface Props {
  onNavigate: (s: Screen) => void;
}

export default function HomeScreen({ onNavigate }: Props) {
  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#000", overflowY: "auto" }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4">
        <h1 className="text-2xl font-bold font-display gradient-text">
          PIXELAI
        </h1>
        <button
          type="button"
          className="relative flex items-center justify-center rounded-full"
          style={{ width: 40, height: 40, background: "#111" }}
          data-ocid="home.notification.button"
        >
          <Bell size={20} className="text-white" />
          <span
            className="absolute top-2 right-2 rounded-full"
            style={{ width: 7, height: 7, background: "#3b82f6" }}
          />
        </button>
      </div>

      {/* New Project Button */}
      <div className="px-4 mb-6">
        <button
          type="button"
          onClick={() => onNavigate("editor")}
          className="w-full rounded-2xl py-5 flex items-center gap-4 relative overflow-hidden card-hover"
          style={{
            background: "linear-gradient(135deg, #1d4ed8, #2563eb, #3b82f6)",
            boxShadow: "0 4px 24px rgba(37,99,235,0.4)",
          }}
          data-ocid="home.new_project.button"
        >
          <div
            className="flex items-center justify-center rounded-xl ml-4"
            style={{
              width: 48,
              height: 48,
              background: "rgba(255,255,255,0.15)",
            }}
          >
            <Plus size={28} className="text-white" />
          </div>
          <div className="text-left">
            <div className="text-lg font-bold text-white">New Project</div>
            <div className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
              Start creating your video
            </div>
          </div>
          <div
            className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none"
            style={{
              background:
                "linear-gradient(270deg, rgba(255,255,255,0.08), transparent)",
            }}
          />
        </button>
      </div>

      {/* Recent Projects */}
      <section className="mb-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-base font-semibold text-white">
            Recent Projects
          </h2>
          <button
            type="button"
            className="text-sm flex items-center gap-1"
            style={{ color: "#3b82f6" }}
            data-ocid="home.recent.link"
          >
            See all <ChevronRight size={14} />
          </button>
        </div>
        <div
          className="flex gap-3 px-4 overflow-x-auto pb-1"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {recentProjects.map((p, i) => (
            <button
              type="button"
              key={p.id}
              onClick={() => onNavigate("editor")}
              className="shrink-0 card-hover"
              style={{ scrollSnapAlign: "start" }}
              data-ocid={`home.recent.item.${i + 1}`}
            >
              <div
                className="rounded-xl overflow-hidden"
                style={{ width: 140, background: "#111" }}
              >
                <div
                  className="relative flex items-end justify-start p-2"
                  style={{ width: 140, height: 88, background: p.gradient }}
                >
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-md"
                    style={{ background: "rgba(0,0,0,0.5)", color: "#fff" }}
                  >
                    {p.duration}
                  </span>
                </div>
                <div className="px-2 py-2">
                  <div className="text-xs font-medium text-white truncate">
                    {p.title}
                  </div>
                  <div className="text-xs" style={{ color: "#4b5563" }}>
                    {p.date}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Templates */}
      <section className="mb-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-base font-semibold text-white">Templates</h2>
          <button
            type="button"
            className="text-sm flex items-center gap-1"
            style={{ color: "#3b82f6" }}
            onClick={() => onNavigate("templates")}
            data-ocid="home.templates.link"
          >
            See all <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto pb-1">
          {templatePreviews.map((t, i) => (
            <button
              type="button"
              key={t.id}
              onClick={() => onNavigate("templates")}
              className="shrink-0 card-hover"
              data-ocid={`home.template.item.${i + 1}`}
            >
              <div
                className="rounded-xl overflow-hidden relative"
                style={{ width: 120, height: 80, background: t.gradient }}
              >
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.2)" }}
                >
                  <div
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: 28,
                      height: 28,
                      background: "rgba(255,255,255,0.25)",
                    }}
                  >
                    <Play
                      size={12}
                      className="text-white ml-0.5"
                      fill="white"
                    />
                  </div>
                </div>
                <span
                  className="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                  style={{ background: "#3b82f6", color: "#fff" }}
                >
                  {t.badge}
                </span>
              </div>
              <div className="text-xs font-medium text-white mt-1.5 text-left">
                {t.title}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* AI Tools */}
      <section className="mb-6 px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-white">AI Tools</h2>
          <button
            type="button"
            className="text-sm flex items-center gap-1"
            style={{ color: "#3b82f6" }}
            onClick={() => onNavigate("ai")}
            data-ocid="home.aitools.link"
          >
            See all <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {aiTools.map((tool, i) => (
            <button
              type="button"
              key={tool.name}
              onClick={() => onNavigate("ai")}
              className="flex flex-col items-center gap-2 p-3 rounded-xl card-hover"
              style={{ background: "#111" }}
              data-ocid={`home.aitool.item.${i + 1}`}
            >
              <div
                className="flex items-center justify-center rounded-xl"
                style={{ width: 40, height: 40, background: `${tool.color}22` }}
              >
                <tool.icon size={20} style={{ color: tool.color }} />
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold text-white leading-tight">
                  {tool.name}
                </div>
                <div
                  className="text-[10px] leading-tight mt-0.5"
                  style={{ color: "#4b5563" }}
                >
                  {tool.desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center pb-4 pt-2">
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
