# /implement-3d-figma-block - Figma Frames To 3D Next Block

Implement a 3D-heavy Next.js block from Figma frames without affecting the normal 2D generation flow.

**Usage:** `/implement-3d-figma-block <desktop_figma_url> [mobile_figma_url] [block_name]`

---

## Setup

Parse `$ARGUMENTS`:
- `desktop_figma_url` - required primary Figma URL
- `mobile_figma_url` - optional mobile-specific Figma URL
- `block_name` - optional explicit block/component name

Resolve these fixed project roots relative to the current repo:
- frontend workspace: `nextjs-base`
- backend workspace: `strapi-base-v5`

Before doing any generation:
- read `nextjs-base/.claude/commands/3d-figma.md`
- read `nextjs-base/.claude/skills/3d-extract.md`
- read `nextjs-base/.claude/skills/3d-scene-planning.md`
- read `nextjs-base/.claude/skills/3d-animation-mapping.md`
- read `nextjs-base/.claude/skills/3d-component-implementation.md`
- read `nextjs-base/.claude/skills/3d-verify.md`
- read `.claude/skills/strapi-block-implementation.md`

---

## Frame Extraction (CRITICAL)

The Figma storyboard is a collection of **keyframe pairs** (before → after), connected by arrows. Each pair represents one animation transition.

### Step 1 — Identify all keyframe frames

Use `get_metadata` on the root storyboard node to list all child nodes. Identify:
- **Image/render frames** — rounded rectangles or frames containing rendered 3D scenes
- **Arrow vectors** — connecting before→after pairs
- **Connection curves** — vectors showing the animation path between keyframe rows

Group the image frames into **ordered pairs** by their y-position and the arrows between them:
- Pair 1: top-left frame → top-right frame (connected by arrow)
- Pair 2: second-left frame → second-right frame
- etc.

### Step 2 — Get screenshot of EVERY individual keyframe

**Do not rely on the storyboard overview screenshot.** It is too small to see 3D detail.

Call `get_screenshot` on **each individual keyframe frame node** (not the storyboard parent). This gives high-resolution views of each 3D state.

### Step 3 — Get design context for key frames

Call `get_design_context` on frames that contain named sub-layers (e.g. "Background", "Object") to understand materials, colors, and layer structure.

### Step 4 — Build the keyframe analysis table

For every frame, document:

| Frame | Node ID | Objects visible | Camera angle | Key colors/materials | Notable differences from previous |
|-------|---------|----------------|--------------|---------------------|----------------------------------|

Then for every **transition** (pair), document:

| Transition | From → To | Objects added | Objects removed | Position changes | Rotation changes | Scale changes | Material changes | Camera movement |
|-----------|-----------|---------------|-----------------|-----------------|-----------------|---------------|-----------------|----------------|

**This table is the contract for animation implementation.** Every transform in this table must appear in the final code. If a transform is ambiguous, flag it explicitly rather than dropping it.

---

## Execution Flow

After frame extraction is complete:

1. Run `3d-scene-planning.md` — choose mode, define scene graph from the keyframe table
2. Run `3d-animation-mapping.md` — map every transition row into timeline segments with exact values
3. Create Strapi backend block — follow `strapi-block-implementation.md`
4. Run `3d-component-implementation.md` — implement the scene, using the animation map as the spec
5. Run `3d-verify.md` — validate against original keyframe screenshots

---

## Execution Rules

- this workflow is separate from the normal `figma` command
- do not modify the 2D block generation path unless explicitly asked
- prefer React Three Fiber and the shared 3D scaffold under `nextjs-base/src/components/3d/`
- treat Figma frames as animation and art-direction keyframes, not exact 3D geometry definitions
- **every keyframe pair must be individually screenshotted and analyzed** — do not skip frames
- **every object transform between keyframes must be documented before coding** — do not approximate
- if realism requires assets that do not exist, state the limitation and implement the highest-quality hybrid approach instead of inventing certainty
- implement damping/easing on all scroll-driven and interactive animations (never linear snapping)
- use GSAP ScrollTrigger with `scrub` for scroll-driven scenes; use spring physics or eased tweens for interactive scenes

---

## Required Final Output

Report:

1. Figma URL(s) used
2. number of keyframe pairs analyzed
3. chosen 3D mode
4. Strapi block UID and fields
5. files changed
6. asset assumptions
7. animation segments implemented (list each transition)
8. mobile fallback
9. reduced-motion fallback
10. any manual follow-up needed
