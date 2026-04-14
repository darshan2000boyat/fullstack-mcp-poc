# Skill: 3d-verify

Verify the generated 3D block before delivery.

## Check 1 - Isolation

- no unintended changes to the normal 2D generation flow
- 3D code is contained to dedicated files/components

## Check 2 - Visual Match

- key poses match the provided frames
- camera framing matches the design intent
- object scale and spacing feel consistent with the art direction
- overlays and labels align with the 3D scene correctly

## Check 3 - Motion Match

- keyframe transitions preserve the visible beats from Figma
- interaction states are coherent
- reduced-motion fallback exists

## Check 4 - Technical Quality

- scene renders without runtime errors
- loading/failure states exist
- mobile fallback is defined
- performance is reasonable for web use

## Check 5 - Reality Check

- no false claim of exact geometry reconstruction from Figma alone
- asset assumptions are stated clearly
- if realism depends on missing assets, record that explicitly

## Final Report

- visual match: excellent, good, or needs-attention
- chosen 3D mode
- asset limitations
- mobile fallback
- reduced-motion fallback
- warnings
