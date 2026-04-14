# Skill: figma-component

Build a Next.js block from Figma with maximum reuse and high visual fidelity.

## Decision First

Choose exactly one:
- `reuse`
- `reuse-with-patch`
- `create-new`

Check only the most relevant matching files in:
- `src/components/blocks/`
- `src/components/elements/`
- `src/components/ui/`
- `ai-memory.md` component inventory if present

Do not keep exploring once the decision is clear.

## Implementation Rules

- Follow the Strapi payload exactly under `block`
- Reuse existing elements and UI primitives aggressively
- Keep new files route-agnostic and reusable
- Do not create duplicates with slightly different names
- Keep repeated nested content array-driven
- Preserve `block.Common` safely when present

## Pixel Fidelity Rules

- Start from actual Figma grouping, alignment, and visual rhythm
- Do not flatten layered/manual layouts into generic flex stacks
- Use flex, grid, relative, and absolute based on actual design intent
- Prefer project tokens and existing utilities first
- Keep exact arbitrary values when they materially improve the match
- Do not “normalize away” precise spacing, offsets, type sizes, or radii that are important to the screenshot

## Carousel Rule

If repeated items visibly extend past the frame width, implement an Embla carousel.
If the block includes arrow buttons that visually indicate previous/next navigation, also treat it as a carousel even when the screenshot does not show overflow clearly.

- no Swiper substitution
- no accidental overflow pretending to be a carousel
- preserve visible partial-slide cues, slide widths, and gaps from Figma

## MFA Rule

- Base classes are mobile
- If mobile Figma exists, use it as source of truth
- If not, infer mobile before desktop
- Desktop classes should match the provided frame at the intended breakpoint

## Output Notes

Record:
- reuse decision
- whether mobile was explicit or inferred
- whether exact arbitrary values were intentionally kept
- whether carousel logic was used
