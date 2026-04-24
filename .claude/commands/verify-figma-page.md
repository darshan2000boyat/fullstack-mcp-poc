# /verify-figma-page - Seeded Page Visual QA Loop

Validate a seeded sitemap page against its Figma frame using Playwright MCP in a real browser window, then iterate on implementation until the page is visually aligned.

**Usage:** `/verify-figma-page <page_url> <figma_url>`

---

## Inputs

- `page_url` - full frontend URL to validate, for example `http://localhost:3000/en/grand-hayatt`
- `figma_url` - full Figma file/frame/node URL for the target page or section

---

## Preconditions

- Playwright MCP must be available and configured in headful mode so Claude can open a visible browser window.
- Figma MCP must be available.
- `nextjs-base` and `strapi-base-v5` must already be running locally.
- The page must already exist in the sitemap collection type and contain the seeded content and media needed for comparison.

If any of the above is missing, stop and report the blocker instead of pretending validation happened.

---

## Required Reads

Before validating:

1. read `.claude/skills/qa-ui-validator.md`
2. read `.claude/skills/post-generation-visual-qa.md`
3. read `nextjs-base/tailwind.config.ts`
4. inspect the current frontend route and block components involved in the page

---

## Workflow

1. Confirm the page resolves in the browser and that seeded content and images are present.
2. Open `page_url` in Playwright MCP.
3. Wait for the page to settle and fonts/images to finish loading.
4. Capture a page screenshot at the Figma frame’s intended viewport width.
5. Pull Figma design context and screenshot for the same frame.
6. Compare layout, spacing, alignment, sizing, typography, colors, borders, shadows, and media cropping.
7. Patch the frontend and, if needed, the seeded Strapi content to remove mismatches.
8. Refresh the page in Playwright and repeat until there are no material diffs left or only accepted rendering tolerances remain.

---

## Rules

- Treat Figma as the visual source of truth.
- Do not mark a page as matched if content is missing, images are broken, or major alignment issues remain.
- Use the same viewport width as the Figma frame for desktop comparison.
- Check mobile separately if the Figma scope includes a mobile frame.
- Do not claim literal perfect pixel parity across browsers; allow only small rendering tolerance for font rasterization and image resampling.
- Prefer fixing the actual component/layout/token problem instead of papering over a single screenshot mismatch.

---

## Output

Report:

1. page URL validated
2. Figma URL used
3. viewport(s) checked
4. issues found
5. fixes applied
6. residual differences, if any
7. files changed
