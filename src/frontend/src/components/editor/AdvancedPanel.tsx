import { useEditorStore } from "@/hooks/useEditorStore";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const BLEND_MODES = [
  "Normal",
  "Multiply",
  "Screen",
  "Overlay",
  "Soft Light",
  "Hard Light",
  "Difference",
  "Exclusion",
];

export function AdvancedPanel() {
  const { chromaKey, setChromaKey, pip, setPip, blendMode, setBlendMode } =
    useEditorStore();
  const [chromaColor, setChromaColor] = useState("#00FF00");
  const [pipPosition, setPipPosition] = useState("top-right");
  const [keyframes, setKeyframes] = useState([
    { id: "kf1", time: 0, x: 0, y: 0, scale: 1, opacity: 1 },
    { id: "kf2", time: 5, x: 50, y: 20, scale: 1.2, opacity: 0.9 },
    { id: "kf3", time: 10, x: 0, y: 0, scale: 1, opacity: 1 },
  ]);

  const addKeyframe = () => {
    const newKf = {
      id: `kf${Date.now()}`,
      time: keyframes.length * 5,
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
    };
    setKeyframes((prev) => [...prev, newKf]);
    toast.success("Keyframe added");
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
          Advanced
        </h2>
      </div>

      <div className="p-3 space-y-4">
        {/* Keyframe Animation */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--editor-border)" }}
        >
          <div
            className="flex items-center justify-between px-3 py-2"
            style={{ background: "var(--editor-inner)" }}
          >
            <span
              className="text-xs font-semibold"
              style={{ color: "var(--editor-text)" }}
            >
              Keyframe Animation
            </span>
            <button
              type="button"
              onClick={addKeyframe}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium"
              style={{ background: "var(--editor-purple)", color: "#fff" }}
              data-ocid="advanced.keyframe.primary_button"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          <div style={{ background: "var(--editor-surface)" }}>
            {keyframes.map((kf, idx) => (
              <div
                key={kf.id}
                className="flex items-center justify-between px-3 py-2"
                style={{
                  borderTop:
                    idx > 0 ? "1px solid var(--editor-border)" : "none",
                }}
                data-ocid={`advanced.keyframe.item.${idx + 1}`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: "var(--editor-purple-light)" }}
                  />
                  <span
                    className="text-xs font-mono"
                    style={{ color: "var(--editor-text)" }}
                  >
                    {kf.time}s
                  </span>
                </div>
                <div
                  className="flex gap-3 text-[10px]"
                  style={{ color: "var(--editor-muted)" }}
                >
                  <span>X:{kf.x}</span>
                  <span>Y:{kf.y}</span>
                  <span>S:{kf.scale}</span>
                  <span>O:{kf.opacity}</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setKeyframes((prev) => prev.filter((k) => k.id !== kf.id))
                  }
                  className="text-[10px] px-1.5 py-0.5 rounded"
                  style={{
                    color: "var(--editor-muted)",
                    background: "var(--editor-inner)",
                  }}
                  data-ocid={`advanced.keyframe.delete_button.${idx + 1}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Chroma Key */}
        <div
          className="rounded-xl p-3"
          style={{
            background: "var(--editor-surface)",
            border: "1px solid var(--editor-border)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p
                className="text-xs font-semibold"
                style={{ color: "var(--editor-text)" }}
              >
                Chroma Key
              </p>
              <p
                className="text-[10px]"
                style={{ color: "var(--editor-muted)" }}
              >
                Green screen removal
              </p>
            </div>
            <button
              type="button"
              onClick={() => setChromaKey(!chromaKey)}
              className="relative w-10 h-5 rounded-full transition-colors flex-none"
              style={{
                background: chromaKey
                  ? "var(--editor-purple)"
                  : "var(--editor-inner)",
                border: "1px solid var(--editor-border2)",
              }}
              data-ocid="advanced.chroma_key.toggle"
            >
              <span
                className="absolute top-0.5 transition-transform w-4 h-4 rounded-full bg-white"
                style={{
                  transform: chromaKey ? "translateX(20px)" : "translateX(2px)",
                }}
              />
            </button>
          </div>
          {chromaKey && (
            <div className="flex items-center gap-3">
              <span
                className="text-[10px]"
                style={{ color: "var(--editor-muted)" }}
              >
                Key Color
              </span>
              <input
                type="color"
                value={chromaColor}
                onChange={(e) => setChromaColor(e.target.value)}
                className="w-8 h-6 rounded cursor-pointer"
                style={{ border: "1px solid var(--editor-border2)" }}
                data-ocid="advanced.chroma_color.input"
              />
              <span
                className="text-[10px] font-mono"
                style={{ color: "var(--editor-muted)" }}
              >
                {chromaColor}
              </span>
            </div>
          )}
        </div>

        {/* Picture-in-Picture */}
        <div
          className="rounded-xl p-3"
          style={{
            background: "var(--editor-surface)",
            border: "1px solid var(--editor-border)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <p
                className="text-xs font-semibold"
                style={{ color: "var(--editor-text)" }}
              >
                Picture-in-Picture
              </p>
              <p
                className="text-[10px]"
                style={{ color: "var(--editor-muted)" }}
              >
                Overlay a second video
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPip(!pip)}
              className="relative w-10 h-5 rounded-full transition-colors flex-none"
              style={{
                background: pip
                  ? "var(--editor-purple)"
                  : "var(--editor-inner)",
                border: "1px solid var(--editor-border2)",
              }}
              data-ocid="advanced.pip.toggle"
            >
              <span
                className="absolute top-0.5 transition-transform w-4 h-4 rounded-full bg-white"
                style={{
                  transform: pip ? "translateX(20px)" : "translateX(2px)",
                }}
              />
            </button>
          </div>
          {pip && (
            <div className="grid grid-cols-2 gap-1 mt-2">
              {["top-left", "top-right", "bottom-left", "bottom-right"].map(
                (pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setPipPosition(pos)}
                    className="py-1 rounded text-[10px] font-medium transition-colors"
                    style={{
                      background:
                        pipPosition === pos
                          ? "rgba(124,58,237,0.2)"
                          : "var(--editor-inner)",
                      border: `1px solid ${pipPosition === pos ? "var(--editor-purple)" : "var(--editor-border)"}`,
                      color:
                        pipPosition === pos
                          ? "var(--editor-purple-light)"
                          : "var(--editor-muted)",
                    }}
                  >
                    {pos.replace("-", " ")}
                  </button>
                ),
              )}
            </div>
          )}
        </div>

        {/* Blend Mode */}
        <div
          className="rounded-xl p-3"
          style={{
            background: "var(--editor-surface)",
            border: "1px solid var(--editor-border)",
          }}
        >
          <p
            className="text-xs font-semibold mb-2"
            style={{ color: "var(--editor-text)" }}
          >
            Blend Mode
          </p>
          <div className="grid grid-cols-2 gap-1">
            {BLEND_MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setBlendMode(mode)}
                className="py-1.5 rounded text-[10px] font-medium transition-colors"
                style={{
                  background:
                    blendMode === mode
                      ? "rgba(124,58,237,0.2)"
                      : "var(--editor-inner)",
                  border: `1px solid ${blendMode === mode ? "var(--editor-purple)" : "var(--editor-border)"}`,
                  color:
                    blendMode === mode
                      ? "var(--editor-purple-light)"
                      : "var(--editor-muted)",
                }}
                data-ocid={`advanced.blend.${mode.toLowerCase().replace(" ", "_")}.button`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
