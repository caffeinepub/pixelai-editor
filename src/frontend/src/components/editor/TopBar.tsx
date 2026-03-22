import { useEditorStore } from "@/hooks/useEditorStore";
import { ChevronDown, Share2 } from "lucide-react";
import { useState } from "react";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  const ms = Math.floor((seconds % 1) * 100)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}:${ms}`;
}

const MENUS = ["File", "Edit", "View", "Project", "Help"];

export function TopBar() {
  const {
    currentTime,
    duration,
    exportSettings,
    setExportSettings,
    setActivePanel,
  } = useEditorStore();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);

  const cycleResolution = () => {
    const resolutions: Array<"720p" | "1080p" | "4K"> = ["720p", "1080p", "4K"];
    const idx = resolutions.indexOf(exportSettings.resolution);
    setExportSettings((s) => ({
      ...s,
      resolution: resolutions[(idx + 1) % 3],
    }));
  };

  return (
    <header
      className="flex items-center gap-0 px-3 h-11 flex-none border-b"
      style={{
        background: "var(--editor-surface)",
        borderColor: "var(--editor-border)",
      }}
    >
      {/* Logo + Title */}
      <div className="flex items-center gap-2 mr-4">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-white text-sm flex-none"
          style={{ background: "var(--editor-purple)" }}
        >
          P
        </div>
        <span
          className="font-semibold text-sm whitespace-nowrap"
          style={{ color: "var(--editor-text)" }}
        >
          PIXELAI Editor
        </span>
      </div>

      {/* Menu links */}
      <nav className="flex items-center gap-0.5 mr-4">
        {MENUS.map((menu) => (
          <button
            key={menu}
            type="button"
            onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
            className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
            style={{
              color:
                activeMenu === menu
                  ? "var(--editor-text)"
                  : "var(--editor-muted)",
              background:
                activeMenu === menu ? "var(--editor-inner)" : "transparent",
            }}
            data-ocid={`topbar.${menu.toLowerCase()}.link`}
          >
            {menu}
          </button>
        ))}
      </nav>

      <div className="flex-1" />

      {/* Timecode */}
      <div
        className="flex items-center gap-1 px-3 py-1 rounded mr-3"
        style={{
          background: "var(--editor-inner)",
          border: "1px solid var(--editor-border)",
        }}
      >
        <span
          className="font-mono text-xs"
          style={{ color: "var(--editor-purple-light)" }}
          data-ocid="topbar.timecode.panel"
        >
          {formatTime(currentTime)}
        </span>
        <span className="text-xs" style={{ color: "var(--editor-border2)" }}>
          /
        </span>
        <span
          className="font-mono text-xs"
          style={{ color: "var(--editor-muted)" }}
        >
          {formatTime(duration)}
        </span>
      </div>

      {/* Zoom control */}
      <div
        className="flex items-center gap-1 px-2 py-1 rounded mr-2"
        style={{
          background: "var(--editor-inner)",
          border: "1px solid var(--editor-border)",
        }}
      >
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(25, z - 25))}
          className="text-xs w-4 h-4 flex items-center justify-center"
          style={{ color: "var(--editor-muted)" }}
        >
          −
        </button>
        <span
          className="text-xs font-mono px-1"
          style={{ color: "var(--editor-muted)" }}
        >
          {zoom}%
        </span>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(400, z + 25))}
          className="text-xs w-4 h-4 flex items-center justify-center"
          style={{ color: "var(--editor-muted)" }}
        >
          +
        </button>
      </div>

      {/* Resolution dropdown — real button */}
      <button
        type="button"
        onClick={cycleResolution}
        className="flex items-center gap-1 px-2 py-1 rounded mr-3 cursor-pointer"
        style={{
          background: "var(--editor-inner)",
          border: "1px solid var(--editor-border)",
        }}
        data-ocid="topbar.resolution.select"
      >
        <span
          className="text-xs font-medium"
          style={{ color: "var(--editor-text)" }}
        >
          {exportSettings.resolution}
        </span>
        <ChevronDown
          className="w-3 h-3"
          style={{ color: "var(--editor-muted)" }}
        />
      </button>

      {/* Export button */}
      <button
        type="button"
        onClick={() => setActivePanel("export")}
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold text-white transition-opacity hover:opacity-90"
        style={{ background: "var(--editor-purple)" }}
        data-ocid="topbar.export.primary_button"
      >
        <Share2 className="w-3.5 h-3.5" />
        Export / Share
      </button>
    </header>
  );
}
