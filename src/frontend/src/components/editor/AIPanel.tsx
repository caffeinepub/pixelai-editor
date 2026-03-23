import { useEditorStore } from "@/hooks/useEditorStore";
import { Loader2, Sparkles, Wand2, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AIPanel() {
  const {
    autoCut,
    setAutoCut,
    bgRemoval,
    setBgRemoval,
    beatSync,
    setBeatSync,
    motionTracking,
    setMotionTracking,
  } = useEditorStore();

  const [prompt, setPrompt] = useState("");
  const [stylePrompt, setStylePrompt] = useState("anime");
  const [processing, setProcessing] = useState<string | null>(null);
  const [extraToggles, setExtraToggles] = useState<Record<string, boolean>>({
    noise_removal: false,
    ai_subtitles: false,
    face_enhance: false,
    super_res: false,
    style_transfer: false,
    object_removal: false,
  });

  const runAI = async (feature: string, action: () => void) => {
    setProcessing(feature);
    await new Promise((r) => setTimeout(r, 1500));
    action();
    setProcessing(null);
    toast.success(`${feature} complete!`);
  };

  const toggleExtra = (id: string) => {
    const label = extraFeatures.find((f) => f.id === id)?.label ?? id;
    runAI(label, () =>
      setExtraToggles((prev) => ({ ...prev, [id]: !prev[id] })),
    );
  };

  const features = [
    {
      id: "auto_cut",
      label: "Auto-Cut",
      desc: "Remove silence and dead space automatically",
      val: autoCut,
      set: setAutoCut,
    },
    {
      id: "bg_removal",
      label: "Background Removal",
      desc: "AI-powered background removal",
      val: bgRemoval,
      set: setBgRemoval,
    },
    {
      id: "beat_sync",
      label: "Beat Sync",
      desc: "Sync cuts to music beats",
      val: beatSync,
      set: setBeatSync,
    },
    {
      id: "motion_tracking",
      label: "Motion Tracking",
      desc: "Track and follow objects in clips",
      val: motionTracking,
      set: setMotionTracking,
    },
  ];

  const extraFeatures = [
    {
      id: "noise_removal",
      label: "Noise Removal",
      desc: "Remove background noise and audio hum",
    },
    {
      id: "ai_subtitles",
      label: "AI Subtitles",
      desc: "Auto-generate subtitles in 50+ languages",
    },
    {
      id: "face_enhance",
      label: "Face Enhance",
      desc: "Smooth skin and enhance facial features",
    },
    {
      id: "super_res",
      label: "Super Resolution",
      desc: "Upscale video to 4K with AI sharpening",
    },
    {
      id: "style_transfer",
      label: "Style Transfer",
      desc: "Apply artistic styles to your footage",
    },
    {
      id: "object_removal",
      label: "Object Removal",
      desc: "Erase unwanted objects from video",
    },
  ];

  const styleOptions = [
    { value: "anime", label: "Anime" },
    { value: "oil_painting", label: "Oil Painting" },
    { value: "watercolor", label: "Watercolor" },
    { value: "cyberpunk", label: "Cyberpunk" },
    { value: "vintage_film", label: "Vintage Film" },
  ];

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
        <div className="flex items-center gap-2">
          <Sparkles
            className="w-4 h-4"
            style={{ color: "var(--editor-purple-light)" }}
          />
          <h2
            className="text-sm font-semibold"
            style={{ color: "var(--editor-text)" }}
          >
            AI Tools
          </h2>
        </div>
        <p className="text-xs mt-0.5" style={{ color: "var(--editor-muted)" }}>
          Powered by PIXELAI
        </p>
      </div>

      <div className="p-3 space-y-3">
        {features.map(({ id, label, desc, val, set }) => (
          <div
            key={id}
            className="rounded-xl p-3 transition-all duration-200"
            style={{
              background: val
                ? "rgba(124,58,237,0.1)"
                : "var(--editor-surface)",
              border: `1px solid ${val ? "rgba(124,58,237,0.4)" : "var(--editor-border)"}`,
            }}
            data-ocid={`ai.${id}.card`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "var(--editor-text)" }}
                  >
                    {label}
                  </span>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded font-bold"
                    style={{
                      background:
                        "linear-gradient(90deg, var(--editor-purple), var(--editor-purple-light))",
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
              {processing === id ? (
                <Loader2
                  className="w-4 h-4 animate-spin"
                  style={{ color: "var(--editor-purple-light)" }}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => runAI(label, () => set(!val))}
                  className="relative w-10 h-5 rounded-full transition-colors flex-none ml-3"
                  style={{
                    background: val
                      ? "var(--editor-purple)"
                      : "var(--editor-inner)",
                    border: "1px solid var(--editor-border2)",
                  }}
                  data-ocid={`ai.${id}.toggle`}
                >
                  <span
                    className="absolute top-0.5 transition-transform w-4 h-4 rounded-full bg-white"
                    style={{
                      transform: val ? "translateX(20px)" : "translateX(2px)",
                    }}
                  />
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Text-to-Video */}
        <div
          className="rounded-xl p-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(139,92,246,0.08))",
            border: "1px solid rgba(124,58,237,0.35)",
          }}
          data-ocid="ai.text_to_video.card"
        >
          <div className="flex items-center gap-2 mb-3">
            <Wand2
              className="w-4 h-4"
              style={{ color: "var(--editor-purple-light)" }}
            />
            <span
              className="text-xs font-semibold"
              style={{ color: "var(--editor-text)" }}
            >
              AI Text-to-Video
            </span>
            <span
              className="text-[9px] px-1.5 py-0.5 rounded font-bold"
              style={{
                background:
                  "linear-gradient(90deg, var(--editor-purple), var(--editor-purple-light))",
                color: "#fff",
              }}
            >
              AI
            </span>
          </div>
          <p
            className="text-[10px] mb-3"
            style={{ color: "var(--editor-muted)" }}
          >
            Describe a scene and AI will generate video clips
          </p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A cinematic shot of ocean waves at sunset, golden hour..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg text-xs outline-none resize-none mb-2"
            style={{
              background: "var(--editor-inner)",
              border: "1px solid var(--editor-border2)",
              color: "var(--editor-text)",
            }}
            data-ocid="ai.text_to_video.textarea"
          />
          <button
            type="button"
            onClick={() => runAI("Text-to-Video", () => {})}
            disabled={processing === "Text-to-Video" || !prompt.trim()}
            className="w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "var(--editor-purple)", color: "#fff" }}
            data-ocid="ai.text_to_video.primary_button"
          >
            {processing === "Text-to-Video" ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3" /> Generate Video
              </>
            )}
          </button>
        </div>

        {/* More AI Effects divider */}
        <div className="flex items-center gap-2 pt-1">
          <div
            className="flex-1 h-px"
            style={{ background: "var(--editor-border)" }}
          />
          <span
            className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
            style={{
              color: "var(--editor-purple-light)",
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.25)",
            }}
          >
            More AI Effects
          </span>
          <div
            className="flex-1 h-px"
            style={{ background: "var(--editor-border)" }}
          />
        </div>

        {extraFeatures.map(({ id, label, desc }) => {
          const val = extraToggles[id];
          return (
            <div
              key={id}
              className="rounded-xl p-3 transition-all duration-200"
              style={{
                background: val
                  ? "rgba(124,58,237,0.1)"
                  : "var(--editor-surface)",
                border: `1px solid ${val ? "rgba(124,58,237,0.4)" : "var(--editor-border)"}`,
              }}
              data-ocid={`ai.${id}.card`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "var(--editor-text)" }}
                    >
                      {label}
                    </span>
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded font-bold"
                      style={{
                        background: "linear-gradient(90deg, #9333ea, #a855f7)",
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
                {processing === label ? (
                  <Loader2
                    className="w-4 h-4 animate-spin flex-none ml-3"
                    style={{ color: "var(--editor-purple-light)" }}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleExtra(id)}
                    className="relative w-10 h-5 rounded-full transition-colors flex-none ml-3"
                    style={{
                      background: val
                        ? "var(--editor-purple)"
                        : "var(--editor-inner)",
                      border: "1px solid var(--editor-border2)",
                    }}
                    data-ocid={`ai.${id}.toggle`}
                  >
                    <span
                      className="absolute top-0.5 transition-transform w-4 h-4 rounded-full bg-white"
                      style={{
                        transform: val ? "translateX(20px)" : "translateX(2px)",
                      }}
                    />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* AI Style Transfer card */}
        <div
          className="rounded-xl p-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(147,51,234,0.15), rgba(168,85,247,0.08))",
            border: "1px solid rgba(147,51,234,0.35)",
          }}
          data-ocid="ai.style_transfer.card"
        >
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4" style={{ color: "#a855f7" }} />
            <span
              className="text-xs font-semibold"
              style={{ color: "var(--editor-text)" }}
            >
              AI Style Transfer
            </span>
            <span
              className="text-[9px] px-1.5 py-0.5 rounded font-bold"
              style={{
                background: "linear-gradient(90deg, #9333ea, #a855f7)",
                color: "#fff",
              }}
            >
              AI
            </span>
          </div>
          <p
            className="text-[10px] mb-3"
            style={{ color: "var(--editor-muted)" }}
          >
            Apply an artistic style to your entire video in one click
          </p>
          <select
            value={stylePrompt}
            onChange={(e) => setStylePrompt(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-xs outline-none mb-2 appearance-none"
            style={{
              background: "var(--editor-inner)",
              border: "1px solid var(--editor-border2)",
              color: "var(--editor-text)",
            }}
            data-ocid="ai.style_transfer.select"
          >
            {styleOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => runAI("Style Transfer", () => {})}
            disabled={processing === "Style Transfer"}
            className="w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "#9333ea", color: "#fff" }}
            data-ocid="ai.style_transfer.primary_button"
          >
            {processing === "Style Transfer" ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" /> Applying...
              </>
            ) : (
              <>
                <Zap className="w-3 h-3" /> Apply Style
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
