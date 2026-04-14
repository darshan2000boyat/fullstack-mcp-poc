# Skill: figma-verify

Verify generated Strapi block contracts before delivery.

---

## Check 1 - Naming Quality

- block file name is kebab-case and meaningful
- `displayName` is human-readable
- nested element names describe purpose, not position
- no duplicate or near-duplicate naming drift was introduced

---

## Check 2 - Reuse Quality

- confirm an existing block or element was not duplicated unnecessarily
- confirm repeated design items were modeled as reusable repeatable elements where appropriate
- confirm new schemas were created only when reuse was not sufficient

---

## Check 3 - Contract Quality

- every field reflects content, not styling
- optional groups are modeled safely
- repeated content is not flattened into redundant top-level fields
- media, links, and CTA content are modeled with stable reusable shapes

---

## Check 4 - Common Enforcement

- every generated block includes `Common`
- `Common` points to `elements.common`
- `Common` is non-repeatable

---

## Check 5 - Dynamic-Zone Registration

- block UID is present in `src/api/sitemap/content-types/sitemap/schema.json`
- no duplicate entry was inserted

---

## Check 6 - Sitemap Populate Coverage

Inspect `config/sitemap-components.ts`.

Verify:
- the block has an `ALL_BLOCKS` entry
- no `populate: "*"` was used
- `Common` is populated intentionally
- media fields use a helper pattern such as `POPULATE_IMAGE`
- nested components are populated recursively
- repeatable child elements are covered fully

If populate coverage is incomplete, fix it before delivery.

---

## Final Report Format

```text
Verification complete - {block_uid}
Reuse decision: {reuse | reuse-with-patch | create-new}
Common included: {yes | no}
Dynamic zone updated: {yes | no}
Populate updated: {yes | no}
Warnings: {list or none}
```
