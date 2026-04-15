# Skill: 3d-animation-mapping

Map Figma keyframe deltas into concrete animation timelines with exact values.

## Inputs

- `transition_table` from `3d-extract.md`
- `objects` list from `3d-extract.md`
- `camera_keyframes` from `3d-extract.md`

## Purpose

Convert every row in the transition table into a specific animation segment with numeric values that can be directly coded. This is the bridge between design analysis and implementation — **nothing in the transition table should be lost here**.

## Mapping Rules

### 1. One transition row = one animation segment

For each transition in the table, produce:

```
Segment N: "State A → State B"
  trigger: scroll progress 0.X → 0.Y (or interaction event)
  duration: Xms (or scrub-driven)
  easing: ease name (e.g. "power2.inOut", "expo.out", spring config)

  objects:
    GoldenSphere:
      position: [x1, y1, z1] → [x2, y2, z2]
      rotation: [rx1, ry1, rz1] → [rx2, ry2, rz2]  (if changed)
      scale: s1 → s2  (if changed)

    BlueBlocks:
      scale: 1 → 0  (disappear via scale-down)
      timing: start at 0% of segment, complete by 30%

    GlassSphere:
      scale: 0 → 1  (appear via scale-up)
      timing: start at 40% of segment, complete by 100%

  camera:
    position: [cx1, cy1, cz1] → [cx2, cy2, cz2]
    lookAt: [lx1, ly1, lz1] → [lx2, ly2, lz2]
```

### 2. Derive values from the keyframe screenshots

- **Object positions**: estimate from the screenshot composition. If an object is centered, it's [0, y, 0]. If it's left-of-center, negative x. If it's high, positive y. Be specific — don't write "moves right", write [0, 1, 0] → [1.5, 0.5, 0.3].
- **Object scales**: if an object is not visible in a frame, its scale is 0. If it appears, animate 0→1 with easing. If it grows larger, estimate the multiplier.
- **Rotations**: if motion blur shows rotation or an object appears at a different angle, estimate the rotation in radians.
- **Camera**: if the viewpoint clearly changes between frames (e.g. eye-level → top-down), define the camera position shift.

### 3. Stagger object transitions within a segment

Objects should not all appear/disappear at the same instant. Within each segment:
- **Disappearing objects** start animating first (0–40% of segment)
- **Camera** moves during the middle (20–80% of segment)
- **Appearing objects** finish animating last (50–100% of segment)
- **The constant object** (e.g. golden sphere) moves smoothly across the full segment (0–100%)

This creates visual continuity instead of a hard cut.

### 4. Easing and damping

- **Scroll-driven animations**: use GSAP ScrollTrigger with `scrub: 1` (or higher for more damping). Never `scrub: true` (no damping) or `scrub: 0`.
- **Object scale-in**: use `power2.out` or `back.out(1.4)` for a slight overshoot
- **Object scale-out**: use `power2.in` for a clean exit
- **Camera movement**: use `power1.inOut` for smooth panning
- **Continuous rotation** (e.g. orbiting ring): use `useFrame` in R3F, not GSAP — it should be frame-rate independent
- **Interactive 3D** (e.g. OrbitControls): add `enableDamping` with `dampingFactor` of 0.05–0.1

### 5. Idle/ambient motion

Between scroll-driven keyframes, add subtle idle motion:
- Floating: use `Float` from drei or a gentle `sin(time)` offset (amplitude < 0.1)
- Slow rotation: 0.1–0.3 rad/s on the y-axis
- Subtle breathing scale: oscillate between 0.98 and 1.02

These keep the scene alive during scroll pauses.

## Output

Produce:

- `total_segments`: number (must equal number of transitions)
- `segments`: array of segment definitions (as above)
- `idle_motions`: ambient animations active between transitions
- `interaction_motions`: any user interaction animations (hover, drag, etc.)
- `reduced_motion_plan`: what to show when `prefers-reduced-motion: reduce` is active

**Every segment must reference specific object names, numeric values, and easing functions. Prose descriptions like "the sphere moves to the right" are not acceptable — write `position: [0, 1, 0] → [1.5, 0.5, 0.3], ease: power2.inOut`.**
