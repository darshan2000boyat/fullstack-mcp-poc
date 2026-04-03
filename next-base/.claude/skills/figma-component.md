# Skill: figma-component

Build production Next.js + Tailwind components from extracted Figma data.

---

## Step 1 — Component Inventory

Before writing any code, find what already exists:

1. Read `{workspace_path}/ai-memory.md` Component Inventory table (if available)
2. List `{workspace_path}/src/components/` — all `.tsx` files
3. List `{workspace_path}/src/app/_components/` — all `.tsx` files
4. Cross-reference `component_map` from figma-extract for direct Figma → local mappings

**Reuse rule:** If a Figma component matches an existing local component by name, purpose, or structure — IMPORT and USE it. Do not recreate existing components. Extend via props if needed.

---

## Step 1b — Class Pattern Reference

Before writing className strings, build a `class_patterns` reference to stay consistent with the existing codebase:

1. **Check ai-memory.md first** — Component Inventory rows often reveal the established patterns (card structure, button classes, heading styles). Extract what you can from there.
2. **If patterns are still unclear**, read ONE representative component file (prefer the most recently modified `.tsx` in `src/components/`). Do not read more than one file for this step.

Build `class_patterns` from what you find:
```
class_patterns = {
  card:        "rounded-xl border border-border bg-card p-4",
  page_wrap:   "w-full max-w-7xl mx-auto px-4 sm:px-6",
  heading:     "text-xl font-semibold text-foreground",
  body_text:   "text-sm text-muted-foreground",
  btn_primary: "bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90",
  focus_ring:  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
}
```

When the design matches an existing pattern, use the exact class string from `class_patterns` — not a freshly invented equivalent.

---

## Step 2 — Determine File Placement

| What it is | Where it goes |
|------------|--------------|
| New page-level section | `src/app/{route}/_components/{Name}.tsx` |
| New shared UI primitive | `src/components/{Name}.tsx` |
| New full page | `src/app/{route}/page.tsx` |
| Extension of existing component | Edit existing file, don't duplicate |

---

## Step 3 — Component Structure

```tsx
// 'use client' ONLY if: onClick handlers, useState, useEffect, browser APIs
// Omit for pure display components

interface {ComponentName}Props {
  // Explicit prop types — no `any`
  // Include optional `className` for composition
  className?: string
}

export function {ComponentName}({ className, ...props }: {ComponentName}Props) {
  return (
    // JSX
  )
}

export default {ComponentName}
```

---

## Step 4 — Next.js Rules

| Element | Rule |
|---------|------|
| Images | `<Image src="..." width={n} height={n} alt="..." />` from `next/image` |
| Internal links | `<Link href="...">` from `next/link` |
| Icon files | `<img src="/icon/24/name.svg" width={24} height={24} alt="" aria-hidden />` |
| External images | `<Image>` with `unoptimized` if CDN not in next.config |
| Fonts | Reference existing CSS font variables from layout.tsx — never import new fonts |
| Client components | Use `'use client'` only when truly needed — prefer server components |

---

## Step 5 — className Merging

Always use `cn()` for conditional or composed classNames:

```tsx
import { cn } from '@/lib/utils'

// Correct usage
className={cn(
  "base-classes here",
  isActive && "active-variant-classes",
  variant === 'outline' && "outline-variant-classes",
  className  // always last — allow caller to override
)}
```

---

## Step 6 — Tailwind Class Order

Write classes in this order for readability:
```
display/layout → position → sizing → spacing → color/bg → typography → border → effects → responsive → state
```
Example:
```
"flex items-center justify-between relative w-full h-12 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium border border-border rounded-lg shadow-sm hover:bg-primary/90 focus-visible:ring-2 sm:h-14"
```

---

## Step 7 — Code Quality Rules

- [ ] No hardcoded hex colors or raw px values — use tokens/scale only
- [ ] No `any` types — use `unknown` or specific types
- [ ] No unused imports — only import what's used
- [ ] No console.log statements
- [ ] Arrays and `.map()` calls always have `key` prop with stable unique value
- [ ] Props destructured in function signature (not inside body)
- [ ] Semantic variable names — no `div1`, `wrapper2`, `container3`
- [ ] Single responsibility — one component does one clear thing

---

## Handling Missing Assets

For icon resolution rules and placeholder patterns, follow the **Icon Resolution Protocol** in `figma-extract.md`. Collect all TODOs into the final output summary.

---

## Tailwind Config Priority

Before inventing utility classes, read `{workspace_path}/tailwind.config.ts` and treat it as the primary styling contract.

Prefer this order:
1. semantic tokens and named values from the Tailwind config
2. custom utilities/components defined by plugins in the Tailwind config
3. existing `class_patterns` from the codebase
4. generic Tailwind utilities only as fallback

In this project, prioritize configured values such as:
- colors like `primary`, `secondary`, `tertiary`, `pineGreen`, `limeGreen`, `earlyDawn`, `deepKhaki`, `grey`, `surfaceColor`
- fonts like `font-dubai`, `font-rakkas`
- radii like `rounded-xs`, `rounded-md`, `rounded-2xl`, `rounded-3xl`
- shadows like `shadow-md`, `shadow-xl`, `shadow-2xl`
- breakpoints like `xs`, `md-lg`, `al`, `xxl`, `1xl`
- timing and animation helpers like `ease-apple`, `ease-studio`, `animate-marquee`
- plugin classes like `h1`, `h2`, `h3`, `p`, `small`, `large`, `xsmall`, `flex-center`

If a design need is already represented by config, use that class instead of a raw arbitrary alternative. Only fall back to generic utilities when the Tailwind config does not already express the design requirement.
