# /implement-figma-block - Figma URL To Strapi + Next Block

Implement a block end-to-end from a Figma URL directly (no Monday ticket required):

1. extracting design details from the Figma reference
2. inferring block name and scope from the design
3. generating or reusing the Strapi block schema
4. generating or reusing the Next.js block component
5. registering the block in the frontend renderer

**Usage:** `/implement-figma-block <figma_url> [block_name]`

---

## Setup

Parse `$ARGUMENTS`:
- `figma_url` - full Figma file/frame/node URL (required). Ask for it if missing.
- `block_name` - optional explicit name for the block (e.g. `HeroBanner`, `FeatureGrid`). If omitted, infer from the Figma frame/component name.

Resolve these fixed project roots relative to the current repo:
- frontend workspace: `nextjs-base`
- backend workspace: `strapi-base-v5`

Before doing any generation:
- read `nextjs-base/ai-memory.md` if present
- read `nextjs-base/.claude/commands/figma.md`
- read `nextjs-base/.claude/skills/figma-component.md`
- read `nextjs-base/tailwind.config.ts`
- read `strapi-base-v5/src/api/sitemap/content-types/sitemap/schema.json`
- read `nextjs-base/src/components/blocks/FullBlockRenderer.tsx`

Then read and follow these root skills in order:
1. `.claude/skills/block-reuse-check.md`
2. `.claude/skills/strapi-block-implementation.md`
3. `.claude/skills/next-block-implementation.md`

> Note: `.claude/skills/monday-ticket-intake.md` is **skipped** — there is no Monday ticket. Treat the Figma URL as the sole source of truth.

---

## Scope Inference

Since there is no ticket description, infer scope from the Figma frame:

- If the frame name contains "page", "screen", "layout", or covers a full viewport — treat it as **page-level** (may need chunking into multiple blocks).
- If the frame name contains "block", "section", "card", "banner", "hero", "footer", "nav", or similar — treat it as a **single reusable block**.
- When uncertain, default to single block and note the assumption in the final report.

---

## Execution Rules

- The Figma URL is the source of truth for visual design, field names, content structure, and layout.
- Use the Figma frame or component name as the default block name unless `block_name` was explicitly provided.
- Treat "full page", "screen", or similar wording as a page-level design that may need chunking.
- Treat "block", "section", "component", or explicit block naming as a single reusable block.
- Never overwrite an existing Strapi component or Next block blindly.
- Prefer reuse when a matching block already exists by name, structure, or props shape.
- If a match exists, patch only the missing fields or registration.
- On the frontend, prefer Tailwind config tokens, semantic utilities, plugin-defined classes, and configured breakpoints from `nextjs-base/tailwind.config.ts` before generic utility fallbacks.
- Use raw utility classes only when the project Tailwind config and established local class patterns do not already cover the design requirement.

---

## Backend First, Frontend Second

Always execute in this order:

1. Finish backend component decision and file changes in `strapi-base-v5`
2. Then build or reuse the frontend component in `nextjs-base`
3. Then register the block in `FullBlockRenderer`

Do not generate frontend code for a block whose backend `_component` contract is still unclear.

---

## Required Final Output

Report:

1. Figma URL used
2. inferred block name and scope
3. backend action taken
4. frontend action taken
5. renderer registration result
6. files changed
7. any manual follow-up needed
