import { type ActivePanel, useEditorStore } from "@/hooks/useEditorStore";
import {
  AudioLines,
  Bot,
  Download,
  Film,
  Layers,
  Palette,
  Settings2,
  Sliders,
  Sparkles,
  Type,
} from "lucide-react";

const tools: { id: ActivePanel; icon: React.ElementType; label: string }[] = [
  { id: "media", icon: Film, label: "Media" },
  { id: "audio", icon: AudioLines, label: "Audio" },
  { id: "text", icon: Type, label: "Text" },
  { id: "transitions", icon: Layers, label: "Transitions" },
  { id: "effects", icon: Sparkles, label: "Effects" },
  { id: "filters", icon: Palette, label: "Filters" },
  { id: "adjustments", icon: Sliders, label: "Adjust" },
  { id: "ai", icon: Bot, label: "AI Tools" },
  { id: "advanced", icon: Settings2, label: "Advanced" },
  { id: "export", icon: Download, label: "Export" },
];

export function ToolRail() {
  const { activePanel, setActivePanel } = useEditorStore();

  return (
    <aside
      className="w-16 flex-none flex flex-col border-r overflow-y-auto"
      style={{
        background: "var(--editor-panel)",
        borderColor: "var(--editor-border)",
      }}
    >
      <div className="flex flex-col gap-0.5 py-2 px-1">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activePanel === tool.id;
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => setActivePanel(tool.id)}
              className="flex flex-col items-center gap-1 py-2.5 px-1 rounded-lg transition-all"
              style={{
                background: isActive ? "rgba(124,58,237,0.2)" : "transparent",
                border: isActive
                  ? "1px solid rgba(124,58,237,0.4)"
                  : "1px solid transparent",
              }}
              title={tool.label}
              data-ocid={`toolrail.${tool.id}.button`}
            >
              <Icon
                className="w-4 h-4"
                style={{
                  color: isActive
                    ? "var(--editor-purple-light)"
                    : "var(--editor-muted)",
                }}
              />
              <span
                className="text-[9px] leading-tight text-center"
                style={{
                  color: isActive
                    ? "var(--editor-purple-light)"
                    : "var(--editor-subtle)",
                }}
              >
                {tool.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
