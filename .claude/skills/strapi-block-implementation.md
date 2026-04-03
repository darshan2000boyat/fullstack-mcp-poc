# Skill: strapi-block-implementation

Create or patch the backend Strapi block contract first.

## Inputs

- normalized Monday ticket summary
- Figma reference
- backend reuse decision

---

## Target Files

- `strapi-base/src/components/blocks/<component-slug>.json`
- `strapi-base/src/api/sitemap/content-types/sitemap/schema.json`

Use another category only if the existing Strapi structure clearly demands it.

---

## Implementation Steps

### Step 1 - Derive Component Identity

Define:
- `component_slug` in kebab-case
- `component_uid` as `blocks.<component-slug>`
- `displayName` in Pascal or title case consistent with nearby Strapi components

Derive the name from the ticket purpose and the Figma frame name.

### Step 2 - Define Schema

Create a minimal reusable schema from the design.

Prefer simple Strapi field types:
- `string`
- `text`
- `boolean`
- `integer`
- `media`
- `json`
- `component` only if an existing nested component should be reused

Always favor reusable content fields over presentation-specific noise.

Good examples:
- `eyebrow`
- `title`
- `description`
- `primaryActionLabel`
- `primaryActionUrl`
- `image`
- `disabled`

Avoid dumping raw Figma styling into Strapi.

### Step 3 - Patch Or Create

If reusing:
- open the existing JSON
- add only missing fields
- preserve current naming unless clearly broken

If creating:
- follow the local JSON schema conventions already used in `strapi-base/src/components/blocks`

### Step 4 - Register In Dynamic Zone

Ensure `component_uid` is present in:
- `strapi-base/src/api/sitemap/content-types/sitemap/schema.json`

Append it only if missing.

---

## Rules

- Backend contract is the source of truth for `_component`.
- Do not create duplicate schemas for the same visual block.
- Keep field names stable and human-readable.
- Preserve unrelated existing fields.
