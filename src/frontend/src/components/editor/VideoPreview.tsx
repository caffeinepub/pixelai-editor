import { useEditorStore } from "@/hooks/useEditorStore";
import {
  Expand,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  StepBack,
  StepForward,
  Volume2,
} from "lucide-react";
import { useEffect, useRef } from "react";

function formatTime(s: number): string {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const sec = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  const ms = Math.floor((s % 1) * 100)
    .toString()
    .padStart(2, "0");
  return `${m}:${sec}:${ms}`;
}

export function VideoPreview() {
  const {
    isPlaying,
    togglePlay,
    currentTime,
    duration,
    setDuration,
    seekTo,
    exportSettings,
    textOverlays,
    activeFilter,
    activeClipUrl,
    rotation,
    flipH,
    flipV,
    masterVolume,
    setMasterVolume,
    clipSpeed,
  } = useEditorStore();

  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync play/pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isPlaying]);

  // Sync seek time (only if diff > 0.5s to avoid feedback loop)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (Math.abs(video.currentTime - currentTime) > 0.5) {
      video.currentTime = currentTime;
    }
  }, [currentTime]);

  // Sync volume
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = masterVolume / 100;
  }, [masterVolume]);

  // Sync playback rate
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = clipSpeed;
  }, [clipSpeed]);

  const aspectRatios: Record<string, string> = {
    "YouTube 16:9": "16/9",
    "TikTok 9:16": "9/16",
    "Instagram 1:1": "1/1",
    "Story 4:5": "4/5",
  };

  const filterGradients: Record<string, string> = {
    Cinematic:
      "linear-gradient(180deg, rgba(26,26,46,0.5) 0%, rgba(15,33,60,0.3) 100%)",
    Retro:
      "linear-gradient(180deg, rgba(139,69,19,0.3) 0%, rgba(210,105,30,0.2) 100%)",
    Bright:
      "linear-gradient(180deg, rgba(255,249,196,0.2) 0%, rgba(255,235,59,0.1) 100%)",
    Vintage:
      "linear-gradient(180deg, rgba(141,110,99,0.3) 0%, transparent 100%)",
    Noir: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%)",
    Warm: "linear-gradient(180deg, rgba(255,107,53,0.2) 0%, rgba(247,147,30,0.1) 100%)",
    Cool: "linear-gradient(180deg, rgba(0,119,182,0.2) 0%, rgba(0,180,216,0.1) 100%)",
  };

  const activeOverlays = textOverlays.filter(
    (o) => currentTime >= o.start && currentTime <= o.start + o.duration,
  );

  const positionClasses: Record<string, string> = {
    top: "top-8 left-1/2 -translate-x-1/2",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    bottom: "bottom-16 left-1/2 -translate-x-1/2",
    "lower-third": "bottom-8 left-8 right-8",
  };

  const videoTransform = [
    `rotate(${rotation}deg)`,
    `scaleX(${flipH ? -1 : 1})`,
    `scaleY(${flipV ? -1 : 1})`,
  ].join(" ");

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden"
      style={{ background: "var(--editor-bg)" }}
    >
      {/* Preview area */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div
          className="relative"
          style={{
            aspectRatio: aspectRatios[exportSettings.aspectRatio] || "16/9",
            maxHeight: "100%",
            maxWidth: "100%",
          }}
        >
          <div
            className="w-full h-full rounded-xl overflow-hidden relative"
            style={{
              background:
                "linear-gradient(135deg, #0a1628 0%, #0d2137 25%, #0f2d4a 50%, #112644 75%, #0a1a33 100%)",
              boxShadow: "0 8px 48px rgba(0,0,0,0.7)",
              border: "1px solid var(--editor-border2)",
            }}
          >
            {/* Real video element */}
            {activeClipUrl ? (
              <video
                ref={videoRef}
                src={activeClipUrl}
                className="w-full h-full object-contain"
                style={{
                  transform: videoTransform,
                  transition: "transform 0.2s",
                }}
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    setDuration(videoRef.current.duration);
                    videoRef.current.volume = masterVolume / 100;
                    videoRef.current.playbackRate = clipSpeed;
                  }
                }}
                onTimeUpdate={() => {
                  // Video drives currentTime only when playing to avoid feedback
                  // We don't call seekTo here to prevent loops; store interval handles it
                }}
              >
                <track kind="captions" />
              </video>
            ) : (
              /* Gradient placeholder when no clip selected */
              <>
                <div className="absolute inset-0 opacity-60">
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse at 30% 60%, rgba(255,140,0,0.3) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(0,120,255,0.2) 0%, transparent 50%)",
                    }}
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1/3"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.6) 100%)",
                    }}
                  />
                </div>
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ color: "rgba(255,255,255,0.2)" }}
                >
                  <p className="text-xs">
                    Click a clip in the timeline to preview
                  </p>
                </div>
              </>
            )}

            {/* Filter overlay */}
            {activeFilter && filterGradients[activeFilter] && (
              <div
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{ background: filterGradients[activeFilter] }}
              />
            )}

            {/* Safe zone lines */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                margin: "5%",
              }}
            />

            {/* Text overlays */}
            {activeOverlays.map((overlay) => (
              <div
                key={overlay.id}
                className={`absolute text-center ${positionClasses[overlay.position] || positionClasses.center}`}
                style={{
                  fontFamily: overlay.font,
                  fontSize: `${overlay.size * 0.3}px`,
                  color: overlay.color,
                  fontWeight: "bold",
                  textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                  animation:
                    overlay.animation === "Fade In"
                      ? "fadeIn 0.5s ease"
                      : undefined,
                }}
              >
                {overlay.text}
              </div>
            ))}

            {/* Playing indicator */}
            {isPlaying && (
              <div className="absolute top-3 right-3">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "#ef4444" }}
                />
              </div>
            )}

            {/* Resolution label */}
            <div
              className="absolute bottom-2 right-2 text-[10px] font-mono px-1.5 py-0.5 rounded pointer-events-none"
              style={{
                background: "rgba(0,0,0,0.6)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {exportSettings.resolution} · {exportSettings.aspectRatio}
            </div>

            {/* Fullscreen button */}
            <button
              type="button"
              className="absolute top-2 right-2 p-1 rounded transition-opacity hover:opacity-80"
              style={{ background: "rgba(0,0,0,0.5)" }}
              onClick={() => videoRef.current?.requestFullscreen?.()}
              data-ocid="preview.fullscreen.button"
            >
              <Expand
                className="w-3.5 h-3.5"
                style={{ color: "rgba(255,255,255,0.7)" }}
              />
            </button>

            {/* Filter badge */}
            {activeFilter && (
              <div
                className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded pointer-events-none"
                style={{ background: "var(--editor-purple)", color: "#fff" }}
              >
                {activeFilter}
              </div>
            )}

            {/* Transform badge */}
            {(rotation !== 0 || flipH || flipV) && (
              <div
                className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded pointer-events-none mt-6"
                style={{ background: "rgba(0,0,0,0.6)", color: "#aaa" }}
              >
                {rotation !== 0 && `${rotation}°`}
                {flipH && " ⟺"}
                {flipV && " ⇅"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transport controls */}
      <div
        className="flex-none px-4 py-2 border-t"
        style={{
          background: "var(--editor-surface)",
          borderColor: "var(--editor-border)",
        }}
      >
        {/* Scrubber */}
        <div className="mb-2">
          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={currentTime}
            onChange={(e) => seekTo(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: "var(--editor-purple)" }}
            data-ocid="preview.scrubber.input"
          />
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => seekTo(0)}
              className="p-1.5 rounded transition-colors hover:bg-white/5"
              title="Rewind to start"
              data-ocid="preview.rewind.button"
            >
              <SkipBack
                className="w-3.5 h-3.5"
                style={{ color: "var(--editor-muted)" }}
              />
            </button>
            <button
              type="button"
              onClick={() => seekTo(currentTime - 1)}
              className="p-1.5 rounded transition-colors hover:bg-white/5"
              title="Step back"
              data-ocid="preview.step_back.button"
            >
              <StepBack
                className="w-3.5 h-3.5"
                style={{ color: "var(--editor-muted)" }}
              />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
              style={{ background: "var(--editor-purple)" }}
              title="Play/Pause (Space)"
              data-ocid="preview.play_pause.primary_button"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white" />
              ) : (
                <Play className="w-4 h-4 text-white ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => seekTo(currentTime + 1)}
              className="p-1.5 rounded transition-colors hover:bg-white/5"
              title="Step forward"
              data-ocid="preview.step_forward.button"
            >
              <StepForward
                className="w-3.5 h-3.5"
                style={{ color: "var(--editor-muted)" }}
              />
            </button>
            <button
              type="button"
              onClick={() => seekTo(duration)}
              className="p-1.5 rounded transition-colors hover:bg-white/5"
              title="Skip to end"
              data-ocid="preview.skip_end.button"
            >
              <SkipForward
                className="w-3.5 h-3.5"
                style={{ color: "var(--editor-muted)" }}
              />
            </button>

            <span
              className="font-mono text-xs ml-1"
              style={{ color: "var(--editor-muted)" }}
            >
              {formatTime(currentTime)}
              <span style={{ color: "var(--editor-border2)" }}> / </span>
              {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <RotateCcw
              className="w-3.5 h-3.5 cursor-pointer hover:opacity-80"
              style={{ color: "var(--editor-subtle)" }}
              onClick={() => {
                seekTo(0);
              }}
            />
            <Volume2
              className="w-3.5 h-3.5"
              style={{ color: "var(--editor-subtle)" }}
            />
            <input
              type="range"
              min={0}
              max={100}
              value={masterVolume}
              onChange={(e) => setMasterVolume(Number(e.target.value))}
              className="w-16 h-1 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: "var(--editor-muted)" }}
              data-ocid="preview.volume.input"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
