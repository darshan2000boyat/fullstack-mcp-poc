# Skill: 3d-scene-planning

Plan the 3D scene before implementation.

## Decide One Mode

- `faux-3d`
- `hybrid-2.5d`
- `real-time-viewer`

## Planning Rules

- choose the lightest mode that can satisfy the design
- if no real 3D assets exist, prefer `faux-3d` or `hybrid-2.5d`
- use `real-time-viewer` only when actual 3D assets or simple procedural geometry can support it
- define scene graph, camera behavior, lights, materials, overlays, and fallback states before coding

## Required Plan Output

- chosen mode
- component boundaries
- scene graph
- camera strategy
- lighting strategy
- animation timeline structure
- interaction model
- mobile fallback
- reduced-motion fallback

## Constraints

- do not let 3D code leak into unrelated existing blocks
- keep performance realistic for web delivery
- keep the plan maintainable and data-driven
