# /implement-monday-ticket - Monday Ticket To Strapi + Next Block

Implement a Monday.com ticket end-to-end by:

1. fetching the ticket from Monday MCP
2. extracting the Figma reference and scope
3. generating or reusing the Strapi block schema
4. generating or reusing the Next.js block component
5. registering the block in the frontend renderer

**Usage:** `/implement-monday-ticket <monday_ticket_url>`

---

## Setup

Parse `$ARGUMENTS`:
- `monday_ticket_url` - full Monday item URL (required)

If missing, ask for it.

Resolve these fixed project roots relative to the current repo:
- frontend workspace: `next-base`
- backend workspace: `strapi-base`

Before doing any generation:
- read `next-base/ai-memory.md` if present
- read `next-base/.claude/commands/figma.md`
- read `next-base/.claude/skills/figma-component.md`
- read `next-base/tailwind.config.ts`
- read `strapi-base/src/api/sitemap/content-types/sitemap/schema.json`
- read `next-base/src/components/blocks/FullBlockRenderer.tsx`

Then read and follow these root skills in order:
1. `.claude/skills/monday-ticket-intake.md`
2. `.claude/skills/block-reuse-check.md`
3. `.claude/skills/strapi-block-implementation.md`
4. `.claude/skills/next-block-implementation.md`

---

## Execution Rules

- Use Monday MCP as the source of truth for ticket title, description, scope, and attached context.
- Extract the first valid Figma URL from the ticket body, updates, linked docs, or custom fields.
- Treat "full page", "screen", or similar wording as a page-level design that may need chunking.
- Treat "block", "section", "component", or explicit block naming as a single reusable block.
- Never overwrite an existing Strapi component or Next block blindly.
- Prefer reuse when a matching block already exists by name, structure, or props shape.
- If a match exists, patch only the missing fields or registration.
- On the frontend, prefer Tailwind config tokens, semantic utilities, plugin-defined classes, and configured breakpoints from `next-base/tailwind.config.ts` before generic utility fallbacks.
- Use raw utility classes only when the project Tailwind config and established local class patterns do not already cover the design requirement.
- If the ticket lacks a usable Figma URL, stop and report the blocker.

---

## Backend First, Frontend Second

Always execute in this order:

1. Finish backend component decision and file changes in `strapi-base`
2. Then build or reuse the frontend component in `next-base`
3. Then register the block in `FullBlockRenderer`

Do not generate frontend code for a block whose backend `_component` contract is still unclear.

---

## Required Final Output

Report:

1. Monday ticket summary
2. extracted Figma URL
3. backend action taken
4. frontend action taken
5. renderer registration result
6. files changed
7. any manual follow-up needed
