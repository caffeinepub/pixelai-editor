import { useEditorStore } from "@/hooks/useEditorStore";
import { Film, FolderOpen, Import, Music, Plus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const uuid = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);

function formatDuration(secs: number): string {
  if (!secs || !Number.isFinite(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

function AudioWaveform() {
  return (
    <svg viewBox="0 0 60 30" className="w-full h-8 px-2" aria-hidden="true">
      <title>Audio waveform</title>
      {Array.from({ length: 20 }).map((_, i) => (
        <rect
          key={`wm-x${Math.round(i * 3 + 1)}`}
          x={i * 3 + 1}
          y={15 - Math.sin(i * 0.8) * 10}
          width="2"
          height={Math.abs(Math.sin(i * 0.8)) * 20 + 2}
          rx="1"
          fill="#2DD4BF"
          opacity="0.8"
        />
      ))}
    </svg>
  );
}

export function MediaPanel() {
  const {
    mediaFiles,
    addMediaFile,
    clips,
    setClips,
    audioTracks,
    setAudioTracks,
  } = useEditorStore();
  const [tab, setTab] = useState<"project" | "imported">("project");
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsImporting(true);
    try {
      const promises = Array.from(files).map((f) => addMediaFile(f));
      await Promise.all(promises);
      toast.success(
        `Imported ${files.length} file${files.length > 1 ? "s" : ""}`,
      );
      setTab("imported");
    } catch (_) {
      toast.error("Failed to import some files");
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const addToTimeline = (fileId: string) => {
    const file = mediaFiles.find((f) => f.id === fileId);
    if (!file) return;

    if (file.type === "audio") {
      const totalDuration = audioTracks.reduce(
        (max, a) => Math.max(max, a.start + a.duration),
        0,
      );
      setAudioTracks((prev) => [
        ...prev,
        {
          id: uuid(),
          name: file.name,
          track: "a1",
          start: totalDuration,
          duration: file.duration || 5,
          color: "#0D2420",
          volume: 100,
          muted: false,
          fadeIn: false,
          fadeOut: false,
          mediaId: file.id,
        },
      ]);
    } else {
      const totalDuration = clips
        .filter((c) => c.track === "v1")
        .reduce((max, c) => Math.max(max, c.start + c.duration), 0);
      setClips((prev) => [
        ...prev,
        {
          id: uuid(),
          name: file.name,
          track: "v1",
          start: totalDuration,
          duration: file.duration || 5,
          color: "#1A2A3A",
          mediaId: file.id,
        },
      ]);
    }
    toast.success(`Added "${file.name}" to timeline`);
  };

  return (
    <div
      className="w-72 flex-none flex flex-col border-r panel-enter"
      style={{
        background: "var(--editor-panel)",
        borderColor: "var(--editor-border)",
      }}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,audio/*,image/*"
        multiple
        className="hidden"
        onChange={(e) => handleImport(e.target.files)}
        data-ocid="media.upload_button"
      />

      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "var(--editor-border)" }}
      >
        <h2
          className="text-sm font-semibold"
          style={{ color: "var(--editor-text)" }}
        >
          Media
          {mediaFiles.length > 0 && (
            <span
              className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-medium"
              style={{ background: "var(--editor-purple)", color: "#fff" }}
            >
              {mediaFiles.length}
            </span>
          )}
        </h2>
        <button
          type="button"
          className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-opacity hover:opacity-80"
          style={{ background: "var(--editor-purple)", color: "#fff" }}
          onClick={() => fileInputRef.current?.click()}
          disabled={isImporting}
          data-ocid="media.add.primary_button"
        >
          {isImporting ? (
            <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <Plus className="w-3 h-3" />
          )}
          {isImporting ? "Importing..." : "Add"}
        </button>
      </div>

      {/* Tabs */}
      <div
        className="flex border-b"
        style={{ borderColor: "var(--editor-border)" }}
      >
        {(["project", "imported"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className="flex-1 py-2 text-xs font-medium transition-colors"
            style={{
              color:
                tab === t
                  ? "var(--editor-purple-light)"
                  : "var(--editor-muted)",
              borderBottom:
                tab === t
                  ? "2px solid var(--editor-purple)"
                  : "2px solid transparent",
            }}
            data-ocid={`media.${t}.tab`}
          >
            {t === "project" ? (
              <span className="flex items-center justify-center gap-1">
                <FolderOpen className="w-3 h-3" />
                Project Media
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1">
                <Import className="w-3 h-3" />
                Imported ({mediaFiles.length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {tab === "imported" ? (
          mediaFiles.length === 0 ? (
            // Empty state with upload area
            <button
              type="button"
              className="w-full flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10 transition-colors hover:border-purple-500/60 cursor-pointer"
              style={{
                borderColor: "var(--editor-border2)",
                background: "var(--editor-inner)",
              }}
              onClick={() => fileInputRef.current?.click()}
              data-ocid="media.dropzone"
            >
              <Upload
                className="w-8 h-8"
                style={{ color: "var(--editor-muted)" }}
              />
              <div className="text-center">
                <p
                  className="text-xs font-medium"
                  style={{ color: "var(--editor-text)" }}
                >
                  Import Media Files
                </p>
                <p
                  className="text-[10px] mt-1"
                  style={{ color: "var(--editor-subtle)" }}
                >
                  Video, audio, or images
                </p>
              </div>
              <span
                className="px-3 py-1 rounded text-xs font-medium"
                style={{ background: "var(--editor-purple)", color: "#fff" }}
              >
                Browse Files
              </span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {mediaFiles.map((file, idx) => (
                <div
                  key={file.id}
                  className="group rounded-lg overflow-hidden cursor-pointer transition-all hover:ring-1"
                  style={{
                    background: "var(--editor-surface)",
                    border: "1px solid var(--editor-border)",
                  }}
                  data-ocid={`media.item.${idx + 1}`}
                >
                  {/* Thumbnail */}
                  <div
                    className="w-full h-16 flex items-center justify-center relative overflow-hidden"
                    style={{
                      background:
                        file.type === "audio"
                          ? "#0D2420"
                          : file.type === "image"
                            ? "#1A2A3A"
                            : "#1A3A5C",
                    }}
                  >
                    {file.type === "audio" ? (
                      <div className="w-full">
                        <AudioWaveform />
                        <Music
                          className="absolute top-1 right-1 w-3 h-3"
                          style={{ color: "var(--editor-teal)" }}
                        />
                      </div>
                    ) : file.thumbnailUrl ? (
                      <img
                        src={file.thumbnailUrl}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Film
                        className="w-6 h-6"
                        style={{ color: "rgba(255,255,255,0.4)" }}
                      />
                    )}
                    <span
                      className="absolute bottom-1 right-1 text-[9px] font-mono px-1 rounded"
                      style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}
                    >
                      {formatDuration(file.duration)}
                    </span>
                    {/* Add button overlay */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToTimeline(file.id);
                      }}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      data-ocid="media.add_to_timeline.button"
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: "var(--editor-purple)" }}
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </div>
                    </button>
                  </div>
                  {/* Name */}
                  <div className="px-2 py-1.5">
                    <p
                      className="text-[10px] font-medium truncate"
                      style={{ color: "var(--editor-text)" }}
                    >
                      {file.name}
                    </p>
                  </div>
                </div>
              ))}
              {/* Import more button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg flex flex-col items-center justify-center gap-1 h-24 border-2 border-dashed transition-colors hover:border-purple-500/60"
                style={{
                  borderColor: "var(--editor-border)",
                  background: "var(--editor-inner)",
                }}
                data-ocid="media.import_more.button"
              >
                <Upload
                  className="w-4 h-4"
                  style={{ color: "var(--editor-muted)" }}
                />
                <span
                  className="text-[10px]"
                  style={{ color: "var(--editor-subtle)" }}
                >
                  Import more
                </span>
              </button>
            </div>
          )
        ) : (
          // Project tab (static demo clips)
          <div className="space-y-2">
            <p
              className="text-[10px]"
              style={{ color: "var(--editor-subtle)" }}
            >
              Demo project clips — import real files in the "Imported" tab.
            </p>
            {[
              {
                name: "Ocean_Sunset.mp4",
                dur: "0:08",
                color: "#1A3A5C",
                type: "video",
              },
              {
                name: "City_Night.mp4",
                dur: "0:06",
                color: "#0D1B2A",
                type: "video",
              },
              {
                name: "Beach_Walk.mp4",
                dur: "0:05",
                color: "#1A4A3A",
                type: "video",
              },
              {
                name: "Drone_Shot.mp4",
                dur: "0:07",
                color: "#1A2A4A",
                type: "video",
              },
              {
                name: "Background_Music.mp3",
                dur: "0:14",
                color: "#1A3A2A",
                type: "audio",
              },
              {
                name: "Voiceover.mp3",
                dur: "0:10",
                color: "#1A2A3A",
                type: "audio",
              },
            ].map((item, idx) => (
              <div
                key={item.name}
                className="group rounded-lg overflow-hidden"
                style={{
                  background: "var(--editor-surface)",
                  border: "1px solid var(--editor-border)",
                }}
                data-ocid={`media.item.${idx + 1}`}
              >
                <div
                  className="w-full h-14 flex items-center justify-center relative"
                  style={{ background: item.color }}
                >
                  {item.type === "audio" ? (
                    <AudioWaveform />
                  ) : (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.15)" }}
                    >
                      <div
                        className="w-0 h-0"
                        style={{
                          borderLeft: "8px solid rgba(255,255,255,0.8)",
                          borderTop: "5px solid transparent",
                          borderBottom: "5px solid transparent",
                        }}
                      />
                    </div>
                  )}
                  <span
                    className="absolute bottom-1 right-1 text-[9px] font-mono px-1 rounded"
                    style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}
                  >
                    {item.dur}
                  </span>
                </div>
                <div className="px-2 py-1.5">
                  <p
                    className="text-[10px] font-medium truncate"
                    style={{ color: "var(--editor-text)" }}
                  >
                    {item.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
