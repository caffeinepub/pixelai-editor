import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
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
  Plus,
  RotateCw,
  Scissors,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Type,
  Upload,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  EditorContext,
  type TextOverlay,
  useEditorStoreInternal,
} from "../hooks/useEditorStore";

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
  | "media"
  | null;

const tools: {
  id: Tool;
  label: string;
  Icon: React.ComponentType<{ size?: number }>;
}[] = [
  { id: "media", label: "Media", Icon: Download },
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

const FILTER_CSS: Record<string, string> = {
  None: "",
  Cinematic: "contrast(1.2) saturate(0.85) brightness(0.95)",
  Retro: "sepia(0.5) contrast(1.1) brightness(0.9)",
  Bright: "brightness(1.3) saturate(1.2)",
  Vintage: "sepia(0.3) contrast(0.9) brightness(1.05) saturate(0.8)",
  Noir: "grayscale(1) contrast(1.3)",
  Warm: "sepia(0.25) saturate(1.3) brightness(1.05)",
  Cool: "hue-rotate(20deg) saturate(1.1) brightness(1.0)",
};

const timeMarks = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
const TIMELINE_PX_PER_SEC = 60;

function EditorScreenInner({ onBack }: Props) {
  const store = useEditorStoreInternal();
  const {
    clips,
    setClips,
    audioTracks,
    textOverlays,
    setTextOverlays,
    mediaFiles,
    addMediaFile,
    activeClipUrl,
    setActiveClipUrl,
    selectedClipId,
    setSelectedClipId,
    currentTime,
    duration,
    isPlaying,
    togglePlay,
    seekTo,
    activeFilter,
    setActiveFilter,
    exportSettings,
    setExportSettings,
    autoCut,
    setAutoCut,
    bgRemoval,
    setBgRemoval,
    beatSync,
    setBeatSync,
    noiseRemoval,
    setNoiseRemoval,
    clipSpeed,
    setClipSpeed,
    rotation,
    setRotation,
    flipH,
    setFlipH,
    flipV,
    setFlipV,
    masterVolume,
    setMasterVolume,
    splitClipAt,
    deleteClip,
  } = store;

  const [isMuted, setIsMuted] = useState(false);
  const [activeTool, setActiveTool] = useState<Tool>(null);
  // Adjust panel state
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  // Text panel
  const [textInput, setTextInput] = useState("");
  const [textStyle, setTextStyle] = useState("Regular");
  // Export state
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Sync video element with store
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (activeClipUrl) {
      if (video.src !== activeClipUrl) {
        video.src = activeClipUrl;
        video.load();
      }
    } else {
      video.src = "";
    }
  }, [activeClipUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeClipUrl) return;
    if (isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isPlaying, activeClipUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeClipUrl) return;
    if (Math.abs(video.currentTime - currentTime) > 0.3) {
      video.currentTime = currentTime;
    }
  }, [currentTime, activeClipUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = clipSpeed;
  }, [clipSpeed]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = isMuted ? 0 : masterVolume / 100;
  }, [masterVolume, isMuted]);

  // Build CSS transform
  const videoTransform = [
    `rotate(${rotation}deg)`,
    flipH ? "scaleX(-1)" : "",
    flipV ? "scaleY(-1)" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Build CSS filter (combined: active filter preset + adjustment sliders)
  const filterPresetCSS = activeFilter ? (FILTER_CSS[activeFilter] ?? "") : "";
  const adjustCSS = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
  const videoFilter = [filterPresetCSS, adjustCSS].filter(Boolean).join(" ");

  // Active text overlays for current time
  const activeTextOverlays = textOverlays.filter(
    (t) => currentTime >= t.start && currentTime < t.start + t.duration,
  );

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleToolClick = (id: Tool) => {
    setActiveTool((prev) => (prev === id ? null : id));
  };

  const handleMediaFileAdd = async (files: FileList | null) => {
    if (!files) return;
    for (const file of Array.from(files)) {
      await addMediaFile(file);
    }
  };

  const handleAddToTimeline = (mediaId: string) => {
    const mf = mediaFiles.find((m) => m.id === mediaId);
    if (!mf) return;
    setActiveClipUrl(mf.url);
    setClips((prev) => [
      ...prev,
      {
        id: `c_${mediaId}`,
        name: mf.name,
        track: "v1",
        start: prev.reduce((acc, c) => Math.max(acc, c.start + c.duration), 0),
        duration: mf.duration || 5,
        color: "#1A2A3A",
        mediaId,
      },
    ]);
  };

  const handleAddText = () => {
    if (!textInput.trim()) return;
    const overlay: TextOverlay = {
      id: `t_${Date.now()}`,
      text: textInput,
      track: "text",
      start: currentTime,
      duration: 3,
      font: textStyle === "Bold" ? "Montserrat" : "Inter",
      size: 36,
      color: "#FFFFFF",
      position: "center",
      animation: "Fade In",
    };
    setTextOverlays([...textOverlays, overlay]);
    setTextInput("");
    toast.success("Text overlay added");
  };

  const handleExport = () => {
    if (exporting) return;
    setExporting(true);
    setExportProgress(0);
    toast.success(
      `Exporting ${exportSettings.resolution} ${exportSettings.format}...`,
    );
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setExporting(false);
          toast.success("Export complete! 🎉");
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const renderToolPanel = () => {
    if (!activeTool) return null;
    return (
      <div
        className="px-4 py-4 border-t shrink-0"
        style={{
          background: "#111",
          borderColor: "#2a2a2a",
          maxHeight: 220,
          overflowY: "auto",
        }}
      >
        {/* MEDIA PANEL */}
        {activeTool === "media" && (
          <div data-ocid="editor.media.panel">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*,audio/*,image/*"
              multiple
              className="hidden"
              onChange={(e) => handleMediaFileAdd(e.target.files)}
            />
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold" style={{ color: "#9ca3af" }}>
                MEDIA FILES
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-1"
                style={{ background: "#2563eb" }}
                data-ocid="editor.media.upload_button"
              >
                <Plus size={12} /> Add
              </button>
            </div>
            {mediaFiles.length === 0 && (
              <p
                className="text-xs py-4 text-center"
                style={{ color: "#4b5563" }}
                data-ocid="editor.media.empty_state"
              >
                No media yet — tap Add to import files
              </p>
            )}
            <div className="space-y-2">
              {mediaFiles.map((mf, i) => (
                <div
                  key={mf.id}
                  className="flex items-center gap-3 p-2 rounded-xl"
                  style={{ background: "#1c1c1e" }}
                  data-ocid={`editor.media.item.${i + 1}`}
                >
                  {mf.thumbnailUrl ? (
                    <img
                      src={mf.thumbnailUrl}
                      alt={mf.name}
                      className="w-12 h-8 rounded object-cover shrink-0"
                    />
                  ) : (
                    <div
                      className="w-12 h-8 rounded shrink-0 flex items-center justify-center"
                      style={{ background: "#2a2a2a" }}
                    >
                      <Music size={14} style={{ color: "#6b7280" }} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate">{mf.name}</p>
                    <p className="text-[10px]" style={{ color: "#6b7280" }}>
                      {mf.type} ·{" "}
                      {mf.duration ? `${mf.duration.toFixed(1)}s` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddToTimeline(mf.id)}
                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "#2563eb" }}
                    data-ocid={`editor.media.add_button.${i + 1}`}
                  >
                    <Plus size={14} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FILTERS PANEL */}
        {activeTool === "filters" && (
          <div data-ocid="editor.filters.panel">
            <p
              className="text-xs font-semibold mb-3"
              style={{ color: "#9ca3af" }}
            >
              FILTERS
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {Object.keys(FILTER_CSS).map((f) => (
                <button
                  type="button"
                  key={f}
                  onClick={() => setActiveFilter(f === "None" ? null : f)}
                  className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{
                    background:
                      (f === "None" && !activeFilter) || activeFilter === f
                        ? "#2563eb"
                        : "#1c1c1e",
                    color: "#fff",
                  }}
                  data-ocid="editor.filters.tab"
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ADJUST PANEL */}
        {activeTool === "adjust" && (
          <div data-ocid="editor.adjust.panel">
            <div className="mb-3">
              <p
                className="text-xs font-semibold mb-2"
                style={{ color: "#9ca3af" }}
              >
                BRIGHTNESS {brightness}%
              </p>
              <Slider
                value={[brightness]}
                onValueChange={([v]) => setBrightness(v)}
                min={0}
                max={200}
                step={1}
              />
            </div>
            <div className="mb-3">
              <p
                className="text-xs font-semibold mb-2"
                style={{ color: "#9ca3af" }}
              >
                CONTRAST {contrast}%
              </p>
              <Slider
                value={[contrast]}
                onValueChange={([v]) => setContrast(v)}
                min={0}
                max={200}
                step={1}
              />
            </div>
            <div>
              <p
                className="text-xs font-semibold mb-2"
                style={{ color: "#9ca3af" }}
              >
                SATURATION {saturation}%
              </p>
              <Slider
                value={[saturation]}
                onValueChange={([v]) => setSaturation(v)}
                min={0}
                max={200}
                step={1}
              />
            </div>
          </div>
        )}

        {/* SPEED PANEL */}
        {activeTool === "speed" && (
          <div data-ocid="editor.speed.panel">
            <p
              className="text-xs font-semibold mb-3"
              style={{ color: "#9ca3af" }}
            >
              PLAYBACK SPEED
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              {[0.25, 0.5, 1, 1.5, 2, 4].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setClipSpeed(s)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                  style={{
                    background: clipSpeed === s ? "#2563eb" : "#1c1c1e",
                    color: clipSpeed === s ? "#fff" : "#9ca3af",
                  }}
                  data-ocid="editor.speed.toggle"
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TEXT PANEL */}
        {activeTool === "text" && (
          <div data-ocid="editor.text.panel">
            <div className="flex gap-2 mb-3">
              <input
                className="flex-1 px-3 py-2 rounded-xl text-sm text-white"
                style={{ background: "#1c1c1e", border: "1px solid #2a2a2a" }}
                placeholder="Enter text overlay..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                data-ocid="editor.text.input"
              />
              <button
                type="button"
                onClick={handleAddText}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-white shrink-0"
                style={{ background: textInput.trim() ? "#2563eb" : "#1c1c1e" }}
                data-ocid="editor.text.submit_button"
              >
                Add
              </button>
            </div>
            <div className="flex gap-2 mb-3">
              {["Regular", "Bold", "Italic", "Outline"].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setTextStyle(s)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{
                    background: textStyle === s ? "#2563eb" : "#1c1c1e",
                    color: "#fff",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            {textOverlays.length > 0 && (
              <div className="space-y-1.5 max-h-24 overflow-y-auto">
                {textOverlays.map((t, i) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                    style={{ background: "#1c1c1e" }}
                    data-ocid={`editor.text.item.${i + 1}`}
                  >
                    <span className="flex-1 text-xs text-white truncate">
                      {t.text}
                    </span>
                    <span className="text-[10px]" style={{ color: "#6b7280" }}>
                      {t.start.toFixed(1)}s
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setTextOverlays(
                          textOverlays.filter((x) => x.id !== t.id),
                        )
                      }
                      data-ocid={`editor.text.delete_button.${i + 1}`}
                    >
                      <Trash2 size={12} style={{ color: "#ef4444" }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AUDIO PANEL */}
        {activeTool === "audio" && (
          <div data-ocid="editor.audio.panel">
            <input
              ref={audioFileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => handleMediaFileAdd(e.target.files)}
            />
            <p
              className="text-xs font-semibold mb-2"
              style={{ color: "#9ca3af" }}
            >
              MASTER VOLUME {masterVolume}%
            </p>
            <Slider
              value={[masterVolume]}
              onValueChange={([v]) => setMasterVolume(v)}
              min={0}
              max={100}
              step={1}
              className="mb-4"
              data-ocid="editor.audio.input"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => audioFileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl text-xs font-medium"
                style={{ background: "#2563eb", color: "#fff" }}
                data-ocid="editor.audio.upload_button"
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

        {/* EFFECTS PANEL */}
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

        {/* EXPORT PANEL */}
        {activeTool === "export" && (
          <div data-ocid="editor.export.panel">
            <div className="flex gap-2 mb-3 flex-wrap">
              {(["720p", "1080p", "4K"] as const).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() =>
                    setExportSettings({ ...exportSettings, resolution: r })
                  }
                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{
                    background:
                      exportSettings.resolution === r ? "#2563eb" : "#1c1c1e",
                    color: exportSettings.resolution === r ? "#fff" : "#9ca3af",
                  }}
                  data-ocid="editor.export.select"
                >
                  {r}
                </button>
              ))}
              {(["MP4", "WebM"] as const).map((f) => (
                <button
                  type="button"
                  key={f}
                  onClick={() =>
                    setExportSettings({ ...exportSettings, format: f })
                  }
                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{
                    background:
                      exportSettings.format === f ? "#7c3aed" : "#1c1c1e",
                    color: exportSettings.format === f ? "#fff" : "#9ca3af",
                  }}
                  data-ocid="editor.export.select"
                >
                  {f}
                </button>
              ))}
            </div>
            {exporting && (
              <div className="mb-3">
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: "#1c1c1e" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${exportProgress}%`,
                      background: "#2563eb",
                    }}
                    data-ocid="editor.export.loading_state"
                  />
                </div>
                <p className="text-xs mt-1" style={{ color: "#6b7280" }}>
                  {exportProgress}%
                </p>
              </div>
            )}
            <button
              type="button"
              onClick={handleExport}
              disabled={exporting}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white"
              style={{
                background: exporting
                  ? "#1c1c1e"
                  : "linear-gradient(135deg, #1d4ed8, #3b82f6)",
              }}
              data-ocid="editor.export.primary_button"
            >
              {exporting
                ? `Exporting ${exportProgress}%`
                : `Export ${exportSettings.resolution} ${exportSettings.format}`}
            </button>
          </div>
        )}

        {/* CUT / SPLIT PANEL */}
        {(activeTool === "cut" ||
          activeTool === "trim" ||
          activeTool === "split") && (
          <div data-ocid="editor.cut.panel">
            <p className="text-xs mb-3" style={{ color: "#9ca3af" }}>
              {selectedClipId
                ? `Split clip at ${currentTime.toFixed(1)}s`
                : "Select a clip in the timeline first"}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={!selectedClipId}
                onClick={() => {
                  if (selectedClipId) {
                    splitClipAt(selectedClipId, currentTime);
                    toast.success(`Clip split at ${currentTime.toFixed(1)}s`);
                  }
                }}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white"
                style={{
                  background: selectedClipId ? "#2563eb" : "#1c1c1e",
                  opacity: selectedClipId ? 1 : 0.5,
                }}
                data-ocid="editor.cut.primary_button"
              >
                Apply Split
              </button>
              {selectedClipId && (
                <button
                  type="button"
                  onClick={() => {
                    deleteClip(selectedClipId);
                    toast.success("Clip deleted");
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white"
                  style={{ background: "#dc2626" }}
                  data-ocid="editor.cut.delete_button"
                >
                  Delete Clip
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveTool(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: "#1c1c1e", color: "#9ca3af" }}
                data-ocid="editor.cut.cancel_button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ROTATE PANEL */}
        {activeTool === "rotate" && (
          <div data-ocid="editor.rotate.panel">
            <p
              className="text-xs font-semibold mb-3"
              style={{ color: "#9ca3af" }}
            >
              ROTATE & FLIP · current: {rotation}°
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setRotation((rotation + 90) % 360)}
                className="px-3 py-2 rounded-xl text-xs font-medium text-white"
                style={{ background: "#2563eb" }}
                data-ocid="editor.rotate.button"
              >
                +90°
              </button>
              <button
                type="button"
                onClick={() => setRotation((rotation + 180) % 360)}
                className="px-3 py-2 rounded-xl text-xs font-medium text-white"
                style={{ background: "#1c1c1e" }}
                data-ocid="editor.rotate.button"
              >
                +180°
              </button>
              <button
                type="button"
                onClick={() => setRotation(0)}
                className="px-3 py-2 rounded-xl text-xs font-medium"
                style={{ background: "#1c1c1e", color: "#9ca3af" }}
                data-ocid="editor.rotate.button"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setFlipH(!flipH)}
                className="px-3 py-2 rounded-xl text-xs font-medium text-white"
                style={{ background: flipH ? "#7c3aed" : "#1c1c1e" }}
                data-ocid="editor.rotate.toggle"
              >
                Flip H {flipH ? "✓" : ""}
              </button>
              <button
                type="button"
                onClick={() => setFlipV(!flipV)}
                className="px-3 py-2 rounded-xl text-xs font-medium text-white"
                style={{ background: flipV ? "#7c3aed" : "#1c1c1e" }}
                data-ocid="editor.rotate.toggle"
              >
                Flip V {flipV ? "✓" : ""}
              </button>
            </div>
          </div>
        )}

        {/* AI PANEL */}
        {activeTool === "ai" && (
          <div data-ocid="editor.ai.panel">
            <p
              className="text-xs font-semibold mb-3"
              style={{ color: "#9ca3af" }}
            >
              AI TOOLS
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { label: "Auto Cut", value: autoCut, setter: setAutoCut },
                  {
                    label: "BG Removal",
                    value: bgRemoval,
                    setter: setBgRemoval,
                  },
                  { label: "Beat Sync", value: beatSync, setter: setBeatSync },
                  {
                    label: "Noise Removal",
                    value: noiseRemoval,
                    setter: setNoiseRemoval,
                  },
                ] as const
              ).map(({ label, value, setter }) => (
                <div
                  key={label}
                  className="flex items-center justify-between px-3 py-2 rounded-xl"
                  style={{
                    background: value ? "#1a2a3a" : "#1c1c1e",
                    border: `1px solid ${value ? "#2563eb" : "#2a2a2a"}`,
                  }}
                >
                  <span className="text-xs text-white">{label}</span>
                  <Switch
                    checked={value}
                    onCheckedChange={(v) => {
                      setter(v);
                      toast.success(`${label} ${v ? "ON" : "OFF"}`);
                    }}
                    data-ocid="editor.ai.switch"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const totalDuration = Math.max(duration, 8);

  return (
    <EditorContext.Provider value={store}>
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
            onClick={handleExport}
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
            {activeClipUrl ? (
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                style={{
                  transform: videoTransform || undefined,
                  filter: videoFilter || undefined,
                }}
                playsInline
                muted={isMuted}
                onTimeUpdate={(e) =>
                  seekTo((e.target as HTMLVideoElement).currentTime)
                }
              />
            ) : (
              <>
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
                  }}
                />
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />
                <div className="relative z-10 text-center">
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: "#6b7280" }}
                  >
                    No media
                  </p>
                  <p className="text-xs" style={{ color: "#4b5563" }}>
                    Open Media panel to import
                  </p>
                </div>
              </>
            )}

            {/* Text overlays */}
            {activeTextOverlays.map((t) => (
              <div
                key={t.id}
                className="absolute z-20 pointer-events-none font-bold"
                style={{
                  color: t.color,
                  fontSize: t.size,
                  fontFamily: t.font,
                  top:
                    t.position === "bottom"
                      ? "auto"
                      : t.position === "top"
                        ? "10%"
                        : "50%",
                  bottom: t.position === "bottom" ? "10%" : "auto",
                  left: "50%",
                  transform:
                    t.position === "center"
                      ? "translate(-50%, -50%)"
                      : "translateX(-50%)",
                  textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                }}
              >
                {t.text}
              </div>
            ))}

            {/* Play button overlay */}
            <button
              type="button"
              onClick={togglePlay}
              className="absolute z-30 flex items-center justify-center rounded-full transition-opacity"
              style={{
                width: 48,
                height: 48,
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                opacity: isPlaying ? 0 : 1,
              }}
              data-ocid="editor.play.button"
            >
              <Play size={22} className="text-white ml-0.5" fill="white" />
            </button>

            {/* Time indicator */}
            <div
              className="absolute bottom-2 left-3 text-xs font-mono font-medium px-2 py-0.5 rounded-md"
              style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}
            >
              {formatTime(currentTime)} / {formatTime(totalDuration)}
            </div>
          </div>
        </div>

        {/* Transport Controls */}
        <div className="flex items-center justify-center gap-5 mb-3 px-4 shrink-0">
          <button
            type="button"
            onClick={() => seekTo(0)}
            data-ocid="editor.skip_back.button"
          >
            <SkipBack size={20} style={{ color: "#9ca3af" }} />
          </button>
          <button
            type="button"
            onClick={togglePlay}
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
            onClick={() => seekTo(totalDuration)}
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
                {timeMarks
                  .filter((t) => t <= totalDuration + 2)
                  .map((t) => (
                    <div
                      key={t}
                      style={{
                        width: TIMELINE_PX_PER_SEC * 2,
                        flexShrink: 0,
                        position: "relative",
                      }}
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

              {/* Playhead + tracks */}
              <div className="relative" style={{ height: 120 }}>
                {/* Playhead */}
                <div
                  className="absolute top-0 bottom-0 w-px z-10"
                  style={{
                    left: `${60 + (currentTime / totalDuration) * TIMELINE_PX_PER_SEC * totalDuration}px`,
                    background: "rgba(255,255,255,0.8)",
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full -ml-[3px] -mt-1"
                    style={{ background: "#fff" }}
                  />
                </div>

                {/* VIDEO track */}
                <div className="flex items-center mb-1.5">
                  <span
                    className="text-[9px] font-medium shrink-0 mr-2"
                    style={{ color: "#4b5563", width: 44, textAlign: "right" }}
                  >
                    VIDEO
                  </span>
                  <div className="flex gap-1 relative">
                    {clips.map((c, i) => (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => {
                          setSelectedClipId(c.id);
                          if (c.mediaId) {
                            const mf = mediaFiles.find(
                              (m) => m.id === c.mediaId,
                            );
                            if (mf) setActiveClipUrl(mf.url);
                          }
                        }}
                        className="rounded-md flex items-center justify-start px-2 cursor-pointer transition-all hover:opacity-80"
                        style={{
                          width: Math.max(40, c.duration * TIMELINE_PX_PER_SEC),
                          height: 30,
                          background: c.color,
                          flexShrink: 0,
                          boxShadow:
                            selectedClipId === c.id
                              ? "0 0 0 2px #60a5fa"
                              : "none",
                        }}
                        data-ocid={`editor.timeline.item.${i + 1}`}
                      >
                        <span className="text-[10px] font-medium text-white truncate">
                          {c.name}
                        </span>
                      </button>
                    ))}
                    {/* Add clip button */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTool("media");
                        setTimeout(() => fileInputRef.current?.click(), 100);
                      }}
                      className="w-7 h-[30px] rounded-md flex items-center justify-center shrink-0"
                      style={{
                        background: "#1c1c1e",
                        border: "1px dashed #2a2a2a",
                      }}
                      data-ocid="editor.timeline.upload_button"
                    >
                      <Plus size={12} style={{ color: "#6b7280" }} />
                    </button>
                  </div>
                </div>

                {/* AUDIO track */}
                <div className="flex items-center mb-1.5">
                  <span
                    className="text-[9px] font-medium shrink-0 mr-2"
                    style={{ color: "#4b5563", width: 44, textAlign: "right" }}
                  >
                    AUDIO
                  </span>
                  <div className="flex gap-1">
                    {audioTracks.map((c, i) => (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => setSelectedClipId(c.id)}
                        className="rounded-md flex items-center justify-start px-2 cursor-pointer transition-opacity hover:opacity-80"
                        style={{
                          width: Math.max(
                            40,
                            c.duration * (TIMELINE_PX_PER_SEC / 2),
                          ),
                          height: 30,
                          background: c.color,
                          flexShrink: 0,
                          boxShadow:
                            selectedClipId === c.id
                              ? "0 0 0 2px #34d399"
                              : "none",
                        }}
                        data-ocid={`editor.timeline.item.${i + 10}`}
                      >
                        <span className="text-[10px] font-medium text-white truncate">
                          {c.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* TEXT track */}
                <div className="flex items-center">
                  <span
                    className="text-[9px] font-medium shrink-0 mr-2"
                    style={{ color: "#4b5563", width: 44, textAlign: "right" }}
                  >
                    TEXT
                  </span>
                  <div className="flex gap-1">
                    {textOverlays.map((t, i) => (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => setSelectedClipId(t.id)}
                        className="rounded-md flex items-center justify-start px-2 cursor-pointer transition-opacity hover:opacity-80"
                        style={{
                          width: Math.max(40, t.duration * TIMELINE_PX_PER_SEC),
                          height: 30,
                          background: "#3d1f7a",
                          flexShrink: 0,
                          boxShadow:
                            selectedClipId === t.id
                              ? "0 0 0 2px #a78bfa"
                              : "none",
                        }}
                        data-ocid={`editor.timeline.item.${i + 20}`}
                      >
                        <span className="text-[10px] font-medium text-white truncate">
                          {t.text}
                        </span>
                      </button>
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
          className="shrink-0 overflow-x-auto mt-auto"
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
    </EditorContext.Provider>
  );
}

export default function EditorScreen({ onBack }: Props) {
  return <EditorScreenInner onBack={onBack} />;
}
