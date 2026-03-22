import { useEditorStore } from "@/hooks/useEditorStore";
import { Download, Facebook, Instagram, Loader2, Youtube } from "lucide-react";
import { useState } from "react";
import { SiTiktok } from "react-icons/si";
import { toast } from "sonner";

export function ExportPanel() {
  const { exportSettings, setExportSettings } = useEditorStore();
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);

  const startExport = async () => {
    setIsRendering(true);
    setRenderProgress(0);
    for (let i = 0; i <= 100; i += 5) {
      await new Promise((r) => setTimeout(r, 80));
      setRenderProgress(i);
    }
    setIsRendering(false);
    toast.success("Export complete! File ready to download.");
  };

  const RESOLUTIONS: Array<"720p" | "1080p" | "4K"> = ["720p", "1080p", "4K"];
  const FORMATS: Array<"MP4" | "WebM" | "MOV"> = ["MP4", "WebM", "MOV"];
  const BITRATES: Array<"Low" | "Medium" | "High" | "Ultra"> = [
    "Low",
    "Medium",
    "High",
    "Ultra",
  ];
  const ASPECT_RATIOS: Array<{
    key: "TikTok 9:16" | "YouTube 16:9" | "Instagram 1:1" | "Story 4:5";
    icon: string;
    label: string;
  }> = [
    { key: "YouTube 16:9", icon: "▬", label: "YouTube" },
    { key: "TikTok 9:16", icon: "▮", label: "TikTok" },
    { key: "Instagram 1:1", icon: "■", label: "Instagram" },
    { key: "Story 4:5", icon: "▯", label: "Story" },
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
        <h2
          className="text-sm font-semibold"
          style={{ color: "var(--editor-text)" }}
        >
          Export &amp; Share
        </h2>
      </div>

      <div className="p-3 space-y-4">
        {/* Resolution */}
        <div>
          <p
            className="text-xs font-medium block mb-2"
            style={{ color: "var(--editor-muted)" }}
          >
            Resolution
          </p>
          <div className="flex gap-2">
            {RESOLUTIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() =>
                  setExportSettings((s) => ({ ...s, resolution: r }))
                }
                className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                style={{
                  background:
                    exportSettings.resolution === r
                      ? "rgba(124,58,237,0.2)"
                      : "var(--editor-surface)",
                  border: `1px solid ${exportSettings.resolution === r ? "var(--editor-purple)" : "var(--editor-border)"}`,
                  color:
                    exportSettings.resolution === r
                      ? "var(--editor-purple-light)"
                      : "var(--editor-muted)",
                }}
                data-ocid={`export.resolution.${r.toLowerCase()}.button`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Format */}
        <div>
          <p
            className="text-xs font-medium block mb-2"
            style={{ color: "var(--editor-muted)" }}
          >
            Format
          </p>
          <div className="flex gap-2">
            {FORMATS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setExportSettings((s) => ({ ...s, format: f }))}
                className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                style={{
                  background:
                    exportSettings.format === f
                      ? "rgba(124,58,237,0.2)"
                      : "var(--editor-surface)",
                  border: `1px solid ${exportSettings.format === f ? "var(--editor-purple)" : "var(--editor-border)"}`,
                  color:
                    exportSettings.format === f
                      ? "var(--editor-purple-light)"
                      : "var(--editor-muted)",
                }}
                data-ocid={`export.format.${f.toLowerCase()}.button`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Bitrate */}
        <div>
          <p
            className="text-xs font-medium block mb-2"
            style={{ color: "var(--editor-muted)" }}
          >
            Bitrate
          </p>
          <div className="grid grid-cols-4 gap-1">
            {BITRATES.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setExportSettings((s) => ({ ...s, bitrate: b }))}
                className="py-1.5 rounded text-xs font-medium transition-colors"
                style={{
                  background:
                    exportSettings.bitrate === b
                      ? "rgba(124,58,237,0.2)"
                      : "var(--editor-surface)",
                  border: `1px solid ${exportSettings.bitrate === b ? "var(--editor-purple)" : "var(--editor-border)"}`,
                  color:
                    exportSettings.bitrate === b
                      ? "var(--editor-purple-light)"
                      : "var(--editor-muted)",
                }}
                data-ocid={`export.bitrate.${b.toLowerCase()}.button`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Aspect Ratio */}
        <div>
          <p
            className="text-xs font-medium block mb-2"
            style={{ color: "var(--editor-muted)" }}
          >
            Aspect Ratio
          </p>
          <div className="grid grid-cols-2 gap-2">
            {ASPECT_RATIOS.map(({ key, icon, label }) => (
              <button
                key={key}
                type="button"
                onClick={() =>
                  setExportSettings((s) => ({ ...s, aspectRatio: key }))
                }
                className="py-2 rounded-lg flex flex-col items-center gap-1 transition-colors"
                style={{
                  background:
                    exportSettings.aspectRatio === key
                      ? "rgba(124,58,237,0.2)"
                      : "var(--editor-surface)",
                  border: `1px solid ${exportSettings.aspectRatio === key ? "var(--editor-purple)" : "var(--editor-border)"}`,
                }}
                data-ocid={`export.aspect.${label.toLowerCase()}.button`}
              >
                <span className="text-lg">{icon}</span>
                <span
                  className="text-[10px] font-semibold"
                  style={{
                    color:
                      exportSettings.aspectRatio === key
                        ? "var(--editor-purple-light)"
                        : "var(--editor-muted)",
                  }}
                >
                  {label}
                </span>
                <span
                  className="text-[9px]"
                  style={{ color: "var(--editor-subtle)" }}
                >
                  {key.split(" ")[1]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Social share */}
        <div>
          <p
            className="text-xs font-medium block mb-2"
            style={{ color: "var(--editor-muted)" }}
          >
            Share to Social
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[
              {
                name: "TikTok",
                color: "#000",
                textColor: "#fff",
                icon: <SiTiktok className="w-4 h-4" />,
              },
              {
                name: "YouTube",
                color: "#FF0000",
                textColor: "#fff",
                icon: <Youtube className="w-4 h-4" />,
              },
              {
                name: "Instagram",
                color:
                  "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
                textColor: "#fff",
                icon: <Instagram className="w-4 h-4" />,
              },
              {
                name: "Facebook",
                color: "#1877F2",
                textColor: "#fff",
                icon: <Facebook className="w-4 h-4" />,
              },
            ].map(({ name, color, textColor, icon }) => (
              <button
                key={name}
                type="button"
                onClick={() => toast.success(`Sharing to ${name}...`)}
                className="py-2 rounded-lg flex flex-col items-center gap-1 transition-opacity hover:opacity-80"
                style={{ background: color, color: textColor }}
                title={`Share to ${name}`}
                data-ocid={`export.${name.toLowerCase()}.button`}
              >
                {icon}
                <span className="text-[9px] font-semibold">{name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Render progress */}
        {isRendering && (
          <div
            className="rounded-xl p-3"
            style={{
              background: "var(--editor-surface)",
              border: "1px solid var(--editor-border)",
            }}
            data-ocid="export.rendering.loading_state"
          >
            <div className="flex justify-between mb-2">
              <span
                className="text-xs font-semibold"
                style={{ color: "var(--editor-text)" }}
              >
                Rendering...
              </span>
              <span
                className="text-xs font-mono"
                style={{ color: "var(--editor-purple-light)" }}
              >
                {renderProgress}%
              </span>
            </div>
            <div
              className="w-full h-2 rounded-full"
              style={{ background: "var(--editor-inner)" }}
            >
              <div
                className="h-2 rounded-full transition-all duration-75"
                style={{
                  width: `${renderProgress}%`,
                  background: "var(--editor-purple)",
                }}
              />
            </div>
          </div>
        )}

        {/* Download + Preview */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={startExport}
            disabled={isRendering}
            className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: "var(--editor-purple)", color: "#fff" }}
            data-ocid="export.download.primary_button"
          >
            {isRendering ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Rendering...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> Download{" "}
                {exportSettings.resolution} {exportSettings.format}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => toast.success("Render preview started")}
            className="w-full py-2 rounded-xl text-xs font-semibold transition-opacity hover:opacity-80"
            style={{
              background: "var(--editor-surface)",
              border: "1px solid var(--editor-border)",
              color: "var(--editor-muted)",
            }}
            data-ocid="export.preview.button"
          >
            Render Preview
          </button>
        </div>

        {/* Summary */}
        <div
          className="rounded-xl p-3"
          style={{
            background: "var(--editor-inner)",
            border: "1px solid var(--editor-border)",
          }}
        >
          <p
            className="text-[10px] font-semibold mb-1"
            style={{ color: "var(--editor-muted)" }}
          >
            Export Summary
          </p>
          <div className="space-y-0.5">
            {[
              ["Resolution", exportSettings.resolution],
              ["Format", exportSettings.format],
              ["Bitrate", exportSettings.bitrate],
              ["Aspect", exportSettings.aspectRatio],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span
                  className="text-[10px]"
                  style={{ color: "var(--editor-subtle)" }}
                >
                  {k}
                </span>
                <span
                  className="text-[10px] font-medium"
                  style={{ color: "var(--editor-text)" }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
