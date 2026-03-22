# PIXELAI Editor

## Current State
EditorScreen.tsx uses local state only - fake video preview, tool panels disconnected from store. VideoPreview.tsx and panel components (MediaPanel, AudioPanel, FiltersPanel, etc.) use useEditorStore but EditorContext is never provided. The store has all needed state: splitClipAt, deleteClip, rotation, flipH, flipV, clipSpeed, masterVolume, activeFilter, textOverlays, exportSettings, autoCut, bgRemoval, etc.

## Requested Changes (Diff)

### Add
- EditorContext.Provider in EditorScreen.tsx using useEditorStoreInternal
- Hidden file input in Media panel for real import (video/audio/image)
- Real video element in preview synced to activeClipUrl, rotation, flipH, flipV, clipSpeed, masterVolume, isPlaying, currentTime
- CSS filter applied from activeFilter and adjustment sliders

### Modify
- EditorScreen.tsx: replace all local state with store; wire each tool panel:
  - Media: file input calls addMediaFile; clip list shown; tap adds to timeline and sets activeClipUrl
  - Cut/Split: Apply Split calls splitClipAt(selectedClipId, currentTime)
  - Speed: buttons set clipSpeed
  - Rotate: buttons update rotation and flipH/flipV
  - Filters: buttons set activeFilter; filter overlay on video
  - Adjust: sliders apply CSS filter string to video
  - Audio: slider sets masterVolume
  - Text: input adds TextOverlay; overlays rendered on preview
  - AI: toggles set autoCut, bgRemoval, beatSync, noiseRemoval state
  - Export: settings update exportSettings; Export button shows toast
- Timeline clips: tappable to set selectedClipId, highlight selected

### Remove
- Local useState for filter, brightness, speed, rotation in EditorScreen

## Implementation Plan
1. Wrap EditorScreen with EditorContext.Provider using useEditorStoreInternal
2. Replace fake preview with real synced video element
3. Rewire each tool panel to read/write store
4. Add file import in Media panel
5. Make timeline clips selectable with visual highlight
