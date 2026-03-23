import {
  Activity,
  ArrowUpCircle,
  Brush,
  Camera,
  Captions,
  Cloud,
  Eraser,
  Mic,
  Music,
  Palette,
  Scissors,
  Sparkles,
  Star,
  Wand2,
  Wind,
  Zap,
  ZoomIn,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ToolCategory = "All" | "Enhance" | "Creative" | "Audio";

const aiTools = [
  {
    icon: Captions,
    name: "Auto Captions",
    desc: "Automatically generate accurate subtitles and captions for your videos in 50+ languages with AI-powered speech recognition.",
    color: "#3b82f6",
    bg: "#1d4ed822",
    badge: "Popular",
    category: ["Enhance"] as ToolCategory[],
  },
  {
    icon: Wand2,
    name: "Background Remover",
    desc: "Instantly remove or replace backgrounds with AI matting technology. No green screen needed.",
    color: "#8b5cf6",
    bg: "#7c3aed22",
    badge: "New",
    category: ["Creative"] as ToolCategory[],
  },
  {
    icon: Mic,
    name: "Voice AI",
    desc: "Clone, transform, or generate voices. Choose from 30+ AI voice styles or clone your own voice.",
    color: "#ec4899",
    bg: "#db277722",
    badge: null,
    category: ["Audio"] as ToolCategory[],
  },
  {
    icon: Scissors,
    name: "Auto Cut",
    desc: "AI detects scene changes, beats, and highlights to automatically cut and assemble your footage.",
    color: "#f59e0b",
    bg: "#d9770622",
    badge: null,
    category: ["Enhance"] as ToolCategory[],
  },
  {
    icon: ZoomIn,
    name: "Smart Zoom",
    desc: "Automatically track subjects and apply dynamic zoom effects to keep your viewer engaged.",
    color: "#10b981",
    bg: "#05966922",
    badge: "Beta",
    category: ["Creative"] as ToolCategory[],
  },
  {
    icon: Wind,
    name: "Noise Removal",
    desc: "Remove background noise, wind, and hum from your audio with advanced AI denoising.",
    color: "#06b6d4",
    bg: "#0891b222",
    badge: null,
    category: ["Enhance", "Audio"] as ToolCategory[],
  },
  {
    icon: Zap,
    name: "Text to Video",
    desc: "Describe a scene in text and watch AI generate a video clip for you in seconds.",
    color: "#ef4444",
    bg: "#dc262622",
    badge: "New",
    category: ["Creative"] as ToolCategory[],
  },
  {
    icon: Palette,
    name: "Color Grading AI",
    desc: "Match the cinematic color grade of famous films or let AI pick the perfect look for your footage.",
    color: "#a78bfa",
    bg: "#7c3aed22",
    badge: null,
    category: ["Creative"] as ToolCategory[],
  },
  {
    icon: Star,
    name: "Face Enhancement",
    desc: "Smooth skin, brighten eyes, and beautify portraits with adaptive AI skin retouching.",
    color: "#f472b6",
    bg: "#db277722",
    badge: "Popular",
    category: ["Enhance"] as ToolCategory[],
  },
  {
    icon: Cloud,
    name: "Sky Replacement",
    desc: "Swap out dull skies with stunning sunsets, starfields, or custom backgrounds automatically.",
    color: "#38bdf8",
    bg: "#0369a122",
    badge: "New",
    category: ["Creative"] as ToolCategory[],
  },
  {
    icon: Eraser,
    name: "Object Removal",
    desc: "Tap to select any object and AI will seamlessly erase it from your video, frame by frame.",
    color: "#fb923c",
    bg: "#c2410c22",
    badge: null,
    category: ["Creative"] as ToolCategory[],
  },
  {
    icon: Brush,
    name: "Style Transfer",
    desc: "Transform your footage into anime, oil painting, watercolor, or cinematic styles.",
    color: "#a78bfa",
    bg: "#6d28d922",
    badge: "New",
    category: ["Creative"] as ToolCategory[],
  },
  {
    icon: ArrowUpCircle,
    name: "Super Resolution",
    desc: "Upscale low-res footage to crisp 4K using AI-powered detail enhancement.",
    color: "#34d399",
    bg: "#06966922",
    badge: null,
    category: ["Enhance"] as ToolCategory[],
  },
  {
    icon: Camera,
    name: "Portrait Mode",
    desc: "Add real-time bokeh blur to backgrounds, keeping subjects in sharp focus.",
    color: "#f9a8d4",
    bg: "#be185d22",
    badge: "Beta",
    category: ["Creative"] as ToolCategory[],
  },
  {
    icon: Activity,
    name: "Video Stabilizer",
    desc: "Remove camera shake and jitter for silky smooth footage with one tap.",
    color: "#fbbf24",
    bg: "#b4530922",
    badge: null,
    category: ["Enhance"] as ToolCategory[],
  },
  {
    icon: Music,
    name: "AI Music Generator",
    desc: "Generate royalty-free background music that matches your video's mood and pacing.",
    color: "#60a5fa",
    bg: "#1d4ed822",
    badge: "New",
    category: ["Audio"] as ToolCategory[],
  },
];

const CATEGORIES: ToolCategory[] = ["All", "Enhance", "Creative", "Audio"];

function ToolCard({
  tool,
  index,
}: { tool: (typeof aiTools)[0]; index: number }) {
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const handleTryNow = () => {
    if (running) return;
    setRunning(true);
    setProgress(0);
    const duration = 2500;
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setRunning(false);
        startRef.current = null;
        setTimeout(() => setProgress(0), 600);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="rounded-2xl p-4 relative overflow-hidden transition-all duration-200"
      style={{
        background: "#111",
        border: `1px solid ${running ? `${tool.color}44` : "#1c1c1e"}`,
        boxShadow: running ? `0 0 16px ${tool.color}22` : "none",
      }}
      data-ocid={`ai.tool.item.${index + 1}`}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex items-center justify-center rounded-2xl shrink-0"
          style={{ width: 52, height: 52, background: tool.bg }}
        >
          <tool.icon size={26} style={{ color: tool.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-white">{tool.name}</span>
            {tool.badge && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                style={{ background: `${tool.color}33`, color: tool.color }}
              >
                {tool.badge}
              </span>
            )}
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "#9ca3af" }}>
            {tool.desc}
          </p>

          <div className="mt-3">
            <button
              type="button"
              onClick={handleTryNow}
              disabled={running}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white transition-all duration-200"
              style={{
                background: running ? `${tool.color}33` : `${tool.color}cc`,
                color: running ? tool.color : "#fff",
                minWidth: 88,
              }}
              data-ocid={`ai.tool.button.${index + 1}`}
            >
              {running ? "Processing..." : "Try Now"}
            </button>

            {/* Inline progress bar */}
            {(running || progress > 0) && (
              <div
                className="mt-2 rounded-full overflow-hidden"
                style={{ height: 3, background: "#1c1c1e" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-100"
                  style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${tool.color}88, ${tool.color})`,
                    boxShadow: `0 0 6px ${tool.color}88`,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AIScreen() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>("All");

  const filtered =
    activeCategory === "All"
      ? aiTools
      : aiTools.filter((t) => t.category.includes(activeCategory));

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#000", overflowY: "auto" }}
    >
      {/* Top bar */}
      <div className="px-4 pt-12 pb-4 shrink-0">
        <h1 className="text-xl font-bold text-white font-display">AI Tools</h1>
      </div>

      {/* Hero banner */}
      <div
        className="mx-4 mb-5 rounded-2xl p-5 relative overflow-hidden shrink-0"
        style={{
          background: "linear-gradient(135deg, #0f172a, #1d4ed8, #4f46e5)",
        }}
      >
        <div
          className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none"
          style={{
            background:
              "linear-gradient(270deg, rgba(139,92,246,0.3), transparent)",
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} className="text-blue-300" />
            <span
              className="text-xs font-semibold"
              style={{ color: "#93c5fd" }}
            >
              POWERED BY AI
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mb-1 font-display">
            Next-Gen Video Editing
          </h2>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            16 AI-powered tools to elevate your content creation workflow
          </p>
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="px-4 mb-4 shrink-0">
        <div
          className="flex gap-2 p-1 rounded-2xl"
          style={{ background: "#111", border: "1px solid #1c1c1e" }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
              style={{
                background:
                  activeCategory === cat
                    ? "linear-gradient(135deg, #7c3aed, #6d28d9)"
                    : "transparent",
                color: activeCategory === cat ? "#fff" : "#6b7280",
                boxShadow:
                  activeCategory === cat
                    ? "0 2px 8px rgba(124,58,237,0.4)"
                    : "none",
              }}
              data-ocid={"ai.filter.tab"}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tool cards */}
      <div className="px-4 flex flex-col gap-3 pb-8">
        {filtered.map((tool, i) => (
          <ToolCard key={tool.name} tool={tool} index={i} />
        ))}
      </div>
    </div>
  );
}
