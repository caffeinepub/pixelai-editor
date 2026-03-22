import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type ActivePanel =
  | "media"
  | "audio"
  | "text"
  | "transitions"
  | "effects"
  | "filters"
  | "adjustments"
  | "ai"
  | "export"
  | "advanced";

export interface MediaFile {
  id: string;
  name: string;
  type: "video" | "audio" | "image";
  url: string;
  thumbnailUrl?: string;
  duration: number;
}

export interface Clip {
  id: string;
  name: string;
  track: string;
  start: number;
  duration: number;
  color: string;
  mediaId?: string;
}

export interface AudioTrackItem {
  id: string;
  name: string;
  track: string;
  start: number;
  duration: number;
  color: string;
  volume: number;
  muted: boolean;
  fadeIn: boolean;
  fadeOut: boolean;
  mediaId?: string;
}

export interface TextOverlay {
  id: string;
  text: string;
  track: string;
  start: number;
  duration: number;
  font: string;
  size: number;
  color: string;
  position: string;
  animation: string;
}

export interface ExportSettings {
  resolution: "720p" | "1080p" | "4K";
  format: "MP4" | "WebM" | "MOV";
  bitrate: "Low" | "Medium" | "High" | "Ultra";
  aspectRatio: "TikTok 9:16" | "YouTube 16:9" | "Instagram 1:1" | "Story 4:5";
}

const uuid = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);

const initialClips: Clip[] = [
  {
    id: "1",
    name: "Ocean_Sunset.mp4",
    track: "v1",
    start: 0,
    duration: 8,
    color: "#1A2A3A",
  },
  {
    id: "2",
    name: "City_Night.mp4",
    track: "v1",
    start: 8,
    duration: 6,
    color: "#1A2A3A",
  },
  {
    id: "3",
    name: "Beach_Walk.mp4",
    track: "v2",
    start: 2,
    duration: 5,
    color: "#1A2A2A",
  },
  {
    id: "4",
    name: "Drone_Shot.mp4",
    track: "v2",
    start: 9,
    duration: 7,
    color: "#1A2A2A",
  },
];

const initialAudioTracks: AudioTrackItem[] = [
  {
    id: "a1",
    name: "Background_Music.mp3",
    track: "a1",
    start: 0,
    duration: 14,
    color: "#0D2420",
    volume: 80,
    muted: false,
    fadeIn: true,
    fadeOut: true,
  },
  {
    id: "a2",
    name: "Voiceover.mp3",
    track: "a2",
    start: 1,
    duration: 10,
    color: "#0D2420",
    volume: 100,
    muted: false,
    fadeIn: false,
    fadeOut: false,
  },
];

const initialTextOverlays: TextOverlay[] = [
  {
    id: "t1",
    text: "Ocean Sunset",
    track: "text",
    start: 0,
    duration: 3,
    font: "Inter",
    size: 48,
    color: "#FFFFFF",
    position: "center",
    animation: "Fade In",
  },
  {
    id: "t2",
    text: "City at Night",
    track: "text",
    start: 8,
    duration: 4,
    font: "Montserrat",
    size: 36,
    color: "#FFD700",
    position: "bottom",
    animation: "Slide In",
  },
];

function useEditorStoreInternal() {
  const [clips, setClips] = useState<Clip[]>(initialClips);
  const [audioTracks, setAudioTracks] =
    useState<AudioTrackItem[]>(initialAudioTracks);
  const [textOverlays, setTextOverlays] =
    useState<TextOverlay[]>(initialTextOverlays);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [activeClipUrl, setActiveClipUrl] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<ActivePanel>("media");
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(20);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeEffect, setActiveEffect] = useState<string | null>(null);
  const [activeTransition, setActiveTransition] = useState<string | null>(null);
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    resolution: "1080p",
    format: "MP4",
    bitrate: "High",
    aspectRatio: "YouTube 16:9",
  });
  const [autoCut, setAutoCut] = useState(false);
  const [bgRemoval, setBgRemoval] = useState(false);
  const [beatSync, setBeatSync] = useState(false);
  const [motionTracking, setMotionTracking] = useState(false);
  const [noiseRemoval, setNoiseRemoval] = useState(false);
  const [chromaKey, setChromaKey] = useState(false);
  const [pip, setPip] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [clipSpeed, setClipSpeed] = useState(1);
  const [blendMode, setBlendMode] = useState("Normal");
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [masterVolume, setMasterVolume] = useState(80);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return Number.parseFloat((prev + 0.1).toFixed(1));
        });
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, duration]);

  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);
  const seekTo = useCallback(
    (time: number) => setCurrentTime(Math.max(0, Math.min(time, duration))),
    [duration],
  );

  const addMediaFile = useCallback(async (file: File): Promise<void> => {
    const url = URL.createObjectURL(file);
    const fileType: MediaFile["type"] = file.type.startsWith("video")
      ? "video"
      : file.type.startsWith("audio")
        ? "audio"
        : "image";

    let fileDuration = 0;
    let thumbnailUrl: string | undefined;

    if (fileType === "video") {
      await new Promise<void>((resolve) => {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.muted = true;
        video.src = url;
        video.onloadedmetadata = () => {
          fileDuration = video.duration || 0;
          video.currentTime = 0.1;
        };
        video.onseeked = () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = 160;
            canvas.height = 90;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              thumbnailUrl = canvas.toDataURL("image/jpeg", 0.7);
            }
          } catch (_) {
            // cross-origin or unsupported
          }
          video.src = "";
          resolve();
        };
        video.onerror = () => resolve();
        // Fallback timeout
        setTimeout(() => resolve(), 3000);
      });
    } else if (fileType === "audio") {
      await new Promise<void>((resolve) => {
        const audio = document.createElement("audio");
        audio.preload = "metadata";
        audio.src = url;
        audio.onloadedmetadata = () => {
          fileDuration = audio.duration || 0;
          audio.src = "";
          resolve();
        };
        audio.onerror = () => resolve();
        setTimeout(() => resolve(), 3000);
      });
    } else if (fileType === "image") {
      fileDuration = 5; // Default image duration
      thumbnailUrl = url;
    }

    const mediaFile: MediaFile = {
      id: uuid(),
      name: file.name,
      type: fileType,
      url,
      thumbnailUrl,
      duration: fileDuration,
    };

    setMediaFiles((prev) => [...prev, mediaFile]);
  }, []);

  const splitClipAt = useCallback((clipId: string, time: number) => {
    setClips((prev) => {
      const clip = prev.find((c) => c.id === clipId);
      if (!clip) return prev;
      if (time <= clip.start || time >= clip.start + clip.duration) return prev;
      const first: Clip = { ...clip, duration: time - clip.start };
      const second: Clip = {
        ...clip,
        id: uuid(),
        start: time,
        duration: clip.start + clip.duration - time,
      };
      return prev.map((c) => (c.id === clipId ? first : c)).concat(second);
    });
  }, []);

  const deleteClip = useCallback((clipId: string) => {
    setClips((prev) => prev.filter((c) => c.id !== clipId));
    setAudioTracks((prev) => prev.filter((a) => a.id !== clipId));
    setSelectedClipId(null);
  }, []);

  return {
    clips,
    setClips,
    audioTracks,
    setAudioTracks,
    textOverlays,
    setTextOverlays,
    mediaFiles,
    addMediaFile,
    activeClipUrl,
    setActiveClipUrl,
    activePanel,
    setActivePanel,
    selectedClipId,
    setSelectedClipId,
    currentTime,
    duration,
    setDuration,
    isPlaying,
    togglePlay,
    seekTo,
    activeFilter,
    setActiveFilter,
    activeEffect,
    setActiveEffect,
    activeTransition,
    setActiveTransition,
    exportSettings,
    setExportSettings,
    autoCut,
    setAutoCut,
    bgRemoval,
    setBgRemoval,
    beatSync,
    setBeatSync,
    motionTracking,
    setMotionTracking,
    noiseRemoval,
    setNoiseRemoval,
    chromaKey,
    setChromaKey,
    pip,
    setPip,
    zoomLevel,
    setZoomLevel,
    clipSpeed,
    setClipSpeed,
    blendMode,
    setBlendMode,
    rotation,
    setRotation,
    flipH,
    setFlipH,
    flipV,
    setFlipV,
    masterVolume,
    setMasterVolume,
    splitClipAt,
    deleteClip,
  };
}

export type EditorStore = ReturnType<typeof useEditorStoreInternal>;

export const EditorContext = createContext<EditorStore | null>(null);

export function useEditorStore(): EditorStore {
  const ctx = useContext(EditorContext);
  if (!ctx)
    throw new Error(
      "useEditorStore must be used within EditorContext.Provider",
    );
  return ctx;
}

export { useEditorStoreInternal };
