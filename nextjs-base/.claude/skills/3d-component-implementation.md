# Skill: 3d-component-implementation

Implement a separate 3D block component.

## Implementation Targets

- `src/components/blocks/<ComponentName>3D.tsx`
- supporting scene files under `src/components/3d/` only if needed
- `src/components/blocks/FullBlockRenderer.tsx` only if the block must be renderable from Strapi

## Rules

- keep 3D implementation isolated from standard blocks
- prefer React Three Fiber
- use Drei helpers where they reduce boilerplate cleanly
- keep scene setup modular: canvas wrapper, scene, animated objects, overlays
- reuse these shared primitives before creating new foundations:
  - `src/components/3d/ThreeSceneCanvas.tsx`
  - `src/components/3d/ThreeSceneShell.tsx`
  - `src/components/3d/ThreeSceneFallback.tsx`
- support loading, failure, and reduced-motion states
- do not require Blender/manual 3D editor output unless the design truly needs real assets
- if realistic geometry is impossible from source inputs, implement the highest-quality hybrid approach instead of faking certainty

## Performance Rules

- keep draw calls and material count reasonable
- avoid unnecessary postprocessing
- lazy-load heavy 3D code when possible
- provide a static or simplified mobile fallback when required

## Output Notes

- chosen 3D mode
- asset usage
- fallback strategy
- performance-sensitive decisions
