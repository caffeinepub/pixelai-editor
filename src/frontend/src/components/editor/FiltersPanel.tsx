import { useEditorStore } from "@/hooks/useEditorStore";
import { Check } from "lucide-react";

const filters = [
  {
    name: "Cinematic",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    desc: "Hollywood look",
  },
  {
    name: "Retro",
    gradient: "linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #F4A460 100%)",
    desc: "Vintage film feel",
  },
  {
    name: "Bright",
    gradient: "linear-gradient(135deg, #FFF9C4 0%, #FFEB3B 50%, #FFF176 100%)",
    desc: "Vivid and airy",
  },
  {
    name: "Vintage",
    gradient: "linear-gradient(135deg, #8D6E63 0%, #A1887F 50%, #BCAAA4 100%)",
    desc: "Faded tones",
  },
  {
    name: "Noir",
    gradient: "linear-gradient(135deg, #000 0%, #333 50%, #666 100%)",
    desc: "Black and white",
  },
  {
    name: "Warm",
    gradient: "linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFD700 100%)",
    desc: "Golden tones",
  },
  {
    name: "Cool",
    gradient: "linear-gradient(135deg, #0077B6 0%, #00B4D8 50%, #90E0EF 100%)",
    desc: "Arctic blues",
  },
  {
    name: "None",
    gradient: "linear-gradient(135deg, #242836 0%, #2C3142 100%)",
    desc: "Original colors",
  },
];

export function FiltersPanel() {
  const { activeFilter, setActiveFilter } = useEditorStore();

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
          Color Filters
        </h2>
        <p className="text-xs mt-0.5" style={{ color: "var(--editor-muted)" }}>
          Apply color grading presets
        </p>
      </div>

      <div className="p-3 grid grid-cols-2 gap-3">
        {filters.map((filter, idx) => {
          const isActive = activeFilter === filter.name;
          return (
            <button
              key={filter.name}
              type="button"
              onClick={() => setActiveFilter(isActive ? null : filter.name)}
              className="rounded-xl overflow-hidden text-left transition-all hover:scale-105"
              style={{
                border: isActive
                  ? "2px solid var(--editor-purple)"
                  : "2px solid var(--editor-border)",
                outline: isActive ? "1px solid rgba(124,58,237,0.3)" : "none",
              }}
              data-ocid={`filters.${filter.name.toLowerCase()}.button`}
            >
              {/* Swatch */}
              <div
                className="w-full h-20 relative flex items-center justify-center"
                style={{ background: filter.gradient }}
              >
                {isActive && (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: "var(--editor-purple)" }}
                  >
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <span
                  className="absolute bottom-1 right-1 text-[9px]"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {idx + 1}
                </span>
              </div>
              {/* Label */}
              <div
                className="px-2 py-1.5"
                style={{ background: "var(--editor-surface)" }}
              >
                <p
                  className="text-xs font-semibold"
                  style={{
                    color: isActive
                      ? "var(--editor-purple-light)"
                      : "var(--editor-text)",
                  }}
                >
                  {filter.name}
                </p>
                <p
                  className="text-[10px]"
                  style={{ color: "var(--editor-muted)" }}
                >
                  {filter.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
