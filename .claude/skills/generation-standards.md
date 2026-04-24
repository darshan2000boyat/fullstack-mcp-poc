# Skill: generation-standards

Use this for every Figma-to-code task in this repo. The goal is progressive standardization: the more blocks and pages generated here, the more Claude should reuse the same company patterns instead of re-inventing them.

## Core Principle

Assume 70% of new designs follow existing company patterns unless the Figma clearly proves otherwise.

Default behavior:

1. reuse existing primitives
2. reuse existing Strapi structures
3. reuse existing data-fetching patterns
4. only create new building blocks when the existing system cannot express the design cleanly

This saves tokens, reduces drift, and improves pixel fidelity because fewer parts are invented per task.

---

## Frontend Reuse Order

Before creating a new block-level implementation, check in this order:

1. `nextjs-base/src/components/ui`
2. `nextjs-base/src/components/elements`
3. `nextjs-base/src/components/blocks`
4. `nextjs-base/src/hooks`
5. `nextjs-base/src/lib/methods.server.ts`

If a primitive is missing and is likely to recur across pages, add it to the correct reusable layer instead of embedding one-off markup inside the block.

Examples:

- buttons, links, selects, popovers, shared interactive controls -> `src/components/ui`
- reusable input controls and field-level form pieces -> `src/components/elements/form-fields`
- block-specific composition -> `src/components/blocks`

Do not bury reusable CTA, input, badge, tab, or card primitives inside a single block file.

---

## UI Primitive Policy

For every new Figma implementation:

- first inspect whether `button.tsx`, `link.tsx`, `select.tsx`, `image.tsx`, existing form fields, or other UI primitives can cover the need
- if not, create or extend a reusable primitive in `nextjs-base/src/components/ui`
- then consume that primitive from the block

This applies especially to:

- buttons
- pills / chips
- tabs
- form controls
- cards
- icon buttons
- modal or popover triggers
- repeated media wrappers

When extending a primitive:

- prefer variants and sizes over duplicate components
- keep naming generic and reusable
- do not hardcode one page's content into the primitive

---

## Server-First Page Pattern

For listing pages or any page with backend-driven content:

- prefer a server component wrapper
- fetch data on the server using functions from `nextjs-base/src/lib/methods.server.ts`
- pass resolved data into a client component only when interactivity is required

Pattern:

1. server component fetches page/listing data
2. client component handles filters, tabs, carousels, local state, and browser-only behavior

Do not fetch listing content in a client component if the same request can be handled by `methods.server.ts`.

---

## Strapi Reuse Order

Before creating a new Strapi component or field:

1. check whether an existing collection type already models the entity
2. check whether an existing block already covers the composition
3. check whether an existing element already covers the nested repeated item
4. create a new schema only if reuse would be misleading or structurally wrong

Rules:

- if the page is a listing page, prefer relation-based content modeling over manually duplicating listing cards in a block
- if a collection type already exists for the entity, use relations or server-side fetching rather than mirroring the data as static block fields
- blocks should describe page composition
- elements should describe nested reusable sub-structures

---

## Forms Standard

This repo uses Strapi Formidable.

When a Figma design includes a form:

1. create or reuse the form in Strapi Formidable
2. relate that form to the block instead of manually inventing a parallel schema for each field when the plugin can drive it
3. render the form in Next.js using the existing form renderer patterns
4. submit through the configured form endpoint and keep field mapping aligned with Formidable

Frontend expectations:

- prefer a server wrapper to fetch form metadata through `getForm()` in `methods.server.ts`
- keep the interactive submit renderer in a child client component
- reuse `src/components/blocks/forms/*` and `src/components/elements/form-fields/*` before creating new form pieces

If there is uncertainty around implementation details, refer to the external project example the user cited and align to that pattern rather than improvising a brand-new one.

---

## Figma Matching Standard

To maximize fidelity:

- reuse fewer primitives, but make them better
- standardize recurring spacing, typography, CTA, input, and card patterns
- compare the rendered page to Figma in Playwright after seeding content
- patch root-cause primitives when a mismatch repeats across blocks

If multiple generated blocks need the same visual fix, patch the shared primitive once instead of fixing each block separately.

---

## Progressive Memory

Claude does not retain company preferences automatically unless they are written into the repo.

Therefore:

- update reusable primitives instead of copying one-off markup
- update skills and docs when a new standard is established
- append stable project conventions to `nextjs-base/ai-memory.md` notes when they should influence future runs

Treat repo files as the memory layer for future generation quality.
