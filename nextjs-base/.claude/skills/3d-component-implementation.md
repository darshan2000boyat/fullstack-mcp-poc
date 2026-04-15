# Skill: 3d-component-implementation

Implement a separate 3D block component.

## Implementation Targets

- `src/components/blocks/<ComponentName>3D.tsx` — the block wrapper (accepts Strapi block props)
- supporting scene files under `src/components/3d/` only if needed
- `src/components/blocks/FullBlockRenderer.tsx` — **always** register the block here
- `src/typings/blocks.d.ts` — add the block props interface

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

## Strapi Integration (mandatory)

Every 3D block **must** have a Strapi backend component. Before implementing the frontend:

1. **Create the Strapi schema** in `strapi-base-v5/src/components/blocks/<slug>.json` following the root `strapi-block-implementation.md` skill. Typical fields:
   - `Common` (component: elements.common) — always include
   - Content-specific fields as `json`, `string`, or CKEditor depending on the design
   - Keep it minimal — the 3D scene is mostly procedural, so only CMS-editable content (labels, values, titles) needs fields
2. **Register in sitemap dynamic zone** — append the UID to `strapi-base-v5/src/api/sitemap/content-types/sitemap/schema.json`
3. **Register populate rules** — add entry in `strapi-base-v5/config/sitemap-components.ts`
4. **Add TypeScript interface** in `nextjs-base/src/typings/blocks.d.ts`
5. **Register in FullBlockRenderer** — add `dynamic()` import and `case` in the switch
6. **Accept block props** — the component signature must be `({ block }: { block: <BlockProps> })`, not a standalone component with no props

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
