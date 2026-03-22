import { Slider } from "@/components/ui/slider";
import {
  AlignJustify,
  ArrowLeft,
  Bot,
  Download,
  Filter,
  Maximize2,
  Music,
  Pause,
  Play,
  RotateCw,
  Scissors,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Sparkles,
  Type,
  Upload,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useRef, useState } from "react";

interface Props {
  onBack: () => void;
}

type Tool =
  | "cut"
  | "trim"
  | "split"
  | "text"
  | "audio"
  | "effects"
  | "filters"
  | "speed"
  | "rotate"
  | "adjust"
  | "ai"
  | "export"
  | null;

const tools: {
  id: Tool;
  label: string;
  Icon: React.ComponentType<{ size?: number }>;
}[] = [
  { id: "cut", label: "Cut", Icon: Scissors },
  { id: "trim", label: "Trim", Icon: AlignJustify },
  { id: "text", label: "Text", Icon: Type },
  { id: "audio", label: "Audio", Icon: Music },
  { id: "effects", label: "Effects", Icon: Sparkles },
  { id: "filters", label: "Filters", Icon: Filter },
  { id: "speed", label: "Speed", Icon: Zap },
  { id: "rotate", label: "Rotate", Icon: RotateCw },
  { id: "adjust", label: "Adjust", Icon: SlidersHorizontal },
  { id: "ai", label: "AI", Icon: Bot },
  { id: "export", label: "Export", Icon: Upload },
];

const videoClips = [
  { id: 1, label: "Clip 1", width: 120, color: "#1d4ed8" },
  { id: 2, label: "Clip 2", width: 80, color: "#2563eb" },
  { id: 3, label: "Clip 3", width: 100, color: "#3b82f6" },
];

const audioClips = [
  { id: 1, label: "BGM", width: 220, color: "#059669" },
  { id: 2, label: "SFX", width: 60, color: "#10b981" },
];

const textClips = [
  { id: 1, label: "Title", width: 80, color: "#7c3aed" },
  { id: 2, label: "Caption", width: 100, color: "#8b5cf6" },
];

const timeMarks = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export default function EditorScreen({ onBack }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(1.8);
  const [activeTool, setActiveTool] = useState<Tool>(null);
  const [filterValue, setFilterValue] = useState([50]);
  const [brightnessValue, setBrightnessValue] = useState([60]);
  const [speedValue, setSpeedValue] = useState([1]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const totalTime = 8.0;

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleToolClick = (id: Tool) => {
    setActiveTool((prev) => (prev === id ? null : id));
  };

  const renderToolPanel = () => {
    if (!activeTool) return null;
    return (
      <div
        className="px-4 py-4 border-t"
        style={{ background: "#111", borderColor: "#2a2a2a" }}
      >
        {activeTool === "filters" && (
          <div data-ocid="editor.filters.panel">
            <p
              className="text-xs font-semibold mb-3"
              style={{ color: "#9ca3af" }}
            >
              FILTER INTENSITY
            </p>
            <Slider
              value={filterValue}
              onValueChange={setFilterValue}
              min={0}
              max={100}
              step={1}
              className="mb-3"
            />
            <div className="flex gap-2 overflow-x-auto pb-1">
              {["None", "Vivid", "Matte", "Noir", "Chrome", "Fade"].map((f) => (
                <button
                  type="button"
                  key={f}
                  className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{
                    background: f === "Vivid" ? "#2563eb" : "#1c1c1e",
                    color: "#fff",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}
        {activeTool === "adjust" && (
          <div data-ocid="editor.adjust.panel">
            <p
              className="text-xs font-semibold mb-3"
              style={{ color: "#9ca3af" }}
            >
              BRIGHTNESS
            </p>
            <Slider
              value={brightnessValue}
              onValueChange={setBrightnessValue}
              min={0}
              max={100}
              step={1}
              className="mb-3"
            />
            <p
              className="text-xs font-semibold mb-3"
              style={{ color: "#9ca3af" }}
            >
              CONTRAST
            </p>
            <Slider
              defaultValue={[50]}
              min={0}
              max={100}
              step={1}
              className="mb-3"
            />
            <p
              className="text-xs font-semibold mb-3"
              style={{ color: "#9ca3af" }}
            >
              SATURATION
            </p>
            <Slider defaultValue={[50]} min={0} max={100} step={1} />
          </div>
        )}
        {activeTool === "speed" && (
          <div data-ocid="editor.speed.panel">
            <p
              className="text-xs font-semibold mb-3"
              style={{ color: "#9ca3af" }}
            >
              SPEED
            </p>
            <div className="flex gap-2 justify-center">
              {[0.25, 0.5, 1, 1.5, 2, 4].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSpeedValue([s])}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                  style={{
                    background: speedValue[0] === s ? "#2563eb" : "#1c1c1e",
                    color: speedValue[0] === s ? "#fff" : "#9ca3af",
                  }}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        )}
        {activeTool === "text" && (
          <div data-ocid="editor.text.panel">
            <input
              className="w-full px-3 py-2 rounded-xl text-sm text-white"
              style={{ background: "#1c1c1e", border: "1px solid #2a2a2a" }}
              placeholder="Enter text overlay..."
              data-ocid="editor.text.input"
            />
            <div className="flex gap-2 mt-3">
              {["Regular", "Bold", "Italic", "Outline"].map((s) => (
                <button
                  type="button"
                  key={s}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{
                    background: s === "Bold" ? "#2563eb" : "#1c1c1e",
                    color: "#fff",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {activeTool === "audio" && (
          <div data-ocid="editor.audio.panel">
            <p
              className="text-xs font-semibold mb-3"
              style={{ color: "#9ca3af" }}
            >
              VOLUME
            </p>
            <Slider
              defaultValue={[80]}
              min={0}
              max={100}
              step={1}
              className="mb-3"
            />
            <div className="flex gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-medium"
                style={{ background: "#2563eb", color: "#fff" }}
              >
                Add Music
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-medium"
                style={{ background: "#1c1c1e", color: "#9ca3af" }}
              >
                Record Voice
              </button>
            </div>
          </div>
        )}
        {activeTool === "effects" && (
          <div data-ocid="editor.effects.panel">
            <div className="grid grid-cols-4 gap-2">
              {[
                "Blur",
                "Glow",
                "Shake",
                "Zoom",
                "Flash",
                "Glitch",
                "Mirror",
                "Vignette",
              ].map((e) => (
                <button
                  type="button"
                  key={e}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl"
                  style={{ background: "#1c1c1e" }}
                >
                  <div
                    className="w-8 h-8 rounded-lg"
                    style={{ background: "#2a2a2a" }}
                  />
                  <span className="text-[10px] text-white">{e}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {activeTool === "export" && (
          <div data-ocid="editor.export.panel">
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                }}
                data-ocid="editor.export.button"
              >
                Export 1080p
              </button>
              <button
                type="button"
                className="px-4 py-3 rounded-xl text-sm font-medium"
                style={{ background: "#1c1c1e", color: "#9ca3af" }}
              >
                Settings
              </button>
            </div>
          </div>
        )}
        {(activeTool === "cut" ||
          activeTool === "trim" ||
          activeTool === "split") && (
          <div data-ocid="editor.cut.panel">
            <p className="text-xs mb-3" style={{ color: "#9ca3af" }}>
              Select a clip in the timeline, then apply the action
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-sm font-medium text-white"
                style={{ background: "#2563eb" }}
              >
                Apply {activeTool}
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: "#1c1c1e", color: "#9ca3af" }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {activeTool === "rotate" && (
          <div data-ocid="editor.rotate.panel">
            <div className="flex gap-3 justify-center">
              {["90°", "180°", "270°", "Flip H", "Flip V"].map((r) => (
                <button
                  type="button"
                  key={r}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-white"
                  style={{ background: "#1c1c1e" }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}
        {activeTool === "ai" && (
          <div data-ocid="editor.ai.panel">
            <div className="flex gap-2 overflow-x-auto">
              {["Auto Captions", "BG Remove", "Smart Cut", "Enhance"].map(
                (a) => (
                  <button
                    type="button"
                    key={a}
                    className="shrink-0 px-3 py-2 rounded-xl text-xs font-medium text-white flex items-center gap-1.5"
                    style={{ background: "#1d4ed8" }}
                  >
                    <Sparkles size={12} /> {a}
                  </button>
                ),
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "#000" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-10 pb-3 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2"
          data-ocid="editor.back.button"
        >
          <ArrowLeft size={22} className="text-white" />
        </button>
        <span className="text-sm font-semibold text-white">My Project</span>
        <button
          type="button"
          className="px-4 py-1.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #1d4ed8, #3b82f6)" }}
          data-ocid="editor.export_top.button"
        >
          Export
        </button>
      </div>

      {/* Video Preview */}
      <div className="px-4 mb-3 shrink-0">
        <div
          className="relative rounded-2xl overflow-hidden flex items-center justify-center"
          style={{
            aspectRatio: "16/9",
            background: "#0a0a0a",
            border: "1px solid #1c1c1e",
          }}
        >
          {/* Fake video content */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
            }}
          />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Center indicator */}
          <div
            className="absolute top-0 bottom-0 left-1/2 w-px"
            style={{ background: "rgba(239,68,68,0.6)" }}
          />
          {/* Play button */}
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="relative z-10 flex items-center justify-center rounded-full"
            style={{
              width: 48,
              height: 48,
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
            }}
            data-ocid="editor.play.button"
          >
            {isPlaying ? (
              <Pause size={22} className="text-white" fill="white" />
            ) : (
              <Play size={22} className="text-white ml-0.5" fill="white" />
            )}
          </button>
          {/* Time indicator */}
          <div
            className="absolute bottom-2 left-3 text-xs font-mono font-medium px-2 py-0.5 rounded-md"
            style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}
          >
            {formatTime(currentTime)} / {formatTime(totalTime)}
          </div>
        </div>
      </div>

      {/* Transport Controls */}
      <div className="flex items-center justify-center gap-5 mb-3 px-4 shrink-0">
        <button
          type="button"
          onClick={() => setCurrentTime(0)}
          data-ocid="editor.skip_back.button"
        >
          <SkipBack size={20} style={{ color: "#9ca3af" }} />
        </button>
        <button
          type="button"
          onClick={() => setIsPlaying((p) => !p)}
          className="flex items-center justify-center rounded-full"
          style={{ width: 44, height: 44, background: "#1c1c1e" }}
          data-ocid="editor.playpause.button"
        >
          {isPlaying ? (
            <Pause size={20} className="text-white" fill="white" />
          ) : (
            <Play size={20} className="text-white ml-0.5" fill="white" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setCurrentTime(totalTime)}
          data-ocid="editor.skip_forward.button"
        >
          <SkipForward size={20} style={{ color: "#9ca3af" }} />
        </button>
        <button
          type="button"
          onClick={() => setIsMuted((m) => !m)}
          className="ml-2"
          data-ocid="editor.mute.toggle"
        >
          {isMuted ? (
            <VolumeX size={18} style={{ color: "#9ca3af" }} />
          ) : (
            <Volume2 size={18} style={{ color: "#9ca3af" }} />
          )}
        </button>
        <button
          type="button"
          className="ml-auto"
          data-ocid="editor.fullscreen.button"
        >
          <Maximize2 size={18} style={{ color: "#9ca3af" }} />
        </button>
      </div>

      {/* Timeline */}
      <div
        className="shrink-0 mb-2"
        style={{
          background: "#0a0a0a",
          borderTop: "1px solid #1c1c1e",
          borderBottom: "1px solid #1c1c1e",
        }}
      >
        <div
          ref={timelineRef}
          className="timeline-scroll"
          style={{ overflowX: "auto" }}
        >
          <div style={{ minWidth: 700, padding: "8px 16px" }}>
            {/* Time ruler */}
            <div
              className="flex items-end mb-2"
              style={{ height: 20, paddingLeft: 60 }}
            >
              {timeMarks.map((t) => (
                <div
                  key={t}
                  style={{ width: 80, flexShrink: 0, position: "relative" }}
                >
                  <span
                    className="text-[9px] font-mono absolute"
                    style={{ color: "#4b5563", left: 0 }}
                  >
                    {t}s
                  </span>
                  <div
                    className="absolute bottom-0 left-0 w-px h-2"
                    style={{ background: "#2a2a2a" }}
                  />
                </div>
              ))}
            </div>
            {/* Playhead */}
            <div className="relative" style={{ height: 120 }}>
              <div
                className="absolute top-0 bottom-0 w-px z-10"
                style={{
                  left: `${60 + (currentTime / totalTime) * 640}px`,
                  background: "rgba(255,255,255,0.8)",
                }}
              >
                <div
                  className="w-2 h-2 rounded-full -ml-[3px] -mt-1"
                  style={{ background: "#fff" }}
                />
              </div>
              {/* Video track */}
              <div className="flex items-center mb-1.5">
                <span
                  className="text-[9px] font-medium shrink-0 mr-2"
                  style={{ color: "#4b5563", width: 44, textAlign: "right" }}
                >
                  VIDEO
                </span>
                <div className="flex gap-1">
                  {videoClips.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-md flex items-center justify-start px-2 cursor-pointer transition-opacity hover:opacity-80"
                      style={{
                        width: c.width,
                        height: 30,
                        background: c.color,
                        flexShrink: 0,
                      }}
                    >
                      <span className="text-[10px] font-medium text-white truncate">
                        {c.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Audio track */}
              <div className="flex items-center mb-1.5">
                <span
                  className="text-[9px] font-medium shrink-0 mr-2"
                  style={{ color: "#4b5563", width: 44, textAlign: "right" }}
                >
                  AUDIO
                </span>
                <div className="flex gap-1">
                  {audioClips.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-md flex items-center justify-start px-2 cursor-pointer transition-opacity hover:opacity-80"
                      style={{
                        width: c.width,
                        height: 30,
                        background: c.color,
                        flexShrink: 0,
                      }}
                    >
                      <span className="text-[10px] font-medium text-white truncate">
                        {c.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Text track */}
              <div className="flex items-center">
                <span
                  className="text-[9px] font-medium shrink-0 mr-2"
                  style={{ color: "#4b5563", width: 44, textAlign: "right" }}
                >
                  TEXT
                </span>
                <div className="flex gap-1">
                  {textClips.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-md flex items-center justify-start px-2 cursor-pointer transition-opacity hover:opacity-80"
                      style={{
                        width: c.width,
                        height: 30,
                        background: c.color,
                        flexShrink: 0,
                      }}
                    >
                      <span className="text-[10px] font-medium text-white truncate">
                        {c.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tool panel */}
      {activeTool && renderToolPanel()}

      {/* Bottom Toolbar */}
      <div
        className="shrink-0 overflow-x-auto"
        style={{ background: "#111", borderTop: "1px solid #2a2a2a" }}
      >
        <div
          className="flex items-center gap-1 px-3 py-3"
          style={{ minWidth: "max-content" }}
        >
          {tools.map(({ id, label, Icon }) => (
            <button
              type="button"
              key={id}
              onClick={() => handleToolClick(id)}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl tool-pill"
              style={{
                background: activeTool === id ? "#2563eb" : "#1c1c1e",
                color: activeTool === id ? "#fff" : "#9ca3af",
                minWidth: 56,
              }}
              data-ocid={`editor.tool.${id}`}
            >
              <Icon size={18} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
