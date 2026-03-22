import { useEditorStore } from "@/hooks/useEditorStore";
import { Mic, Music, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";

export function AudioPanel() {
  const {
    audioTracks,
    setAudioTracks,
    beatSync,
    setBeatSync,
    noiseRemoval,
    setNoiseRemoval,
  } = useEditorStore();

  const toggleMute = (id: string) => {
    setAudioTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, muted: !t.muted } : t)),
    );
  };

  const setVolume = (id: string, vol: number) => {
    setAudioTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, volume: vol } : t)),
    );
  };

  const toggleFade = (id: string, type: "fadeIn" | "fadeOut") => {
    setAudioTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [type]: !t[type] } : t)),
    );
  };

  return (
    <div
      className="w-72 flex-none overflow-y-auto border-r panel-enter"
      style={{
        background: "var(--editor-panel)",
        borderColor: "var(--editor-border)",
      }}
    >
      <div
        className="px-4 py-3 border-b"
        style={{ borderColor: "var(--editor-border)" }}
      >
        <h2
          className="text-sm font-semibold"
          style={{ color: "var(--editor-text)" }}
        >
          Audio
        </h2>
      </div>

      <div className="p-3 space-y-3">
        {/* Add buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => toast.success("Music track added")}
            className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
            style={{
              background: "var(--editor-surface)",
              border: "1px solid var(--editor-border)",
              color: "var(--editor-teal)",
            }}
            data-ocid="audio.add_music.button"
          >
            <Music className="w-3.5 h-3.5" />
            Add Music
          </button>
          <button
            type="button"
            onClick={() => toast.success("Voiceover track added")}
            className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
            style={{
              background: "var(--editor-surface)",
              border: "1px solid var(--editor-border)",
              color: "var(--editor-teal)",
            }}
            data-ocid="audio.add_voiceover.button"
          >
            <Mic className="w-3.5 h-3.5" />
            Voiceover
          </button>
        </div>

        {/* Track list */}
        {audioTracks.map((track, idx) => (
          <div
            key={track.id}
            className="rounded-xl p-3 space-y-2"
            style={{
              background: "var(--editor-surface)",
              border: "1px solid var(--editor-border)",
            }}
            data-ocid={`audio.item.${idx + 1}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleMute(track.id)}
                  className="w-6 h-6 rounded flex items-center justify-center"
                  style={{
                    background: track.muted
                      ? "rgba(255,100,100,0.2)"
                      : "rgba(45,212,191,0.1)",
                  }}
                  data-ocid={`audio.mute.toggle.${idx + 1}`}
                >
                  {track.muted ? (
                    <VolumeX className="w-3 h-3" style={{ color: "#ff6464" }} />
                  ) : (
                    <Volume2
                      className="w-3 h-3"
                      style={{ color: "var(--editor-teal)" }}
                    />
                  )}
                </button>
                <div>
                  <p
                    className="text-xs font-medium"
                    style={{ color: "var(--editor-text)" }}
                  >
                    {track.name}
                  </p>
                  <p
                    className="text-[10px]"
                    style={{ color: "var(--editor-muted)" }}
                  >
                    {track.track.toUpperCase()} · {track.duration}s
                  </p>
                </div>
              </div>
            </div>

            {/* Volume */}
            <div>
              <div className="flex justify-between mb-1">
                <span
                  className="text-[10px]"
                  style={{ color: "var(--editor-muted)" }}
                >
                  Volume
                </span>
                <span
                  className="text-[10px] font-mono"
                  style={{ color: "var(--editor-teal)" }}
                >
                  {track.volume}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={track.volume}
                onChange={(e) => setVolume(track.id, Number(e.target.value))}
                className="w-full h-1 rounded-full appearance-none"
                style={{ accentColor: "var(--editor-teal)" }}
                data-ocid={`audio.volume.input.${idx + 1}`}
              />
            </div>

            {/* Fade toggles */}
            <div className="flex gap-2">
              {(["fadeIn", "fadeOut"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleFade(track.id, type)}
                  className="flex-1 py-1 rounded text-[10px] font-medium transition-colors"
                  style={{
                    background: track[type]
                      ? "rgba(45,212,191,0.15)"
                      : "var(--editor-inner)",
                    border: `1px solid ${track[type] ? "var(--editor-teal)" : "var(--editor-border)"}`,
                    color: track[type]
                      ? "var(--editor-teal)"
                      : "var(--editor-subtle)",
                  }}
                >
                  {type === "fadeIn" ? "Fade In" : "Fade Out"}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* AI toggles */}
        <div
          className="rounded-xl p-3 space-y-3"
          style={{
            background: "var(--editor-surface)",
            border: "1px solid var(--editor-border)",
          }}
        >
          <h3
            className="text-xs font-semibold"
            style={{ color: "var(--editor-text)" }}
          >
            AI Audio
          </h3>

          {[
            {
              label: "Beat Sync",
              desc: "Sync cuts to music beats",
              val: beatSync,
              set: setBeatSync,
              id: "beat_sync",
            },
            {
              label: "Noise Removal",
              desc: "Remove background noise",
              val: noiseRemoval,
              set: setNoiseRemoval,
              id: "noise_removal",
            },
          ].map(({ label, desc, val, set, id }) => (
            <div key={id} className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--editor-text)" }}
                  >
                    {label}
                  </span>
                  <span
                    className="text-[9px] px-1 py-0.5 rounded font-bold"
                    style={{
                      background: "var(--editor-purple)",
                      color: "#fff",
                    }}
                  >
                    AI
                  </span>
                </div>
                <p
                  className="text-[10px]"
                  style={{ color: "var(--editor-muted)" }}
                >
                  {desc}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  set(!val);
                  if (!val) toast.success(`${label} enabled`);
                }}
                className="relative w-10 h-5 rounded-full transition-colors flex-none"
                style={{
                  background: val
                    ? "var(--editor-purple)"
                    : "var(--editor-inner)",
                  border: "1px solid var(--editor-border2)",
                }}
                data-ocid={`audio.${id}.toggle`}
              >
                <span
                  className="absolute top-0.5 transition-transform w-4 h-4 rounded-full bg-white"
                  style={{
                    transform: val ? "translateX(20px)" : "translateX(2px)",
                  }}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Master volume */}
        <div
          className="rounded-xl p-3"
          style={{
            background: "var(--editor-surface)",
            border: "1px solid var(--editor-border)",
          }}
        >
          <div className="flex justify-between mb-2">
            <span
              className="text-xs font-semibold"
              style={{ color: "var(--editor-text)" }}
            >
              Master Volume
            </span>
            <span
              className="text-xs font-mono"
              style={{ color: "var(--editor-teal)" }}
            >
              100%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            defaultValue={100}
            className="w-full h-1 rounded-full appearance-none"
            style={{ accentColor: "var(--editor-teal)" }}
          />
        </div>
      </div>
    </div>
  );
}
