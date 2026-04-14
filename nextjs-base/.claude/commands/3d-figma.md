# /3d-figma - Figma to 3D block

Usage: `/3d-figma <desktop_figma_url> <workspace_path> [mobile_figma_url]`

## Goal

Generate or patch a separate Three.js / React Three Fiber based block from Figma keyframes without affecting the standard 2D generation flow.

## Isolation Rule

- do not modify or reuse the normal `figma` command flow
- keep 3D work in dedicated files, components, and skills
- only run this workflow when the user explicitly requests 3D

## Read Only What Is Needed

Inspect, in order, and stop once the decision is clear:
1. `{workspace_path}/ai-memory.md` relevant sections only
2. likely matching files in `src/components/blocks/`
3. likely matching files in `src/components/elements/`
4. likely matching files in `src/components/ui/`
5. package dependencies relevant to Three.js / React Three Fiber

## Flow

1. Run `.claude/skills/3d-extract.md`
2. Run `.claude/skills/3d-scene-planning.md`
3. Run `.claude/skills/3d-animation-mapping.md`
4. Run `.claude/skills/3d-component-implementation.md`
5. Run `.claude/skills/3d-verify.md`

## Hard Rules

- treat Figma frames as motion direction, not literal 3D geometry
- keep 3D implementation separate from 2D block generation
- prefer React Three Fiber over raw Three.js unless there is a clear need otherwise
- use existing 3D assets when available; do not promise realistic custom geometry from Figma alone
- define explicit fallbacks for mobile and reduced-motion
- keep interaction and animation data-driven
- prefer the shared 3D scaffold in `src/components/3d/` before inventing a new runtime structure
- use `src/components/blocks/ThreeDShowcase.tsx` as the default reference shape when introducing a new standalone 3D block

## Final Report

- files changed
- 3D mode chosen: faux-3D, hybrid, or real-time viewer
- asset assumptions
- mobile strategy
- reduced-motion strategy
- verification result
