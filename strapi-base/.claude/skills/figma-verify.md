# Skill: figma-verify

Validate and clean the generated component. Run after component is built, before delivery.

---

## Verification Process

Run each check. Apply fixes immediately where marked **[AUTO-FIX]**. Flag as warning where marked **[WARN]**.

---

### Check 1 — Hallucination Safety [AUTO-FIX]

**Icons:**
- For every `<img src="/icon/...">` or `<img src="/public/...">`, verify the file actually exists on disk
- If file not found → replace with TODO comment + placeholder div (see pattern below)

**CSS Variables:**
- For every `var(--token-name)` or Tailwind class like `text-primary`, `bg-card` — verify the CSS variable exists in globals.css
- If not found → add to globals.css with a comment, or flag as WARN if value is unknown

**Imports:**
- For every `import { X } from '...'`, verify the file path resolves on disk
- If not found → flag as WARN with the correct expected path

**Hardcoded values:**
- Scan for hex colors: `/['"#][0-9a-fA-F]{3,8}['"]/` → replace with nearest CSS variable
- Scan for raw px: `className=".*\[.*px.*\]"` → replace with Tailwind scale class
- Scan for inline fallbacks: `var(--token, #fallback)` → remove fallback value

---

### Check 2 — DOM Optimization [AUTO-FIX]

- **Remove** single-child wrapper `<div>` with no className or only `className=""`
- **Merge** two nested flex containers with identical direction and no conflicting styles
- **Remove** `className=""` (empty string) props
- **Remove** `style={{}}` (empty object) props
- **Collapse** `<div className="flex flex-col"><div className="flex flex-col gap-2">` → keep inner

---

### Check 3 — Tailwind Normalization [AUTO-FIX]

| Find | Fix |
|------|-----|
| `w-[Xrem]` or `w-[Xpx]` | Convert to nearest Tailwind step (`w-8`, `w-16`, etc.) |
| `h-[Xpx]` | Convert to `h-{n}` |
| `gap-[Xpx]` | Convert to `gap-{n}` |
| `p-[Xpx]` or `px-[Xpx]` | Convert to `p-{n}` or `px-{n}` |
| `text-[Xpx]` | Convert to `text-sm/base/lg/xl` etc. |
| `bg-gradient-to-*` | Change to `bg-linear-to-*` (Tailwind v4) |
| `rounded-[Xpx]` | Convert to `rounded-sm/md/lg/xl` |
| Duplicate classes | Remove duplicates (keep last) |

**Spacing reference:** 1 Tailwind unit = 4px. `p-4` = 16px, `p-3` = 12px, `p-2` = 8px.

---

### Check 4 — Responsive Safety

#### 4a — Layout [AUTO-FIX]
- Flex child containing text or truncation without `min-w-0` → add `min-w-0`
- `flex-row` with no stacking breakpoint on a container wider than ~400px → change to `flex-col sm:flex-row` (or `md:flex-row` for wider layouts)
- `grid-cols-{n}` (n > 1) with no responsive cols → prepend `grid-cols-1 sm:grid-cols-{n}` or `grid-cols-1 md:grid-cols-{n}`
- `gap-{n}` where n ≥ 8 on a mobile-visible flex row → reduce to `gap-4` at base, restore at `sm:gap-{n}`
- `px-{n}` or `p-{n}` where n ≥ 8 on a full-width container → reduce to `px-4` at base, restore at `sm:px-{n}`

#### 4b — Fixed Sizing [AUTO-FIX]
- Full-width containers with `w-{fixed}` (e.g. `w-96`, `w-80`) → convert to `max-w-{n} w-full`
- Fixed-width sidebars with no responsive → wrap in `w-full {breakpoint}:w-{n} shrink-0`
- `h-{n}` on a text container that could overflow → remove fixed height or add `min-h-{n}` instead

#### 4c — Absolute Positioning [AUTO-FIX where deterministic]
- `absolute` positioned elements without a `relative` parent → add `relative` to nearest meaningful parent
- `absolute` used for horizontal layout (i.e. replacing flex) → convert to `flex` layout
- `absolute` used for full-width overlays → ensure `inset-0` or explicit `top/left/right/bottom` values

#### 4d — Overflow & Scroll [AUTO-FIX]
- `overflow-hidden` on a container with dynamic or text content → change to `overflow-hidden` + `min-h-0` or WARN if intent is unclear
- No horizontal scroll guard on page-level wrapper → ensure `overflow-x-hidden` on `<body>` or outermost container
- Text in flex child with no truncation class and no wrap handling → add `break-words` or `truncate` depending on context

#### 4e — Touch Targets [AUTO-FIX]
- `<button>` or `<a>` with height < `h-10` (40px) and no padding compensation → add `min-h-10` to meet 40px minimum
- Icon-only buttons smaller than `w-10 h-10` → add `min-w-10 min-h-10` and `flex items-center justify-center`
- Clickable elements too close together (gap < `gap-2`) → increase to `gap-2` minimum

#### 4f — Typography [AUTO-FIX]
- Heading classes with no responsive size scaling on large text (`text-3xl` or above with no `sm:` variant) → add scaled version e.g. `text-2xl sm:text-3xl`
- `whitespace-nowrap` on text that could exceed mobile viewport → remove or scope to `sm:whitespace-nowrap`
- `<Image>` without `width`/`height` or `fill` prop → WARN (cannot auto-fix without knowing dimensions)

---

### Check 5 — Accessibility [AUTO-FIX where deterministic]

- `<img>` missing `alt` → add `alt=""` (deterministic: assume decorative)
- Icon-only `<button>` missing `aria-label` → WARN (cannot determine label automatically)
- `<img>` that's decorative missing `aria-hidden` → add `aria-hidden`
- Interactive element missing `focus-visible:` styles → add standard focus ring
- `<a>` with no text content and no `aria-label` → WARN

---

### Check 6 — Code Quality [AUTO-FIX]

- Remove unused imports (imports not referenced in JSX or logic)
- Remove `console.log` statements
- Remove `console.error` / `console.warn` debug statements
- `'use client'` present but no client-only APIs used → remove it
- `'use client'` absent but state/effects used → add it

---

### Check 7 — Visual Design Review

Open the Figma screenshot at `screenshot_path` and the generated component file side by side. Work through each point below using the screenshot as the reference — every judgement must be grounded in what you actually see in the image, not assumptions.

**1. Typography scale**
Look at the screenshot. Identify each text element visually — which is largest, which is smallest, what the hierarchy is. Then check the component: does the heading-to-body-to-caption scale match what the screenshot shows? Flag if any level is the same size as the one above or below it.

**2. Spacing rhythm**
In the screenshot, measure the visual gap between: elements within a group, between groups, and between sections. Gaps within a group should be visibly smaller than gaps between groups. Check the component uses the correct `gap-*` / `p-*` values to reproduce that rhythm. Flag if gaps look equal when the screenshot shows clear variation.

**3. Color roles**
In the screenshot, identify: the primary action color, background surfaces, text colors, border/divider colors. Check every colored element in the component uses the correct semantic token (`bg-primary`, `bg-card`, `text-muted-foreground`, `border-border`, etc.). Flag any element whose rendered color would not match the screenshot.

**4. Icon sizing and position**
In the screenshot, note the size and placement of every icon. Confirm the component renders each icon at the matching size (16/20/24/32px) and in the correct position relative to its sibling text or container. Flag size mismatches or icons placed in the wrong slot.

**5. Border radius consistency**
In the screenshot, check the radius on cards, buttons, inputs, and badges. Confirm all elements of the same type use the same `rounded-*` class, and that the visual roundness matches. Flag if the screenshot shows sharp corners but the component uses `rounded-xl`, or vice versa.

**6. Elevation and surface depth**
In the screenshot, identify which elements appear elevated (shadows, higher surface color) vs flat. Check the component reflects this — elevated elements use a shadow token, flat elements do not. Flag elements that are visually raised in the screenshot but have no shadow in the component.

**7. Alignment and text direction**
In the screenshot, note whether text blocks are left-, center-, or right-aligned, and whether the overall layout is left-anchored or centered. Confirm the component matches exactly — do not default to center or left if the screenshot shows otherwise.

**8. Content overflow readiness**
Look at the screenshot and identify text elements that are near the edge of their container, or lists with a fixed number of items. Confirm the component handles more or less content gracefully: text has `truncate` or `break-words`, lists don't assume exactly N items, containers don't rely on content fitting perfectly.

**For each discrepancy found:**
- Missing element → add it
- Wrong token/color → fix using `resolved_token_map`
- Layout or spacing mismatch → fix the flex/grid/gap values
- Cannot be auto-determined → add `{/* DESIGN REVIEW: {what was seen in screenshot vs what was coded} */}`

---

## Final Report Format

```
✅ Verification complete — {component_file_path}
Auto-fixed: {n} assets · {n} hardcoded values · {n} DOM · {n} Tailwind · {n} a11y · {n} responsive
Visual match: {excellent | good | needs-attention} — {brief description or "none"}
Warnings: {list or "none"}
Missing icons: {list or "none"}
Design review comments: {list or "none"}
```
