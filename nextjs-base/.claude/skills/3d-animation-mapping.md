# Skill: 3d-animation-mapping

Map Figma keyframes into animation timelines and interaction states.

## Purpose

Turn frame-to-frame changes into:
- timeline segments
- object transform animation
- camera animation
- opacity/material changes
- UI overlay transitions

## Rules

- animation must be derived from frame deltas, not guessed stylistically
- use timelines/state machines rather than ad hoc chained animations
- separate:
  - intro animation
  - idle motion
  - user interaction motion
  - exit/transition motion
- preserve key beats visible in the frames
- if a motion detail is ambiguous, choose the simplest plausible animation and record the assumption

## Preferred Implementation Direction

- use `@react-three/fiber` scene updates
- use `@react-three/drei` helpers when appropriate
- use GSAP or a concise scene-state approach when timeline control is needed

## Output

- `timeline_segments`
- `object_motion_map`
- `camera_motion_map`
- `interaction_motion_map`
- `fallback_motion_map`
