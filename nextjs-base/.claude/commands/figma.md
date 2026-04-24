# /figma - Figma to Next block

Usage: `/figma <desktop_figma_url> <workspace_path> [mobile_figma_url]`

## Goal

Generate or patch a reusable, data-driven block that matches Figma as closely as possible with minimal prompt waste.

## Read Only What Is Needed

Always inspect, in this order, and stop once the decision is clear:
1. `{workspace_path}/ai-memory.md` relevant sections only
2. `{workspace_path}/tailwind.config.ts`
3. matching files in `src/components/blocks/`
4. matching files in `src/components/elements/`
5. matching files in `src/components/ui/`
6. `src/components/blocks/FullBlockRenderer.tsx` only if renderer registration is needed

Do not scan the whole repo if a reuse decision is already clear.

## Flow

1. Run `.claude/skills/figma-extract.md`
2. Run `.claude/skills/figma-tokens.md`
3. Run `.claude/skills/figma-component.md`
4. Apply `.claude/skills/figma-responsive.md` and `.claude/skills/figma-a11y.md`
5. Run `.claude/skills/figma-verify.md`

## Rules

- Prefer `reuse` or `reuse-with-patch` over `create-new`
- If `mobile_figma_url` exists, mobile is the base layout
- If only desktop exists, infer mobile first, then layer desktop
- If items overflow horizontally in Figma, implement an Embla carousel
- If Figma shows a progress bar, scrubber, or slider-style progress indicator for repeated content, treat that section as a slider and implement it with Embla even if overflow is subtle in the frame
- Preserve pixel fidelity over generic simplification
- Use exact arbitrary values only when existing tokens/utilities cannot match the design closely enough
- Keep output compatible with the Strapi block payload

## Final Report

- files changed
- reuse decision
- mobile source: provided or inferred
- carousel: yes or no
- tokens added
- verification result
