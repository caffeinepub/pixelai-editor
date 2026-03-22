import type { Screen } from "@/App";
import { Play, Search } from "lucide-react";
import { useState } from "react";

const categories = [
  "Trending",
  "TikTok",
  "YouTube",
  "Reels",
  "Cinematic",
  "Vlog",
  "Tutorial",
];

const templates = [
  {
    id: 1,
    title: "Cinematic Opener",
    duration: "0:15",
    cat: "Cinematic",
    gradient: "linear-gradient(135deg, #0f172a, #1e3a5f, #0ea5e9)",
    uses: "12.4K",
  },
  {
    id: 2,
    title: "TikTok Dance",
    duration: "0:30",
    cat: "TikTok",
    gradient: "linear-gradient(135deg, #1a0533, #7c3aed, #ec4899)",
    uses: "8.2K",
  },
  {
    id: 3,
    title: "Vlog Intro",
    duration: "0:10",
    cat: "Vlog",
    gradient: "linear-gradient(135deg, #0c2a1a, #059669, #34d399)",
    uses: "5.7K",
  },
  {
    id: 4,
    title: "YouTube Banner",
    duration: "0:20",
    cat: "YouTube",
    gradient: "linear-gradient(135deg, #7f1d1d, #ef4444, #f59e0b)",
    uses: "9.1K",
  },
  {
    id: 5,
    title: "Instagram Reel",
    duration: "0:15",
    cat: "Reels",
    gradient: "linear-gradient(135deg, #1e1b4b, #7c3aed, #c026d3)",
    uses: "14.3K",
  },
  {
    id: 6,
    title: "Tutorial Intro",
    duration: "0:08",
    cat: "Tutorial",
    gradient: "linear-gradient(135deg, #1c1917, #78350f, #f59e0b)",
    uses: "3.2K",
  },
  {
    id: 7,
    title: "Neon City",
    duration: "0:12",
    cat: "Cinematic",
    gradient: "linear-gradient(135deg, #0a0a2e, #1d4ed8, #06b6d4)",
    uses: "7.8K",
  },
  {
    id: 8,
    title: "Viral Meme",
    duration: "0:07",
    cat: "TikTok",
    gradient: "linear-gradient(135deg, #450a0a, #dc2626, #fca5a5)",
    uses: "22.1K",
  },
  {
    id: 9,
    title: "Travel Montage",
    duration: "0:45",
    cat: "Vlog",
    gradient: "linear-gradient(135deg, #0c1a2e, #0369a1, #38bdf8)",
    uses: "6.4K",
  },
  {
    id: 10,
    title: "Product Launch",
    duration: "0:30",
    cat: "YouTube",
    gradient: "linear-gradient(135deg, #0f0f0f, #374151, #6b7280)",
    uses: "4.9K",
  },
  {
    id: 11,
    title: "Aesthetic Reel",
    duration: "0:15",
    cat: "Reels",
    gradient: "linear-gradient(135deg, #1a0a00, #92400e, #fbbf24)",
    uses: "11.2K",
  },
  {
    id: 12,
    title: "Coding Tutorial",
    duration: "1:00",
    cat: "Tutorial",
    gradient: "linear-gradient(135deg, #042f2e, #0f766e, #5eead4)",
    uses: "2.8K",
  },
];

interface Props {
  onNavigate?: (s: Screen) => void;
}

export default function TemplatesScreen({ onNavigate: _onNavigate }: Props) {
  const [activeCategory, setActiveCategory] = useState("Trending");

  const filtered =
    activeCategory === "Trending"
      ? templates
      : templates.filter((t) => t.cat === activeCategory);

  return (
    <div className="flex flex-col h-full" style={{ background: "#000" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4 shrink-0">
        <h1 className="text-xl font-bold text-white font-display">Templates</h1>
        <button
          type="button"
          className="flex items-center justify-center rounded-full"
          style={{ width: 40, height: 40, background: "#111" }}
          data-ocid="templates.search.button"
        >
          <Search size={18} className="text-white" />
        </button>
      </div>

      {/* Category tabs */}
      <div className="shrink-0 overflow-x-auto px-4 mb-4">
        <div className="flex gap-2" style={{ minWidth: "max-content" }}>
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 text-sm font-medium transition-colors rounded-xl"
              style={{
                color: activeCategory === cat ? "#fff" : "#4b5563",
                background: activeCategory === cat ? "#1c1c1e" : "transparent",
                borderBottom:
                  activeCategory === cat
                    ? "2px solid #3b82f6"
                    : "2px solid transparent",
              }}
              data-ocid={"templates.category.tab"}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Template grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-40"
            data-ocid="templates.empty_state"
          >
            <p className="text-sm" style={{ color: "#4b5563" }}>
              No templates in this category yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((t, i) => (
              <div
                key={t.id}
                className="rounded-2xl overflow-hidden card-hover"
                style={{ background: "#111" }}
                data-ocid={`templates.item.${i + 1}`}
              >
                {/* Thumbnail */}
                <div
                  className="relative"
                  style={{
                    aspectRatio: "9/16",
                    background: t.gradient,
                    maxHeight: 200,
                  }}
                >
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.15)" }}
                  >
                    <div
                      className="flex items-center justify-center rounded-full"
                      style={{
                        width: 36,
                        height: 36,
                        background: "rgba(255,255,255,0.2)",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <Play
                        size={16}
                        className="text-white ml-0.5"
                        fill="white"
                      />
                    </div>
                  </div>
                  <span
                    className="absolute bottom-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                    style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}
                  >
                    {t.duration}
                  </span>
                  <span
                    className="absolute top-2 left-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                    style={{ background: "#3b82f6", color: "#fff" }}
                  >
                    {t.cat}
                  </span>
                </div>
                {/* Info */}
                <div className="p-2.5">
                  <div className="text-xs font-semibold text-white mb-1">
                    {t.title}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px]" style={{ color: "#4b5563" }}>
                      {t.uses} uses
                    </span>
                    <button
                      type="button"
                      className="px-3 py-1 rounded-lg text-[10px] font-bold text-white"
                      style={{ background: "#2563eb" }}
                      data-ocid={`templates.use.button.${i + 1}`}
                    >
                      Use
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
