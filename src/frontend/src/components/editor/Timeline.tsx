import {
  type AudioTrackItem,
  type Clip,
  useEditorStore,
} from "@/hooks/useEditorStore";
import { ChevronDown, Minus, Plus, Scissors, Trash2 } from "lucide-react";
import { toast } from "sonner";

const SPEEDS = ["0.25x", "0.5x", "1x", "1.5x", "2x", "4x"];

function WaveformSVG({ width }: { width: number }) {
  const bars = Math.max(10, Math.floor(width / 4));
  return (
    <svg
      width={width}
      height="28"
      className="absolute inset-0"
      aria-hidden="true"
    >
      <title>Audio waveform</title>
      {Array.from({ length: bars }).map((_, i) => {
        const h = 4 + Math.abs(Math.sin(i * 0.7 + 1.2)) * 20;
        return (
          <rect
            key={`wb-x${i * 4 + 1}`}
            x={i * 4 + 1}
            y={(28 - h) / 2}
            width="2"
            height={h}
            rx="1"
            fill="#2DD4BF"
            opacity="0.7"
          />
        );
      })}
    </svg>
  );
}

interface TimelineTrackProps {
  label: string;
  sublabel: string;
  color: string;
  clips: (Clip | AudioTrackItem)[];
  isAudio?: boolean;
  pixelsPerSecond: number;
  duration: number;
  selectedClipId: string | null;
  onSelectClip: (id: string) => void;
  mediaFiles?: { id: string; thumbnailUrl?: string }[];
  onClipClick?: (clip: Clip | AudioTrackItem) => void;
}

function TimelineTrack({
  label,
  sublabel,
  color,
  clips,
  isAudio = false,
  pixelsPerSecond,
  selectedClipId,
  onSelectClip,
  mediaFiles,
  onClipClick,
}: TimelineTrackProps) {
  return (
    <div
      className="flex timeline-track"
      style={{ borderBottom: "1px solid var(--editor-border)" }}
    >
      {/* Label */}
      <div
        className="w-24 flex-none flex flex-col justify-center px-3 border-r"
        style={{
          background: "var(--editor-panel)",
          borderColor: "var(--editor-border)",
        }}
      >
        <span className="text-[10px] font-bold" style={{ color }}>
          {label}
        </span>
        <span className="text-[9px]" style={{ color: "var(--editor-subtle)" }}>
          {sublabel}
        </span>
      </div>

      {/* Track area */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{ background: "var(--editor-inner)" }}
      >
        {clips.map((clip) => {
          const left = clip.start * pixelsPerSecond;
          const width = clip.duration * pixelsPerSecond;
          const isSelected = selectedClipId === clip.id;
          const mediaFile =
            "mediaId" in clip && clip.mediaId
              ? mediaFiles?.find((f) => f.id === clip.mediaId)
              : undefined;

          return (
            <button
              key={clip.id}
              type="button"
              onClick={() => {
                onSelectClip(clip.id);
                if (onClipClick) onClipClick(clip);
              }}
              className="clip-block absolute top-1 bottom-1 rounded overflow-hidden flex items-center"
              style={{
                left,
                width,
                background: mediaFile?.thumbnailUrl
                  ? `url(${mediaFile.thumbnailUrl}) center/cover no-repeat`
                  : clip.color,
                border: isSelected
                  ? "2px solid var(--editor-purple)"
                  : isAudio
                    ? "1px solid rgba(45,212,191,0.4)"
                    : "1px solid rgba(34,199,214,0.3)",
                cursor: "pointer",
                outline: isSelected ? "1px solid rgba(124,58,237,0.4)" : "none",
                minWidth: 20,
              }}
              title={clip.name}
            >
              {isAudio ? (
                <WaveformSVG width={width} />
              ) : (
                <span
                  className="px-1.5 text-[9px] font-medium truncate relative z-10 drop-shadow"
                  style={{
                    color: isAudio
                      ? "var(--editor-teal)"
                      : "var(--editor-cyan)",
                  }}
                >
                  {clip.name}
                </span>
              )}
              {isAudio && (
                <span
                  className="absolute top-0.5 left-1 text-[8px] font-medium z-10"
                  style={{ color: "var(--editor-teal)" }}
                >
                  {clip.name}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Timeline() {
  const {
    clips,

    audioTracks,
    textOverlays,
    selectedClipId,
    setSelectedClipId,
    currentTime,
    duration,
    seekTo,
    zoomLevel,
    setZoomLevel,
    clipSpeed,
    setClipSpeed,
    splitClipAt,
    deleteClip,
    rotation,
    setRotation,
    flipH,
    setFlipH,
    flipV,
    setFlipV,
    mediaFiles,
    setActiveClipUrl,
  } = useEditorStore();

  const pixelsPerSecond = (zoomLevel / 100) * 50;
  const totalWidth = Math.max(duration * pixelsPerSecond + 80, 600);

  const selectedClip = clips.find((c) => c.id === selectedClipId);

  const handleDeleteClip = () => {
    if (!selectedClipId) return;
    deleteClip(selectedClipId);
    toast.success("Clip deleted");
  };

  const handleSplitClip = () => {
    if (!selectedClipId) return;
    const clip = clips.find((c) => c.id === selectedClipId);
    if (!clip) return;
    if (
      currentTime <= clip.start ||
      currentTime >= clip.start + clip.duration
    ) {
      toast.error("Playhead is not inside the selected clip");
      return;
    }
    splitClipAt(selectedClipId, currentTime);
    toast.success(`Clip split at ${currentTime.toFixed(1)}s`);
  };

  const handleClipClick = (clip: Clip | AudioTrackItem) => {
    if ("mediaId" in clip && clip.mediaId) {
      const file = mediaFiles.find((f) => f.id === clip.mediaId);
      if (file) {
        setActiveClipUrl(file.url);
      }
    }
  };

  const handleRotate = () => {
    setRotation((rotation + 90) % 360);
  };

  const textClips = textOverlays.map((o) => ({
    id: o.id,
    name: o.text,
    track: o.track,
    start: o.start,
    duration: o.duration,
    color: "rgba(124,58,237,0.3)",
  }));

  const v1Clips = clips.filter((c) => c.track === "v1");
  const v2Clips = clips.filter((c) => c.track === "v2");
  const a1Clips = audioTracks.filter((t) => t.track === "a1");
  const a2Clips = audioTracks.filter((t) => t.track === "a2");

  const tickInterval = zoomLevel >= 100 ? 2 : zoomLevel >= 50 ? 5 : 10;
  const ticks = Array.from(
    { length: Math.ceil(duration / tickInterval) + 1 },
    (_, i) => i * tickInterval,
  );

  const handlePlayheadClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      seekTo(x / pixelsPerSecond);
    }
  };

  const handlePlayheadKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") seekTo(currentTime - 1);
    if (e.key === "ArrowRight") seekTo(currentTime + 1);
  };

  return (
    <div
      className="flex-none border-t"
      style={{
        background: "var(--editor-surface)",
        borderColor: "var(--editor-border)",
        height: 280,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Timeline toolbar */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 border-b flex-none"
        style={{
          borderColor: "var(--editor-border)",
          background: "var(--editor-panel)",
        }}
      >
        {selectedClipId ? (
          <div className="flex items-center gap-1.5 flex-1 overflow-x-auto">
            <span
              className="text-[10px] font-medium mr-1 whitespace-nowrap"
              style={{ color: "var(--editor-muted)" }}
            >
              {selectedClip?.name}
            </span>

            <button
              type="button"
              onClick={handleSplitClip}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-opacity hover:opacity-80 whitespace-nowrap"
              style={{
                background: "var(--editor-inner)",
                border: "1px solid var(--editor-border2)",
                color: "var(--editor-muted)",
              }}
              data-ocid="timeline.cut.button"
            >
              <Scissors className="w-3 h-3" /> Cut
            </button>

            {/* Speed */}
            <div className="flex items-center gap-1">
              <span
                className="text-[10px]"
                style={{ color: "var(--editor-subtle)" }}
              >
                Speed:
              </span>
              {SPEEDS.map((s) => {
                const val = Number.parseFloat(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setClipSpeed(val)}
                    className="px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors"
                    style={{
                      background:
                        clipSpeed === val
                          ? "rgba(124,58,237,0.2)"
                          : "var(--editor-inner)",
                      border: `1px solid ${clipSpeed === val ? "var(--editor-purple)" : "var(--editor-border)"}`,
                      color:
                        clipSpeed === val
                          ? "var(--editor-purple-light)"
                          : "var(--editor-subtle)",
                    }}
                    data-ocid={`timeline.speed.${s.replace(".", "")}.button`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            {/* Rotate */}
            <button
              type="button"
              onClick={handleRotate}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-colors"
              style={{
                background:
                  rotation !== 0
                    ? "rgba(124,58,237,0.2)"
                    : "var(--editor-inner)",
                border: `1px solid ${rotation !== 0 ? "var(--editor-purple)" : "var(--editor-border)"}`,
                color:
                  rotation !== 0
                    ? "var(--editor-purple-light)"
                    : "var(--editor-subtle)",
              }}
              data-ocid="timeline.rotate.button"
            >
              ↻ {rotation !== 0 ? `${rotation}°` : "Rotate"}
            </button>

            {/* Flip H */}
            <button
              type="button"
              onClick={() => setFlipH(!flipH)}
              className="px-2 py-0.5 rounded text-[10px] font-medium transition-colors"
              style={{
                background: flipH
                  ? "rgba(124,58,237,0.2)"
                  : "var(--editor-inner)",
                border: `1px solid ${flipH ? "var(--editor-purple)" : "var(--editor-border)"}`,
                color: flipH
                  ? "var(--editor-purple-light)"
                  : "var(--editor-subtle)",
              }}
              data-ocid="timeline.flip.h.toggle"
            >
              ⟺ Horiz
            </button>

            {/* Flip V */}
            <button
              type="button"
              onClick={() => setFlipV(!flipV)}
              className="px-2 py-0.5 rounded text-[10px] font-medium transition-colors"
              style={{
                background: flipV
                  ? "rgba(124,58,237,0.2)"
                  : "var(--editor-inner)",
                border: `1px solid ${flipV ? "var(--editor-purple)" : "var(--editor-border)"}`,
                color: flipV
                  ? "var(--editor-purple-light)"
                  : "var(--editor-subtle)",
              }}
              data-ocid="timeline.flip.v.toggle"
            >
              ⇅ Vert
            </button>

            <button
              type="button"
              onClick={handleDeleteClip}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ml-auto whitespace-nowrap"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#ef4444",
              }}
              data-ocid="timeline.delete.delete_button"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        ) : (
          <div className="flex-1 flex items-center gap-1">
            <span className="text-xs" style={{ color: "var(--editor-subtle)" }}>
              Select a clip to edit · Import media to add real clips
            </span>
          </div>
        )}

        {/* Zoom */}
        <div className="flex items-center gap-1 ml-auto flex-none">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(25, z - 25))}
            className="w-6 h-6 rounded flex items-center justify-center"
            style={{
              background: "var(--editor-inner)",
              border: "1px solid var(--editor-border)",
            }}
            data-ocid="timeline.zoom_out.button"
          >
            <Minus
              className="w-3 h-3"
              style={{ color: "var(--editor-muted)" }}
            />
          </button>
          <span
            className="text-[10px] w-10 text-center font-mono"
            style={{ color: "var(--editor-muted)" }}
          >
            {zoomLevel}%
          </span>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(400, z + 25))}
            className="w-6 h-6 rounded flex items-center justify-center"
            style={{
              background: "var(--editor-inner)",
              border: "1px solid var(--editor-border)",
            }}
            data-ocid="timeline.zoom_in.button"
          >
            <Plus
              className="w-3 h-3"
              style={{ color: "var(--editor-muted)" }}
            />
          </button>
          <button
            type="button"
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] ml-1"
            style={{
              background: "var(--editor-inner)",
              border: "1px solid var(--editor-border)",
              color: "var(--editor-muted)",
            }}
            data-ocid="timeline.add_track.button"
          >
            <Plus className="w-3 h-3" /> Track
          </button>
        </div>
      </div>

      {/* Scrollable timeline content */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div style={{ minWidth: totalWidth + 96 }}>
          {/* Ruler */}
          <div
            className="flex"
            style={{
              borderBottom: "1px solid var(--editor-border)",
              height: 24,
            }}
          >
            <div
              className="w-24 flex-none border-r"
              style={{
                background: "var(--editor-panel)",
                borderColor: "var(--editor-border)",
              }}
            />
            <div
              className="relative flex-1"
              style={{ background: "var(--editor-panel)" }}
            >
              {ticks.map((t) => (
                <div
                  key={`tick-${t}`}
                  className="absolute top-0 flex flex-col items-center"
                  style={{ left: t * pixelsPerSecond }}
                >
                  <div
                    style={{
                      width: 1,
                      height: 8,
                      background: "var(--editor-border2)",
                    }}
                  />
                  <span
                    className="text-[8px] font-mono"
                    style={{ color: "var(--editor-subtle)", marginTop: 1 }}
                  >
                    {t}s
                  </span>
                </div>
              ))}
              {/* Playhead */}
              <div
                className="absolute top-0 bottom-0 z-20 cursor-col-resize"
                style={{
                  left: currentTime * pixelsPerSecond,
                  width: 2,
                  background: "var(--editor-purple)",
                }}
                onClick={handlePlayheadClick}
                onKeyDown={handlePlayheadKey}
                role="slider"
                aria-label="Playhead position"
                aria-valuenow={currentTime}
                aria-valuemin={0}
                aria-valuemax={duration}
                tabIndex={0}
              >
                <ChevronDown
                  className="w-3 h-3 absolute -top-0.5 -left-1.5"
                  style={{ color: "var(--editor-purple)" }}
                />
              </div>
            </div>
          </div>

          {/* Tracks */}
          <div className="relative">
            <TimelineTrack
              label="V2"
              sublabel="Text"
              color="#8B5CF6"
              clips={textClips}
              pixelsPerSecond={pixelsPerSecond}
              duration={duration}
              selectedClipId={selectedClipId}
              onSelectClip={setSelectedClipId}
              mediaFiles={mediaFiles}
              onClipClick={handleClipClick}
            />
            <TimelineTrack
              label="V2"
              sublabel="Video 2"
              color="var(--editor-cyan)"
              clips={v2Clips}
              pixelsPerSecond={pixelsPerSecond}
              duration={duration}
              selectedClipId={selectedClipId}
              onSelectClip={setSelectedClipId}
              mediaFiles={mediaFiles}
              onClipClick={handleClipClick}
            />
            <TimelineTrack
              label="V1"
              sublabel="Video 1"
              color="var(--editor-cyan)"
              clips={v1Clips}
              pixelsPerSecond={pixelsPerSecond}
              duration={duration}
              selectedClipId={selectedClipId}
              onSelectClip={setSelectedClipId}
              mediaFiles={mediaFiles}
              onClipClick={handleClipClick}
            />
            <TimelineTrack
              label="A1"
              sublabel="Audio 1"
              color="var(--editor-teal)"
              clips={a1Clips}
              isAudio
              pixelsPerSecond={pixelsPerSecond}
              duration={duration}
              selectedClipId={selectedClipId}
              onSelectClip={setSelectedClipId}
              mediaFiles={mediaFiles}
              onClipClick={handleClipClick}
            />
            <TimelineTrack
              label="A2"
              sublabel="Audio 2"
              color="var(--editor-teal)"
              clips={a2Clips}
              isAudio
              pixelsPerSecond={pixelsPerSecond}
              duration={duration}
              selectedClipId={selectedClipId}
              onSelectClip={setSelectedClipId}
              mediaFiles={mediaFiles}
              onClipClick={handleClipClick}
            />

            {/* Playhead line across tracks */}
            <div
              className="absolute top-0 bottom-0 z-10 pointer-events-none"
              style={{
                left: 96 + currentTime * pixelsPerSecond,
                width: 1,
                background: "var(--editor-purple)",
                opacity: 0.7,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
