# Skill: post-generation-visual-qa

Use this after frontend generation plus Strapi content/image seeding when the next step is visual verification of a real page against Figma.

## Goal

Run a tight verification loop:

1. seeded sitemap page exists
2. page opens in Playwright
3. screenshot is compared against Figma
4. implementation is patched
5. page is rechecked

Repeat until the result is visually acceptable.

---

## Preconditions

- Playwright MCP is available and opens a visible browser window.
- Figma MCP is available.
- The frontend route is known.
- The page has already been seeded into `api::sitemap.sitemap` with the correct dynamic-zone blocks.

If the route or seeded content is missing, resolve that first. Visual QA is downstream of generation and seeding.

---

## Step 1 - Verify The Route And Seeded Content

- Confirm the target sitemap entry exists in Strapi.
- Confirm the frontend route for that entry is known.
- Load the page and verify:
  - no 404/500 state
  - no broken images
  - required copy is present
  - the expected blocks are rendered in order

If the page is not renderable, stop visual comparison and fix the data/rendering issue first.

---

## Step 2 - Match The Figma Viewport

- Read the Figma frame width and height.
- Use that frame width as the Playwright viewport for comparison.
- If Figma contains separate desktop and mobile frames, validate them separately.

Do not compare a 1440px Figma frame against an arbitrary browser width.

---

## Step 3 - Capture Comparable References

- Take a fresh Playwright screenshot after fonts, images, and animations settle.
- Fetch the Figma screenshot and design context for the same node.
- Compare at least:
  - outer spacing and section heights
  - grid structure and divider placement
  - text block widths, line breaks, and alignment
  - image crop, scale, and focal area
  - border radius, shadows, strokes, and fills
  - CTA sizing and icon placement

---

## Step 4 - Fix Root Causes, Not Symptoms

When differences appear:

- fix spacing tokens, layout structure, breakpoints, or markup grouping
- fix media rendering or seed data if the wrong asset is displayed
- fix typography classes if the wrong token or line-height was used
- reseed Strapi content if the page mismatch comes from content/image data rather than the component

Avoid screenshot-specific hacks that only work for one page state.

---

## Step 5 - Recheck In A Loop

After each patch:

1. refresh the page in Playwright
2. wait for load/network idle
3. capture another screenshot
4. compare again

Keep iterating until:

- no material mismatch remains, or
- the only remaining differences are minor browser rendering tolerances

---

## Acceptance Bar

Acceptable:

- structure and spacing match closely
- alignment is consistent section by section
- images and seeded content match the design intent
- no obvious visual regressions remain

Not acceptable:

- broken media
- wrong block order
- visibly different spacing rhythm
- shifted alignment or incorrect widths
- typography that changes line wrapping materially

---

## Integration Note

This skill is intended to be the last phase after:

1. Figma-driven block/page generation
2. Strapi schema/content wiring
3. sitemap entry creation or update

When running `/implement-figma-block` or a future root orchestrator flow, invoke this skill automatically if a concrete page URL is available for browser validation.
