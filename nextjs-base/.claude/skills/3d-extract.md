# Skill: 3d-extract

Extract 3D-relevant motion and scene information from Figma frames.

## Inputs

- `desktop_figma_url`
- optional `mobile_figma_url`

## Purpose

Translate Figma frames into:
- scene intent
- object list
- camera hints
- lighting hints
- depth cues
- interaction cues
- frame-to-frame motion deltas

## Extraction Rules

- treat each frame as a keyframe
- compare frame deltas to infer:
  - camera movement
  - object transform changes
  - scale changes
  - opacity/material shifts
  - text/UI overlay changes
- identify whether the scene is:
  - faux-3D UI
  - 2.5D layered motion
  - real-time 3D viewer
- note whether true 3D assets are provided or missing

## Output

Produce:
- `scene_type`
- `objects`
- `camera_keyframes`
- `animation_keyframes`
- `interaction_targets`
- `lighting_notes`
- `asset_requirements`
- `mobile_notes`

Flag uncertainty explicitly instead of inventing 3D geometry.
