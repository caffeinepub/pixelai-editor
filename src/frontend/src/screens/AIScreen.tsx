import {
  Captions,
  Loader2,
  Mic,
  Palette,
  Scissors,
  Sparkles,
  Wand2,
  Wind,
  Zap,
  ZoomIn,
} from "lucide-react";
import { useState } from "react";

const aiTools = [
  {
    icon: Captions,
    name: "Auto Captions",
    desc: "Automatically generate accurate subtitles and captions for your videos in 50+ languages with AI-powered speech recognition.",
    color: "#3b82f6",
    bg: "#1d4ed822",
    badge: "Popular",
  },
  {
    icon: Wand2,
    name: "Background Remover",
    desc: "Instantly remove or replace backgrounds with AI matting technology. No green screen needed.",
    color: "#8b5cf6",
    bg: "#7c3aed22",
    badge: "New",
  },
  {
    icon: Mic,
    name: "Voice AI",
    desc: "Clone, transform, or generate voices. Choose from 30+ AI voice styles or clone your own voice.",
    color: "#ec4899",
    bg: "#db277722",
    badge: null,
  },
  {
    icon: Scissors,
    name: "Auto Cut",
    desc: "AI detects scene changes, beats, and highlights to automatically cut and assemble your footage.",
    color: "#f59e0b",
    bg: "#d9770622",
    badge: null,
  },
  {
    icon: ZoomIn,
    name: "Smart Zoom",
    desc: "Automatically track subjects and apply dynamic zoom effects to keep your viewer engaged.",
    color: "#10b981",
    bg: "#05966922",
    badge: "Beta",
  },
  {
    icon: Wind,
    name: "Noise Removal",
    desc: "Remove background noise, wind, and hum from your audio with advanced AI denoising.",
    color: "#06b6d4",
    bg: "#0891b222",
    badge: null,
  },
  {
    icon: Zap,
    name: "Text to Video",
    desc: "Describe a scene in text and watch AI generate a video clip for you in seconds.",
    color: "#ef4444",
    bg: "#dc262622",
    badge: "New",
  },
  {
    icon: Palette,
    name: "Color Grading AI",
    desc: "Match the cinematic color grade of famous films or let AI pick the perfect look for your footage.",
    color: "#a78bfa",
    bg: "#7c3aed22",
    badge: null,
  },
];

export default function AIScreen() {
  const [processing, setProcessing] = useState<string | null>(null);

  const handleTryNow = (name: string) => {
    setProcessing(name);
    setTimeout(() => setProcessing(null), 2500);
  };

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
        className="mx-4 mb-6 rounded-2xl p-5 relative overflow-hidden shrink-0"
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
            8 AI-powered tools to elevate your content creation workflow
          </p>
        </div>
      </div>

      {/* Tool cards */}
      <div className="px-4 flex flex-col gap-3 pb-6">
        {aiTools.map((tool, i) => (
          <div
            key={tool.name}
            className="rounded-2xl p-4 relative overflow-hidden"
            style={{ background: "#111", border: "1px solid #1c1c1e" }}
            data-ocid={`ai.tool.item.${i + 1}`}
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
                  <span className="text-sm font-bold text-white">
                    {tool.name}
                  </span>
                  {tool.badge && (
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                      style={{
                        background: `${tool.color}33`,
                        color: tool.color,
                      }}
                    >
                      {tool.badge}
                    </span>
                  )}
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "#9ca3af" }}
                >
                  {tool.desc}
                </p>
                <button
                  type="button"
                  onClick={() => handleTryNow(tool.name)}
                  disabled={processing === tool.name}
                  className="mt-3 px-4 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 transition-opacity"
                  style={{
                    background:
                      processing === tool.name ? "#1c1c1e" : "#2563eb",
                  }}
                  data-ocid={`ai.tool.button.${i + 1}`}
                >
                  {processing === tool.name ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Try Now"
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
