# Skill: figma-component

Create or patch reusable Strapi block contracts from Figma.

## Decide First

Choose exactly one:
- `reuse`
- `reuse-with-patch`
- `create-new`

Check only likely matching schemas in:
- `src/components/blocks/`
- `src/components/elements/`
- `src/api/sitemap/content-types/sitemap/schema.json`
- `config/sitemap-components.ts`

Stop exploring when the decision is clear.

## Naming

- block file: meaningful kebab-case
- block UID: `blocks.<slug>`
- display name: clear human-readable title
- repeated child elements named by purpose, not position

Avoid vague or duplicate names.

## Modeling Rules

- schema models content, not styling
- repeated items become reusable repeatable elements
- prefer stable scalar fields, media fields, and reusable nested components
- avoid flattening repeated cards into many sibling fields
- avoid duplicate link/media/card shapes when an existing element already fits

## Common Rule

Every generated block must contain:

```json
"Common": {
  "type": "component",
  "component": "elements.common",
  "repeatable": false
}
```

If patching a reused block and `Common` is missing, add it.

## Required Updates

Update all relevant files before finishing:
1. block schema
2. any new or patched element schemas
3. `src/api/sitemap/content-types/sitemap/schema.json`
4. `config/sitemap-components.ts`

## Populate Rule

In `config/sitemap-components.ts`:
- never use `populate: "*"`
- populate nested fields intentionally
- recurse through nested components
- use helper constants for repeated shapes
- populate `Common` explicitly
- populate media wrappers explicitly

Use `true` only for simple leaf cases.

## Output Notes

Record:
- reuse decision
- block UID
- whether `Common` was added
- helper constants added or reused
