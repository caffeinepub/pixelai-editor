import { useEditorStore } from "@/hooks/useEditorStore";
import { useState } from "react";

const specialEffects = [
  {
    id: "glitch",
    name: "Glitch",
    desc: "Digital glitch distortion",
    defaultIntensity: 50,
  },
  {
    id: "blur",
    name: "Blur",
    desc: "Motion blur overlay",
    defaultIntensity: 30,
  },
  {
    id: "vignette",
    name: "Vignette",
    desc: "Dark edge fade",
    defaultIntensity: 40,
  },
];

const transitionEffects = [
  { id: "fade", name: "Fade", desc: "Smooth fade to black" },
  { id: "slide", name: "Slide", desc: "Horizontal slide" },
  { id: "zoom", name: "Zoom", desc: "Zoom in/out" },
  { id: "wipe", name: "Wipe", desc: "Curtain wipe" },
];

export function EffectsPanel() {
  const {
    activeEffect,
    setActiveEffect,
    activeTransition,
    setActiveTransition,
  } = useEditorStore();
  const [intensities, setIntensities] = useState<Record<string, number>>(
    Object.fromEntries(specialEffects.map((e) => [e.id, e.defaultIntensity])),
  );

  return (
    <div
      className="w-72 flex-none overflow-y-auto border-r panel-enter"
      style={{
        background: "var(--editor-panel)",
        borderColor: "var(--editor-border)",
      }}
    >
      {/* Special Effects */}
      <div
        className="px-4 py-3 border-b"
        style={{ borderColor: "var(--editor-border)" }}
      >
        <h2
          className="text-sm font-semibold"
          style={{ color: "var(--editor-text)" }}
        >
          Special Effects
        </h2>
      </div>
      <div className="p-3 space-y-2">
        {specialEffects.map((effect) => {
          const isOn = activeEffect === effect.id;
          return (
            <div
              key={effect.id}
              className="rounded-lg p-3"
              style={{
                background: isOn
                  ? "rgba(124,58,237,0.1)"
                  : "var(--editor-surface)",
                border: `1px solid ${isOn ? "var(--editor-purple)" : "var(--editor-border)"}`,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "var(--editor-text)" }}
                  >
                    {effect.name}
                  </p>
                  <p
                    className="text-[10px]"
                    style={{ color: "var(--editor-muted)" }}
                  >
                    {effect.desc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveEffect(isOn ? null : effect.id)}
                  className="relative w-10 h-5 rounded-full transition-colors flex-none"
                  style={{
                    background: isOn
                      ? "var(--editor-purple)"
                      : "var(--editor-inner)",
                    border: "1px solid var(--editor-border2)",
                  }}
                  data-ocid={`effects.${effect.id}.toggle`}
                >
                  <span
                    className="absolute top-0.5 transition-transform w-4 h-4 rounded-full bg-white"
                    style={{
                      transform: isOn ? "translateX(20px)" : "translateX(2px)",
                    }}
                  />
                </button>
              </div>
              {isOn && (
                <div>
                  <div className="flex justify-between mb-1">
                    <span
                      className="text-[10px]"
                      style={{ color: "var(--editor-muted)" }}
                    >
                      Intensity
                    </span>
                    <span
                      className="text-[10px] font-mono"
                      style={{ color: "var(--editor-purple-light)" }}
                    >
                      {intensities[effect.id]}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={intensities[effect.id]}
                    onChange={(e) =>
                      setIntensities((prev) => ({
                        ...prev,
                        [effect.id]: Number(e.target.value),
                      }))
                    }
                    className="w-full h-1 rounded-full appearance-none"
                    style={{ accentColor: "var(--editor-purple)" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Transition Effects */}
      <div
        className="px-4 py-3 border-t border-b"
        style={{ borderColor: "var(--editor-border)" }}
      >
        <h2
          className="text-sm font-semibold"
          style={{ color: "var(--editor-text)" }}
        >
          Transition Effects
        </h2>
        <p className="text-xs mt-0.5" style={{ color: "var(--editor-muted)" }}>
          Between clips
        </p>
      </div>
      <div className="p-3 grid grid-cols-2 gap-2">
        {transitionEffects.map((t) => {
          const isActive = activeTransition === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTransition(isActive ? null : t.id)}
              className="p-3 rounded-lg text-left transition-all"
              style={{
                background: isActive
                  ? "rgba(124,58,237,0.15)"
                  : "var(--editor-surface)",
                border: `1px solid ${isActive ? "var(--editor-purple)" : "var(--editor-border)"}`,
              }}
              data-ocid={`effects.transition.${t.id}.button`}
            >
              <p
                className="text-xs font-semibold"
                style={{
                  color: isActive
                    ? "var(--editor-purple-light)"
                    : "var(--editor-text)",
                }}
              >
                {t.name}
              </p>
              <p
                className="text-[10px] mt-0.5"
                style={{ color: "var(--editor-muted)" }}
              >
                {t.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
