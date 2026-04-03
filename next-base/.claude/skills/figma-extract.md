# Skill: figma-extract

MCP extraction sequence for Figma frames. Execute all calls before writing any code.

---

## MCP Call Sequence

### Call 1 — Design Structure (PRIMARY SOURCE OF TRUTH)
```
get_design_context(node_url: figma_url)
```
Returns the JSX-like component tree. This governs structure, hierarchy, layout, and nesting.

**If truncated:** Call `get_metadata(node_url: figma_url)` to get child node IDs, then call `get_design_context(node_id: id)` for each chunk. Merge results before continuing.

### Calls 2 + 3 — Run in parallel after Call 1 completes

**Call 2 — Design Tokens**
```
get_variable_defs(node_url: figma_url)
```
Returns all Figma variables: colors, spacing, typography, radius, shadows.
Build `token_map = { "figma/token/name": "--css-variable" }` after this returns.

**Call 3 — Visual Reference**
```
get_screenshot(node_url: figma_url)
```
Returns the rendered screenshot. Use ONLY for:
- Replacing placeholder text (see below)
- Breaking ties when JSX and tokens conflict
- Verifying icon orientation and image appearance
- Checking gradient direction and shadow placement

### Call 4 — Component Map (conditional)
Only call if `ai-memory.md` Component Inventory has ≥5 components:
```
get_code_connect_map(node_url: figma_url)
```
Returns Figma component name → local file path mapping.
Use to identify existing components to reuse instead of rewriting.
Skip this call if the project has fewer than 5 components — it rarely returns useful data.

---

## Source of Truth Hierarchy
```
JSX structure  >  Design tokens  >  Screenshot
```
Never override JSX structure based on screenshot alone. Never invent values not present in tokens or JSX.

---

## Icon Resolution Protocol

For every icon referenced in the design context:

1. Extract `icon_name` and `size` from the JSX node
2. **Check primary:** does `public/icon/{size}/{icon_name}.svg` exist on disk?
3. **Check fallback:** does `public/other/{icon_name}.svg` exist?
4. **Check cross-size:** does `public/icon/` contain the icon at a different size?
5. **If Figma asset URL exists:** attempt `get_image(node_id)` to download the actual asset
6. **If still not found:**
   - Insert `{/* TODO: missing icon — {icon_name} ({size}px) */}` in the JSX
   - Use `<div className="w-{size/4} h-{size/4} rounded bg-muted" aria-hidden />` as placeholder
   - Log to `icons_missing[]` output

**NEVER invent SVG path data. NEVER substitute a visually similar icon. NEVER assume an icon exists.**

---

## Placeholder Text Resolution

After getting the screenshot, replace all Figma placeholder text:
| Placeholder | Resolution |
|-------------|------------|
| "Button", "CTA" | Real button label from screenshot |
| "Label", "Title", "Heading" | Real content text from screenshot |
| "Description", "Body", "Subtitle" | Real descriptive text |
| "Item 1", "Item 2", "Item N" | Real list items from screenshot |
| "Name", "Username" | Example real name or keep as prop |
| "00", "0.00", "$0" | Representative data or keep as prop |

If screenshot text is also ambiguous, use sensible prop defaults.

---

## Screenshot Storage

After `get_screenshot` returns, save the image to disk immediately so it can be used for visual verification later.

**Save path:**
```
{workspace_path}/.figma/screenshots/{file_id}/{node_id}--{frame_name}.png
```

**How to derive the path values:**
- `file_id` — the alphanumeric ID from the Figma URL: `figma.com/design/{file_id}/...`
- `node_id` — the `node-id` query param, with `:` replaced by `-` (e.g. `42:100` → `42-100`)
- `frame_name` — the frame/component name from `get_design_context`, lowercased, spaces replaced with `-` (e.g. `Campaign Card` → `campaign-card`)

**Example:**
```
.figma/screenshots/abc123XYZ/42-100--campaign-card.png
```

Create the directory if it doesn't exist. Write the raw image bytes from the MCP response.
Record `screenshot_path` in the output object for use in Phase 4 (verify).

---

## Output Structure

After all MCP calls complete, you should have:

```
{
  design_context:   <full JSX tree from get_design_context>,
  token_map:        { "figma/color/primary": "--color-primary", ... },
  screenshot_path:  "{workspace_path}/.figma/screenshots/{file_id}/{node_id}--{frame_name}.png",
  component_map:    { "FigmaButton": "src/components/Button.tsx", ... },  // optional
  icons: {
    resolved: ["arrow-right.svg", "check.svg"],
    missing:  ["star-filled.svg"]
  }
}
```

Do not proceed to component building until all calls have returned, token_map is built, and screenshot has been saved to disk.
