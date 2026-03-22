import { useEditorStore } from "@/hooks/useEditorStore";
import { AIPanel } from "./AIPanel";
import { AdvancedPanel } from "./AdvancedPanel";
import { AudioPanel } from "./AudioPanel";
import { EffectsPanel } from "./EffectsPanel";
import { ExportPanel } from "./ExportPanel";
import { FiltersPanel } from "./FiltersPanel";
import { MediaPanel } from "./MediaPanel";
import { TextPanel } from "./TextPanel";

function AdjustmentsPanel() {
  return (
    <div
      className="w-72 flex-none overflow-y-auto border-r panel-enter"
      style={{
        background: "var(--editor-panel)",
        borderColor: "var(--editor-border)",
      }}
    >
      <div className="p-4">
        <h2
          className="text-sm font-semibold mb-4"
          style={{ color: "var(--editor-text)" }}
        >
          Adjustments
        </h2>
        <div className="space-y-4">
          {[
            { label: "Brightness", value: 0 },
            { label: "Contrast", value: 0 },
            { label: "Saturation", value: 0 },
            { label: "Sharpness", value: 0 },
            { label: "Exposure", value: 0 },
            { label: "Highlights", value: 0 },
            { label: "Shadows", value: 0 },
            { label: "Warmth", value: 0 },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between mb-1">
                <span
                  className="text-xs"
                  style={{ color: "var(--editor-muted)" }}
                >
                  {item.label}
                </span>
                <span
                  className="text-xs font-mono"
                  style={{ color: "var(--editor-purple-light)" }}
                >
                  {item.value}
                </span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                defaultValue={item.value}
                className="w-full h-1 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: "var(--editor-purple)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TransitionsPanel() {
  const transitions = [
    { name: "Fade", desc: "Smooth fade between clips" },
    { name: "Slide Left", desc: "Slide from right to left" },
    { name: "Slide Right", desc: "Slide from left to right" },
    { name: "Zoom In", desc: "Zoom in from center" },
    { name: "Zoom Out", desc: "Zoom out to edges" },
    { name: "Wipe", desc: "Horizontal wipe transition" },
    { name: "Dissolve", desc: "Cross dissolve blend" },
    { name: "Spin", desc: "360 degree spin" },
  ];
  const { activeTransition, setActiveTransition } = useEditorStore();

  return (
    <div
      className="w-72 flex-none overflow-y-auto border-r panel-enter"
      style={{
        background: "var(--editor-panel)",
        borderColor: "var(--editor-border)",
      }}
    >
      <div className="p-4">
        <h2
          className="text-sm font-semibold mb-1"
          style={{ color: "var(--editor-text)" }}
        >
          Transitions
        </h2>
        <p className="text-xs mb-4" style={{ color: "var(--editor-muted)" }}>
          Applied between clips on the timeline
        </p>
        <div className="grid grid-cols-2 gap-2">
          {transitions.map((t) => (
            <button
              key={t.name}
              type="button"
              onClick={() =>
                setActiveTransition(t.name === activeTransition ? null : t.name)
              }
              className="p-3 rounded-lg text-left transition-all"
              style={{
                background:
                  activeTransition === t.name
                    ? "rgba(124,58,237,0.2)"
                    : "var(--editor-surface)",
                border:
                  activeTransition === t.name
                    ? "1px solid var(--editor-purple)"
                    : "1px solid var(--editor-border)",
              }}
              data-ocid={`transitions.${t.name.toLowerCase().replace(" ", "_")}.button`}
            >
              <div
                className="text-xs font-medium"
                style={{ color: "var(--editor-text)" }}
              >
                {t.name}
              </div>
              <div
                className="text-xs mt-0.5"
                style={{ color: "var(--editor-muted)" }}
              >
                {t.desc}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ActivePanel() {
  const { activePanel } = useEditorStore();

  switch (activePanel) {
    case "media":
      return <MediaPanel />;
    case "audio":
      return <AudioPanel />;
    case "text":
      return <TextPanel />;
    case "transitions":
      return <TransitionsPanel />;
    case "effects":
      return <EffectsPanel />;
    case "filters":
      return <FiltersPanel />;
    case "adjustments":
      return <AdjustmentsPanel />;
    case "ai":
      return <AIPanel />;
    case "export":
      return <ExportPanel />;
    case "advanced":
      return <AdvancedPanel />;
    default:
      return <MediaPanel />;
  }
}
