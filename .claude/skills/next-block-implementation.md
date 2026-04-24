# Skill: next-block-implementation

Implement or patch the frontend block after the Strapi contract is settled.

## Inputs

- normalized Monday ticket summary
- Figma reference
- backend component UID and field contract
- frontend reuse decision

---

## Required Context

Before editing frontend files:
- read `nextjs-base/ai-memory.md` if present
- read `nextjs-base/tailwind.config.ts`
- read `nextjs-base/.claude/skills/figma-component.md`
- read `nextjs-base/.claude/skills/figma-responsive.md`
- read `nextjs-base/.claude/skills/figma-a11y.md`
- read `.claude/skills/generation-standards.md`

Reuse the existing project style and block conventions.

---

## Target Files

- `nextjs-base/src/components/blocks/<ComponentName>.tsx`
- `nextjs-base/src/components/blocks/FullBlockRenderer.tsx`
- `nextjs-base/src/typings/blocks.d.ts` when a new explicit block type is needed

---

## Implementation Steps

### Step 1 - Generate Or Patch Component

Create a React component that:
- accepts the block contract from Strapi
- renders the design faithfully
- uses Tailwind config primitives and existing local patterns first
- reuses existing elements/components whenever possible
- promotes repeated CTA/input/card/control patterns into `nextjs-base/src/components/ui` or existing reusable layers instead of hardcoding them in one block

Do not generate a brand-new design system.

### Step 1a - Tailwind Config First

Before writing class names, inspect `nextjs-base/tailwind.config.ts` and prefer project-defined primitives in this order:

1. semantic colors from `theme.extend.colors`
2. project font families from `theme.extend.fontFamily`
3. custom radii, shadows, heights, screens, timing functions, animations, and keyframes
4. custom utility/component classes added by Tailwind plugins
5. existing class patterns from the codebase
6. generic Tailwind utility classes only as fallback

In this repo, prefer configured classes like:
- `bg-primary`, `bg-secondary`, `text-pineGreen`, `bg-earlyDawn`, `text-grey`
- `font-dubai`, `font-rakkas`
- `rounded-xs`, `rounded-md`, `rounded-2xl`, `shadow-md`, `shadow-xl`
- `xs:`, `md-lg:`, `al:`, `xxl:`, `1xl:`
- `ease-apple`, `ease-studio`, `animate-marquee`
- plugin utilities like `h1`, `h2`, `h3`, `p`, `small`, `large`, `xsmall`, `flex-center`

Only fall back to generic utilities when the config and existing patterns do not already represent the design requirement.

### Step 1b - Typography: Use Semantic Tags, Not Custom Font Sizes

The Figma dev panel shows CSS comments like `/* H1 */`, `/* H2 */`, `/* H6 */`, `/* P1 */`, etc. next to font properties. These map **directly** to the typography component classes already defined in `tailwind.config.ts` (via `addComponents`).

**Rule: always use the correct HTML tag (`<h1>`–`<h6>`, `<p>`) or the corresponding Tailwind class (`.h1`–`.h6`, `.p`, `.small`, `.large`, `.base`, `.h1-banner`, `.h2-large`, `.h3-large`, `.h5-large`, `.h5-large-2`, `.h2-small`, `.h1-plus-1`, `.h1-plus-2`, `.section-title`) instead of writing custom `text-[80px] font-bold leading-[1.1]` by hand.**

Mapping from Figma CSS comments to project classes:
- `/* H1 */` → `<h1>` tag or `.h1` class (font-size, weight, line-height all handled)
- `/* H2 */` → `<h2>` tag or `.h2` class
- `/* H3 */` → `<h3>` tag or `.h3` class
- `/* H4 */` → `<h4>` tag or `.h4` class
- `/* H5 */` → `<h5>` tag or `.h5` class
- `/* H6 */` → `<h6>` tag or `.h6` class
- `/* P1 */` or body text → `<p>` tag or `.p` class
- Small text (14px) → `.small` class
- Large text (20px) → `.large` class
- Base text (16px) → `.base` class
- Extra-large headings → `.h1-banner`, `.h2-large`, `.h1-plus-1`, `.h1-plus-2` etc.

These classes already include responsive breakpoints (`@media max-width: 767px`), so do **not** add redundant mobile overrides like `max-md:text-[32px]` when the component class already handles it.

**What to avoid:**
- `text-[80px] font-[700] leading-[1.1]` when `<h1>` or `.h1` already defines this
- `text-[18px] font-medium leading-[1.1]` when `.h6` or `<h6>` already matches
- `text-[50px] font-bold leading-[1.2]` when `.h2` already covers it
- Pixel-based arbitrary values like `px-[20px]`, `gap-[10px]`, `mt-[120px]` when Tailwind has standard spacing utilities (`px-5`, `gap-2.5`, `mt-30`) or rem-based arbitrary values (`px-[2rem]`, `gap-[1rem]`, `mt-[12rem]`)

**Sizing & spacing priority:**
1. Tailwind config-defined values (spacing scale, custom values)
2. Standard Tailwind utilities (`p-4`, `gap-6`, `mt-10`)
3. Arbitrary values in **rem** (`p-[2rem]`, `gap-[1rem]`) — preferred over px
4. Arbitrary values in **px** (`p-[20px]`) — only as last resort for pixel-perfect edge cases

Font families are also pre-configured — `font-mermaid` for headings, `font-red-hat-display` for body. The `addComponents` block in tailwind config auto-applies `font-mermaid` to all `h1`–`h6` tags and `.h1`–`.h6` classes, so you rarely need to set font-family manually on headings.

### Step 1c - Layout Fidelity: Study Figma Coordinates Before Coding

The Figma `get_design_context` response includes **exact x/y positions, widths, and heights** for every node. These are the ground truth for the layout structure — study them carefully before choosing a CSS layout strategy.

**Rules:**

1. **Reconstruct the visual grid from coordinates, not assumptions.** If the Figma shows two items at y=427 on the right and one item at y=700 spanning the full width on the left, that is a specific asymmetric grid — not a simple `flex-wrap`. Use CSS Grid with explicit column/row definitions or nested flex containers that match the actual groupings.

2. **Identify visual dividers/lines.** Figma designs often include thin lines (1px height/width) separating columns or sections. These must be rendered as actual elements (`<div className="w-px h-full bg-black/10" />` or similar). Do not skip them.

3. **Stats/counters with mixed sizes need explicit row grouping.** When stat items have visually different sizes (e.g. "11,000" is 3x wider than "4"), the layout uses intentional asymmetric columns — not equal-width flex children. Group stats into explicit rows matching the Figma structure.

4. **Two-column layouts with a divider** are extremely common. The pattern is:
   ```
   [Left column] | [Right column]  ← separated by a vertical line
   ```
   Render this as a flex row with a `w-px bg-black/10 self-stretch` divider element between columns.

5. **Do not collapse nested Figma frames into flat containers.** If the Figma has:
   - Frame A (top section with 2 columns)
   - Frame B (bottom section with different column split)
   
   Keep them as separate container `<div>`s with their own layout, not one big flex-wrap.

6. **Rich text fields (from CKEditor):** Render using `html-react-parser` (`import parse from "html-react-parser"`) — **never** use `dangerouslySetInnerHTML`. Wrap the parsed output inside the appropriate container element with the correct typography class. Example:
   ```tsx
   import parse from "html-react-parser";
   // ...
   {Heading && (
     <div className="h2 colored-heading section-title">
       {parse(Heading)}
     </div>
   )}
   ```
   The CMS editor applies colors (e.g. secondary/gold on specific words), bold, and other formatting. The frontend just parses and renders the HTML — no manual text splitting or `HighlightedText` matching logic needed.

### Step 2 - Respect Existing Typing

If the repo uses explicit block interfaces in `src/typings/blocks.d.ts`:
- add or patch the relevant type

If an existing generic dynamic-zone shape is enough:
- do not add unnecessary typings noise

### Step 2a - Server And Client Boundaries

When a page or block depends on backend-fetched content:

- fetch on the server first where possible
- use `nextjs-base/src/lib/methods.server.ts`
- wrap interactive UI in a child client component only when browser state is actually needed

For listing pages, the default pattern is:
- server wrapper for data fetching
- client child for interactions

Do not default to client-side fetching for listing content.

### Step 3 - Register Renderer Mapping

Update:
- `nextjs-base/src/components/blocks/FullBlockRenderer.tsx`

Ensure:
- the component is imported
- the `_component` switch case is registered
- the case uses the backend `_component` UID exactly

### Step 4 - Reuse Path

If reusing an existing component:
- patch only the missing prop handling or registration
- do not duplicate the block under a new file name

---

## Rules

- Match the backend `_component` exactly.
- Keep the component reusable and composable.
- Follow the existing frontend `.claude` rules for accessibility and responsiveness.
- Treat `nextjs-base/tailwind.config.ts` as the primary styling contract for generated blocks.
- Treat the Figma frame width as the baseline viewport for visual matching. If the design is a 1440px desktop frame, the intended desktop sizes should already be active at that viewport instead of being delayed behind `md:` or another too-small breakpoint.
- Do not generate classes like `md:text-[8rem]` when the design should be `6rem` on the same 1440px desktop viewport. The matching desktop size must be the active class at that viewport, with responsive prefixes reserved for real deviations above or below it.
- Never overwrite a mature block wholesale if a small patch will do.

### CKEditor / Rich Text Fields — Mandatory Pattern

Any Strapi field using the CKEditor5 custom field (`"type": "customField", "customField": "plugin::ckeditor5.CKEditor"`) returns HTML. On the frontend, render it using the project's `RichText` component.

**Priority order:**
1. **Use `<RichText />` component** (`@/components/blocks/RichText`) — this is the default. It wraps `html-react-parser` with consistent prose styling, variant support, and proper typography classes.
2. **Fall back to `parse()` directly** (`import parse from "html-react-parser"`) — only if `RichText.tsx` does not exist in the codebase.
3. **Never use `dangerouslySetInnerHTML`.**

```tsx
import RichText from "@/components/blocks/RichText";

// For a heading-level CKEditor field:
{Heading && (
  <RichText content={Heading} className="h2 colored-heading section-title" />
)}

// For a body/quote-level CKEditor field:
{Quote && (
  <RichText content={Quote} className="h2-large" />
)}

// Light variant (white text on dark backgrounds):
{Heading && (
  <RichText content={Heading} variant="light" className="h1-banner" />
)}
```

`RichText` supports three variants:
- `"default"` — dark headings, muted body text (for white/light backgrounds)
- `"light"` — white headings and text (for dark/image backgrounds)
- `"contrast"` — white headings with drop shadow (for overlays)

How to identify CKEditor fields — check the corresponding Strapi component JSON:
- If the field has `"type": "customField"` + `"customField": "plugin::ckeditor5.CKEditor"` → use `<RichText />`
- If the field has `"type": "string"` or `"type": "text"` → render as plain text `{value}`

This applies to **every** block component, not just headings — any field backed by CKEditor must use `<RichText />`.

### Animated Stat Counters – Mandatory Pattern

When a block contains numeric stats/counters (e.g. "11,000 People", "4 Decades", "9 Countries"), the numbers **must always** use a GSAP rolling/counting animation — never render as static text.

Use GSAP's `ScrollTrigger` to trigger the count-up animation when the stat scrolls into view.

```tsx
"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AnimatedCounter = ({ value, className }: { value: string; className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);

  // Extract numeric part and any suffix/prefix (e.g. "11,000" → 11000)
  const numericValue = parseFloat(value.replace(/,/g, ""));
  const hasCommas = value.includes(",");

  useEffect(() => {
    if (!ref.current || isNaN(numericValue)) return;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: numericValue,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 85%",
        once: true,
      },
      onUpdate: () => {
        if (!ref.current) return;
        const formatted = hasCommas
          ? Math.round(obj.val).toLocaleString()
          : Math.round(obj.val).toString();
        ref.current.textContent = formatted;
      },
    });
  }, [numericValue, hasCommas]);

  return <span ref={ref}>0</span>;
};
```

This pattern applies whenever the design shows large numbers with labels (key figures, stats, counters). GSAP is already available in this project.
