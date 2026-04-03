# Skill: block-reuse-check

Prevent duplicate block generation across Strapi and Next.

## Inputs

- normalized Monday ticket summary
- resolved Figma frame or screen context

---

## Backend Reuse Check

Inspect:
- `strapi-base/src/components/**/*.json`
- `strapi-base/src/api/sitemap/content-types/sitemap/schema.json`

For each candidate block:
- compare file name
- compare `info.displayName`
- compare attribute names and approximate field intent
- compare whether the component is already allowed in the sitemap dynamic zone

If a strong match exists:
- reuse the existing component UID
- patch only missing attributes
- do not create a duplicate JSON file with a near-identical name

---

## Frontend Reuse Check

Inspect:
- `next-base/src/components/blocks/**/*.tsx`
- `next-base/src/components/blocks/FullBlockRenderer.tsx`
- `next-base/src/typings/blocks.d.ts`
- `next-base/ai-memory.md` component inventory if present

For each candidate block:
- compare component name
- compare prop shape
- compare layout purpose
- compare existing `_component` mapping in `FullBlockRenderer`

If a strong match exists:
- reuse the existing component file
- patch only missing prop typing or renderer registration
- do not create a renamed duplicate of the same block

---

## Decision Output

Produce one of these outcomes for both backend and frontend:

- `reuse`
- `reuse-with-patch`
- `create-new`

Only continue to file generation after both decisions are made.

---

## Rules

- Prefer reuse over near-duplicate creation.
- If similarity is uncertain, explain the tradeoff and choose the safer option.
- Never create `Hero2`, `NewHero`, `HeroBlockNew`, or similar duplicate naming drift.
