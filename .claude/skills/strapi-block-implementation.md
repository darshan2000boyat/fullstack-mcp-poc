# Skill: strapi-block-implementation

Create or patch the backend Strapi block contract first.

## Inputs

- normalized Monday ticket summary
- Figma reference
- backend reuse decision

---

## Target Files

- `strapi-base-v5/src/components/blocks/<component-slug>.json`
- `strapi-base-v5/src/api/sitemap/content-types/sitemap/schema.json`

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
- CKEditor5 custom field — see rule below
- `boolean`
- `integer`
- `media`
- `json`
- `component` only if an existing nested component should be reused

#### When to use CKEditor5 instead of `text` or `string`

CKEditor5 is configured in this Strapi project as a custom field plugin. Any heading, title, or body field that contains **styled text with mixed colors, bold/italic spans, or inline highlighted words** in the Figma design **must** use the CKEditor5 custom field — never plain `text` or `string` with a separate `HighlightedText` field.

**Exact JSON schema format for CKEditor fields:**
```json
"FieldName": {
  "type": "customField",
  "customField": "plugin::ckeditor5.CKEditor",
  "options": {
    "preset": "defaultHtml"
  }
}
```

This is **not** `"type": "richtext"`. It must be `"type": "customField"` with `"customField": "plugin::ckeditor5.CKEditor"` and `"options": { "preset": "defaultHtml" }`.

Indicators that a field needs CKEditor:
- Part of the text is a different color (e.g. gold/secondary accent on specific words)
- The text contains bold, italic, or underline applied to a subset of the content
- The Figma shows multi-line headings where individual lines have distinct styling

When CKEditor is used, the content editor applies colors and formatting — no `HighlightedText` companion field is needed.

Do **not** use CKEditor for plain single-style fields like eyebrows, author names, or simple labels — use `string` for those.

**Frontend implication:** Every CKEditor field must be rendered on the frontend using the `<RichText />` component (`@/components/blocks/RichText`). If that component does not exist, fall back to `html-react-parser` directly. Never use `dangerouslySetInnerHTML`. See `next-block-implementation.md` for the full pattern.

Always favor reusable content fields over presentation-specific noise.

**Never create a `HighlightedText` companion field.** The old pattern of `Heading` (text) + `HighlightedText` (string) where the frontend manually searches and highlights is deprecated. Use a single CKEditor field and let the editor handle all formatting.

Good examples:
- `Eyebrow` — `string`
- `Title` — `string` (single-style) or CKEditor (if styled)
- `Heading` — CKEditor (when it has mixed colors/bold, any highlighted typography, or if styled)
- `Description` — `text` or CKEditor
- `Quote` — CKEditor (when part is highlighted)
- `Link` — `component` (elements.link)
- `Image` / `Media` — `media` or `component` (elements.image-video-item)

Avoid dumping raw Figma styling into Strapi.

### Step 3 - Patch Or Create

If reusing:
- open the existing JSON
- add only missing fields
- preserve current naming unless clearly broken

If creating:
- follow the local JSON schema conventions already used in `strapi-base-v5/src/components/blocks`

### Step 4 - Register In Dynamic Zone

Ensure `component_uid` is present in:
- `strapi-base-v5/src/api/sitemap/content-types/sitemap/schema.json`

Append it only if missing.

### Step 5 - Register Populate Rules In Sitemap Components

Every new block **must** be added to `strapi-base-v5/config/sitemap-components.ts` inside the `ALL_BLOCKS` object.

- Read the file first to understand existing helpers (`POPULATE_COMMON`, `POPULATE_IMAGE_VIDEO_ITEM`, `POPULATE_LINK`, etc.).
- Add a new key matching the `component_uid` (e.g. `"blocks.hero-banner"`).
- Define a `populate` object that covers every nested field Strapi needs to resolve:
  - `Common` → use `POPULATE_COMMON`
  - `Media` (image-video-item) → use `POPULATE_IMAGE_VIDEO_ITEM`
  - `Link` (elements.link) → use `POPULATE_LINK`
  - Repeatable components with media/links → nest their own `populate` object
  - Simple scalar-only components → `POPULATE_COMMON` or bare `{}` is enough
- Reuse the existing helpers. Only create a new helper if a pattern repeats across 3+ blocks and doesn't fit any existing one.
- If this step is skipped, the block data will not be populated in API responses and the frontend will receive empty nested fields.

---

## Rules

- Backend contract is the source of truth for `_component`.
- Do not create duplicate schemas for the same visual block.
- Keep field names stable and human-readable.
- Preserve unrelated existing fields.
