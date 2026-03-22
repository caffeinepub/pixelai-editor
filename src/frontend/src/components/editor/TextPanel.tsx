import { useEditorStore } from "@/hooks/useEditorStore";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Loader2,
  Plus,
  Underline,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const FONTS = [
  "Inter",
  "Roboto",
  "Montserrat",
  "Playfair Display",
  "Georgia",
  "Oswald",
  "Lato",
];
const ANIMATIONS = ["None", "Fade In", "Slide In", "Bounce", "Typewriter"];
const POSITIONS = ["Top", "Center", "Bottom", "Lower-Third"];
const COLOR_SWATCHES = [
  "#FFFFFF",
  "#FFD700",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#000000",
];
const PRESETS = ["Title", "Caption", "Lower Third", "Subtitle"];

export function TextPanel() {
  const { textOverlays, setTextOverlays } = useEditorStore();
  const [font, setFont] = useState("Inter");
  const [size, setSize] = useState(48);
  const [color, setColor] = useState("#FFFFFF");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [position, setPosition] = useState("Center");
  const [animation, setAnimation] = useState("Fade In");
  const [newText, setNewText] = useState("Your Text Here");
  const [isGenerating, setIsGenerating] = useState(false);

  const addOverlay = () => {
    const overlay = {
      id: `t${Date.now()}`,
      text: newText,
      track: "text",
      start: 0,
      duration: 3,
      font,
      size,
      color,
      position: position.toLowerCase(),
      animation,
    };
    setTextOverlays((prev) => [...prev, overlay]);
    toast.success("Text overlay added");
  };

  const generateSubtitles = async () => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsGenerating(false);
    const ts = Date.now();
    const subs = [
      {
        id: `sub${ts}1`,
        text: "Welcome to PIXELAI Editor",
        track: "text",
        start: 0,
        duration: 2.5,
        font: "Inter",
        size: 24,
        color: "#FFFFFF",
        position: "bottom",
        animation: "Fade In",
      },
      {
        id: `sub${ts}2`,
        text: "Professional video editing made easy",
        track: "text",
        start: 3,
        duration: 3,
        font: "Inter",
        size: 24,
        color: "#FFFFFF",
        position: "bottom",
        animation: "Fade In",
      },
    ];
    setTextOverlays((prev) => [...prev, ...subs]);
    toast.success("AI subtitles generated!");
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
          Text &amp; Subtitles
        </h2>
      </div>

      <div className="p-3 space-y-4">
        {/* Text input */}
        <div>
          <label
            htmlFor="text-content-input"
            className="text-xs font-medium block mb-1"
            style={{ color: "var(--editor-muted)" }}
          >
            Text Content
          </label>
          <input
            id="text-content-input"
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{
              background: "var(--editor-inner)",
              border: "1px solid var(--editor-border2)",
              color: "var(--editor-text)",
            }}
            data-ocid="text.input"
          />
        </div>

        {/* Font */}
        <div>
          <label
            htmlFor="font-select"
            className="text-xs font-medium block mb-1"
            style={{ color: "var(--editor-muted)" }}
          >
            Font
          </label>
          <select
            id="font-select"
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-xs outline-none cursor-pointer"
            style={{
              background: "var(--editor-inner)",
              border: "1px solid var(--editor-border2)",
              color: "var(--editor-text)",
            }}
            data-ocid="text.font.select"
          >
            {FONTS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        {/* Size */}
        <div>
          <div className="flex justify-between mb-1">
            <p
              className="text-xs font-medium"
              style={{ color: "var(--editor-muted)" }}
            >
              Size
            </p>
            <span
              className="text-xs font-mono"
              style={{ color: "var(--editor-purple-light)" }}
            >
              {size}px
            </span>
          </div>
          <input
            type="range"
            min="12"
            max="120"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full h-1 rounded-full appearance-none"
            style={{ accentColor: "var(--editor-purple)" }}
          />
        </div>

        {/* Color */}
        <div>
          <p
            className="text-xs font-medium block mb-2"
            style={{ color: "var(--editor-muted)" }}
          >
            Color
          </p>
          <div className="flex gap-2 flex-wrap">
            {COLOR_SWATCHES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                style={{
                  background: c,
                  border:
                    color === c
                      ? "2px solid var(--editor-purple-light)"
                      : "2px solid var(--editor-border2)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Style toggles */}
        <div className="flex gap-2">
          {[
            { icon: Bold, val: bold, set: setBold, label: "Bold" },
            { icon: Italic, val: italic, set: setItalic, label: "Italic" },
            {
              icon: Underline,
              val: underline,
              set: setUnderline,
              label: "Underline",
            },
          ].map(({ icon: Icon, val, set, label }) => (
            <button
              key={label}
              type="button"
              onClick={() => set(!val)}
              className="flex-1 py-1.5 rounded-lg flex items-center justify-center transition-colors"
              style={{
                background: val
                  ? "rgba(124,58,237,0.2)"
                  : "var(--editor-surface)",
                border: `1px solid ${val ? "var(--editor-purple)" : "var(--editor-border)"}`,
              }}
              title={label}
            >
              <Icon
                className="w-3.5 h-3.5"
                style={{
                  color: val
                    ? "var(--editor-purple-light)"
                    : "var(--editor-muted)",
                }}
              />
            </button>
          ))}
          {([AlignLeft, AlignCenter, AlignRight] as const).map((Icon) => (
            <button
              key={Icon.displayName}
              type="button"
              className="flex-1 py-1.5 rounded-lg flex items-center justify-center"
              style={{
                background: "var(--editor-surface)",
                border: "1px solid var(--editor-border)",
              }}
            >
              <Icon
                className="w-3.5 h-3.5"
                style={{ color: "var(--editor-muted)" }}
              />
            </button>
          ))}
        </div>

        {/* Position */}
        <div>
          <p
            className="text-xs font-medium block mb-2"
            style={{ color: "var(--editor-muted)" }}
          >
            Position
          </p>
          <div className="grid grid-cols-2 gap-1">
            {POSITIONS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPosition(p)}
                className="py-1.5 rounded text-xs font-medium transition-colors"
                style={{
                  background:
                    position === p
                      ? "rgba(124,58,237,0.2)"
                      : "var(--editor-surface)",
                  border: `1px solid ${position === p ? "var(--editor-purple)" : "var(--editor-border)"}`,
                  color:
                    position === p
                      ? "var(--editor-purple-light)"
                      : "var(--editor-muted)",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Animation */}
        <div>
          <p
            className="text-xs font-medium block mb-2"
            style={{ color: "var(--editor-muted)" }}
          >
            Animation
          </p>
          <div className="flex flex-wrap gap-1">
            {ANIMATIONS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAnimation(a)}
                className="px-2 py-1 rounded text-[10px] font-medium transition-colors"
                style={{
                  background:
                    animation === a
                      ? "rgba(124,58,237,0.2)"
                      : "var(--editor-surface)",
                  border: `1px solid ${animation === a ? "var(--editor-purple)" : "var(--editor-border)"}`,
                  color:
                    animation === a
                      ? "var(--editor-purple-light)"
                      : "var(--editor-muted)",
                }}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Presets */}
        <div>
          <p
            className="text-xs font-medium block mb-2"
            style={{ color: "var(--editor-muted)" }}
          >
            Presets
          </p>
          <div className="grid grid-cols-2 gap-1">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                className="py-1.5 rounded text-xs font-medium transition-opacity hover:opacity-80"
                style={{
                  background: "var(--editor-surface)",
                  border: "1px solid var(--editor-border)",
                  color: "var(--editor-muted)",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Add overlay button */}
        <button
          type="button"
          onClick={addOverlay}
          className="w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
          style={{ background: "var(--editor-purple)", color: "#fff" }}
          data-ocid="text.add.primary_button"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Text Overlay
        </button>

        {/* Text overlays list */}
        <div>
          <h3
            className="text-xs font-semibold mb-2"
            style={{ color: "var(--editor-muted)" }}
          >
            Overlays ({textOverlays.length})
          </h3>
          <div className="space-y-1">
            {textOverlays.map((o, idx) => (
              <div
                key={o.id}
                className="flex items-center justify-between px-3 py-2 rounded-lg"
                style={{
                  background: "var(--editor-surface)",
                  border: "1px solid var(--editor-border)",
                }}
                data-ocid={`text.item.${idx + 1}`}
              >
                <div>
                  <p
                    className="text-xs font-medium"
                    style={{ color: "var(--editor-text)" }}
                  >
                    {o.text}
                  </p>
                  <p
                    className="text-[10px]"
                    style={{ color: "var(--editor-muted)" }}
                  >
                    {o.start}s – {o.start + o.duration}s · {o.font}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setTextOverlays((prev) => prev.filter((t) => t.id !== o.id))
                  }
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{
                    color: "var(--editor-muted)",
                    background: "var(--editor-inner)",
                  }}
                  data-ocid={`text.delete_button.${idx + 1}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AI Subtitle generation */}
        <div
          className="rounded-xl p-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(139,92,246,0.1))",
            border: "1px solid rgba(124,58,237,0.3)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs px-1.5 py-0.5 rounded font-semibold"
              style={{ background: "var(--editor-purple)", color: "#fff" }}
            >
              AI
            </span>
            <span
              className="text-xs font-semibold"
              style={{ color: "var(--editor-text)" }}
            >
              Auto Subtitles
            </span>
          </div>
          <p
            className="text-[10px] mb-3"
            style={{ color: "var(--editor-muted)" }}
          >
            AI-powered speech recognition generates subtitles automatically
          </p>
          <button
            type="button"
            onClick={generateSubtitles}
            disabled={isGenerating}
            className="w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-70"
            style={{ background: "var(--editor-purple)", color: "#fff" }}
            data-ocid="text.ai_subtitles.primary_button"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" /> Generating...
              </>
            ) : (
              "✨ Generate Subtitles with AI"
            )}
          </button>
        </div>

        {/* Subtitle timing table */}
        {textOverlays.length > 0 && (
          <div>
            <h3
              className="text-xs font-semibold mb-2"
              style={{ color: "var(--editor-muted)" }}
            >
              Subtitle Timing
            </h3>
            <div
              className="rounded-lg overflow-hidden"
              style={{ border: "1px solid var(--editor-border)" }}
            >
              <table className="w-full">
                <thead>
                  <tr style={{ background: "var(--editor-inner)" }}>
                    {["Text", "Start", "End"].map((h) => (
                      <th
                        key={h}
                        className="px-2 py-1.5 text-left text-[10px] font-semibold"
                        style={{ color: "var(--editor-muted)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {textOverlays.map((o) => (
                    <tr
                      key={o.id}
                      style={{ borderTop: "1px solid var(--editor-border)" }}
                    >
                      <td
                        className="px-2 py-1.5 text-[10px] truncate max-w-0 w-32"
                        style={{ color: "var(--editor-text)" }}
                      >
                        {o.text}
                      </td>
                      <td
                        className="px-2 py-1.5 text-[10px] font-mono"
                        style={{ color: "var(--editor-muted)" }}
                      >
                        {o.start}s
                      </td>
                      <td
                        className="px-2 py-1.5 text-[10px] font-mono"
                        style={{ color: "var(--editor-muted)" }}
                      >
                        {o.start + o.duration}s
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
