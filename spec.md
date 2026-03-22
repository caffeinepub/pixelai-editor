# PIXELAI Editor

## Current State
A CapCut-inspired dark-themed mobile video editor PWA with 5 screens (Home, Templates, Editor, AI, Profile). The editor features a multi-track timeline with mock/static clip data, a fake video preview (gradient canvas), non-functional tool rail buttons, and a media panel with hardcoded sample items. Tools like cut, speed, rotate, flip, volume, delete are UI-only.

## Requested Changes (Diff)

### Add
- Real media import: hidden `<input type="file" accept="video/*,audio/*,image/*">` triggered by the Media panel "Add" and "Import" buttons. Files are read as blob URLs (URL.createObjectURL) and stored in the editor state.
- `mediaFiles` state in `useEditorStore`: array of `{ id, name, type, url, duration, thumbnailUrl }`. `addMediaFile(file: File)` action creates blob URL and appends.
- `activeClipUrl` in store: the blob URL of the currently active (selected) clip to drive preview playback.
- Real `<video>` element in `VideoPreview`: when `activeClipUrl` is set, render an HTML5 `<video>` element that actually plays/pauses/seeks in sync with the store's play state and currentTime.
- Working Cut/Split tool: `splitClipAt(clipId, time)` action in store splits the selected clip at the current playhead into two clips.
- Working Delete tool: `deleteClip(clipId)` removes a clip from the timeline.
- Working Speed tool: `setClipSpeed(n)` already exists; wire up a speed selector that mutates the active `<video>` element's `playbackRate`.
- Working Rotate tool: `rotation` state (0/90/180/270) and `setRotation` action; apply CSS `transform: rotate(Xdeg)` to the preview video.
- Working Flip: `flipH` / `flipV` booleans; apply CSS `scaleX(-1)` / `scaleY(-1)` to preview video.
- Working Volume: master volume slider in preview controls sets `videoRef.current.volume`.
- Timeline click-to-activate: clicking a clip in the timeline sets `selectedClipId` and updates `activeClipUrl` to that clip's associated media blob URL.
- Media panel "Add to Timeline" on imported items: clicking an item (or a + button) appends a new clip to the v1 track linked to that media file.
- Video thumbnail generation: after import, draw first frame to an offscreen canvas and store as `thumbnailUrl` for display in media panel and timeline.

### Modify
- `useEditorStore.ts`: add `mediaFiles`, `addMediaFile`, `activeClipUrl`, `setActiveClipUrl`, `splitClipAt`, `deleteClip`, `rotation`, `setRotation`, `flipH`, `setFlipH`, `flipV`, `setFlipV`, `masterVolume`, `setMasterVolume`. Clips gain optional `mediaId` field.
- `MediaPanel.tsx`: replace static list with `mediaFiles` from store. Add real file input. Show thumbnail if available, otherwise colored placeholder. Click to add to timeline.
- `VideoPreview.tsx`: replace gradient canvas with real `<video ref={videoRef}>` element. Sync play/pause, currentTime, and duration to the `<video>` element. Apply filter CSS classes. Apply rotation and flip via CSS transform. Wire volume slider to `videoRef.current.volume`.
- `ToolRail.tsx` (or wherever cut/speed/rotate/flip/delete buttons live): wire buttons to the corresponding store actions.
- `Timeline.tsx`: clicking a clip calls `setActiveClipUrl` if the clip has a `mediaId` with a known url.

### Remove
- Hardcoded `mediaItems` array in MediaPanel (replaced by live store state).
- Fake gradient canvas in VideoPreview (replaced by real video element with fallback placeholder when no media loaded).

## Implementation Plan
1. Extend `useEditorStore.ts` with all new state and actions.
2. Rewrite `MediaPanel.tsx` with real file import, blob URL, thumbnail generation, and add-to-timeline.
3. Rewrite `VideoPreview.tsx` with real `<video>` element, CSS transforms, filter overlay.
4. Wire tool actions in `ToolRail.tsx` and/or the editor screen (cut, delete, speed, rotate, flip).
5. Update `Timeline.tsx` clip click to activate clip URL for preview.
6. Validate and fix any TypeScript/lint errors.
