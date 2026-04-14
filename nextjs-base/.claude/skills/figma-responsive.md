# Skill: figma-responsive

Responsive rules for Figma blocks.

## Core

- mobile-first always
- if mobile Figma exists, it defines base layout
- if only desktop exists, infer a designed mobile version first
- preserve fidelity; do not “simplify” the design into bland responsive patterns

## Use

- unprefixed classes for mobile
- add breakpoints only where layout changes
- keep desktop accurate at the frame’s intended breakpoint
- allow exact values if that is what the design needs

## Manual Layouts

If Figma is not auto-layout:
- preserve anchor relationships
- use relative and absolute intentionally
- keep overlap only where the design needs it
- avoid flattening layered structures

## Carousel

If repeated cards overflow the frame:
- use Embla
- preserve partial-next-slide cues
- size slides deliberately for mobile and desktop

## Audit

- no accidental horizontal scroll
- text wraps safely
- card groups either wrap intentionally or carousel intentionally
- mobile still looks designed, not merely collapsed
