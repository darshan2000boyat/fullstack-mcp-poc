# Skill: 3d-extract

Extract 3D-relevant motion and scene information from Figma keyframes.

## Inputs

- `desktop_figma_url`
- optional `mobile_figma_url`

## Purpose

Translate Figma frames into a precise, frame-by-frame analysis that becomes the binding spec for the animation implementation.

## Extraction Steps

### 1. Enumerate all keyframe nodes

Use `get_metadata` on the storyboard root. Identify every rendered 3D scene frame by:
- layer name (often contains version info like "V1", "V2", or descriptive names)
- position: group frames into rows by y-coordinate
- arrows between frames indicate transition direction (left → right)

### 2. Screenshot every keyframe individually

Call `get_screenshot` on **each keyframe node ID separately**. Do NOT rely on the storyboard overview — it is too low-resolution to identify objects, materials, camera angles, or subtle differences between frames.

### 3. Analyze each keyframe screenshot

For every frame, record:
- **Objects visible**: list each distinct 3D object (sphere, box, dome, torus, pyramid, plane, etc.)
- **Object transforms**: approximate position, rotation, scale relative to the scene center
- **Materials**: metallic gold, glass/translucent blue, matte navy, etc.
- **Camera**: eye-level, top-down, angled, close-up, etc.
- **Lighting**: direction of key highlights, ambient mood
- **Motion blur / trails**: indicates movement direction and speed

### 4. Compute transition deltas

For each pair (frame A → frame B), compare and document:
- Objects that **appear** (scale 0→1 or opacity 0→1)
- Objects that **disappear** (scale 1→0 or opacity 1→0)
- Objects that **move** (position delta)
- Objects that **rotate** (rotation delta)
- Objects that **change material** (color, transparency shift)
- Camera movement between the two frames
- **Direction of motion blur** — this reveals the animation path, not just the start/end

### 5. Look at connection curves between rows

The vector paths between keyframe rows (the curved lines in the storyboard) show the **camera or scene transition path** between major states. Note whether these suggest:
- smooth pan
- orbit/rotation
- zoom in/out
- cut (no curve = hard transition)

## Output

Produce a structured result:

- `scene_type`: faux-3D | hybrid-2.5d | real-time-viewer
- `total_keyframes`: number
- `total_transitions`: number
- `objects`: list of all unique objects across all frames with material descriptions
- `keyframe_table`: per-frame analysis (objects, camera, materials, notes)
- `transition_table`: per-pair delta analysis (what changes, how, direction)
- `camera_keyframes`: camera position/angle per state
- `lighting_notes`: consistent lighting setup
- `asset_requirements`: what needs external assets vs procedural geometry
- `mobile_notes`: anything that may need simplification for mobile

**Every row in the transition table becomes a mandatory animation segment in the implementation. Do not drop transitions.**

Flag uncertainty explicitly instead of inventing 3D geometry or animation.
