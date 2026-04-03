# Skill: figma-responsive

Mobile-first responsive layout rules for Figma-extracted components.

---

## Core Principles

1. **Mobile-first** — base styles target smallest screen; scale up with `sm:` `md:` `lg:` `xl:`
2. **Flex over fixed** — use `flex`, `flex-1`, `min-w-0`, `shrink-0` instead of pixel widths
3. **Fluid containers** — `w-full max-w-{n} mx-auto` for page-level wrappers
4. **Scale over arbitrary** — use Tailwind spacing/size scale, not `[12px]` arbitrary values
5. **Overflow safety** — always add `min-w-0` to flex children that contain text or truncation

---

## Common Layout Patterns

### Horizontal stack → vertical on mobile
```tsx
<div className="flex flex-col sm:flex-row gap-4">
```

### Content + sidebar
```tsx
<div className="flex flex-col lg:flex-row gap-6">
  <aside className="w-full lg:w-64 shrink-0">
  <main className="min-w-0 flex-1">
```

### Card grid
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
```

### Full-width section with max-width
```tsx
<section className="w-full px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
```

### Text that might overflow
```tsx
<p className="truncate min-w-0">         {/* single line */}
<p className="line-clamp-2 min-w-0">    {/* multi-line clamp */}
```

### Icon + text row (common in Figma)
```tsx
<div className="flex items-center gap-2 min-w-0">
  <img src="/icon/24/star.svg" width={24} height={24} alt="" aria-hidden className="shrink-0" />
  <span className="truncate">{label}</span>
</div>
```

---

## Breakpoints Reference

| Prefix | Min-width | Use for |
|--------|-----------|---------|
| (none) | 0px | Mobile default |
| `sm:` | 640px | Large phone / small tablet |
| `md:` | 768px | Tablet portrait |
| `lg:` | 1024px | Laptop / desktop |
| `xl:` | 1280px | Large desktop |
| `2xl:` | 1536px | Wide / ultrawide |

---

## Forbidden Patterns

| Instead of | Use |
|------------|-----|
| `w-[320px]` | `w-80` or `max-w-sm` |
| `h-[48px]` | `h-12` |
| `text-[14px]` | `text-sm` |
| `gap-[16px]` | `gap-4` |
| `p-[12px]` | `p-3` |
| `style={{ width: '100%' }}` | `className="w-full"` |
| `style={{ display: 'flex' }}` | `className="flex"` |
| Fixed sidebar `w-[280px]` with no responsive | `w-full lg:w-64 shrink-0` |

---

## Figma Fixed Sizes → Responsive Equivalents

Figma designs use fixed pixels. Convert intelligently:

| Figma intent | Responsive implementation |
|-------------|--------------------------|
| Fixed 320px container | `max-w-sm w-full` |
| Fixed 480px card | `max-w-lg w-full` |
| Fixed 1200px page | `max-w-7xl w-full mx-auto` |
| 40px button height | `h-10` (keep fixed — intentional) |
| 24px icon | `w-6 h-6 shrink-0` (keep fixed) |
| 16px gap | `gap-4` |
| Equal-width columns | `grid grid-cols-{n}` or `flex flex-1` |

---

## Responsive Audit Checklist

Run this audit on the completed component before handing off to figma-verify. Check every item — fix inline, don't defer.

### Layout
- [ ] Every `flex-row` that could break on narrow screens has a stacking breakpoint (`flex-col sm:flex-row`)
- [ ] Every multi-column grid starts with `grid-cols-1` at base
- [ ] Every full-width container uses `w-full` not a fixed width
- [ ] Page-level wrappers use `max-w-{n} mx-auto` with horizontal padding (`px-4 sm:px-6`)
- [ ] No two flex siblings fighting for width without `flex-1` or `shrink-0` declared

### Sizing & Spacing
- [ ] No `w-[{n}px]` or `h-[{n}px]` arbitrary values — all converted to Tailwind scale
- [ ] Large gaps (`gap-8` or more) have a reduced mobile value (`gap-4 sm:gap-8`)
- [ ] Large padding (`p-8` or more) has a reduced mobile value (`p-4 sm:p-8`)
- [ ] Fixed heights only on elements with intentionally fixed size (buttons, icons, avatars)

### Text
- [ ] Headings `text-2xl` and above have a smaller mobile size (`text-xl sm:text-2xl`)
- [ ] No `whitespace-nowrap` on content that could exceed 320px
- [ ] All text in flex containers has `min-w-0` on its parent to prevent overflow
- [ ] Long strings (names, URLs, descriptions) have `truncate` or `break-words`

### Touch & Interactivity
- [ ] All `<button>` and `<a>` elements are at least `h-10` (40px) tall
- [ ] Icon-only buttons are at least `w-10 h-10` with `flex items-center justify-center`
- [ ] Interactive elements have at least `gap-2` between them

### Overflow
- [ ] No element can cause horizontal scroll on a 375px viewport
- [ ] `overflow-hidden` is intentional — not accidentally clipping dynamic content
- [ ] Absolutely positioned elements are contained within a `relative` parent

### Images
- [ ] All `<Image>` components have `width` + `height` OR `fill` with a sized parent
- [ ] Images in cards use `aspect-{ratio}` to maintain proportions at any width
- [ ] No image with a fixed pixel width that exceeds the mobile viewport

---

## Design Viewport Baseline

Treat the Figma frame width as the primary target viewport for visual matching.

For a desktop frame around `1440px`:
- the intended desktop value should already be active at that viewport
- smaller viewports should scale down from that value
- larger breakpoint overrides should only be used when the design explicitly changes above the desktop frame

Do not postpone the design-matching desktop value behind an early breakpoint such as:
- `md:text-[8rem]`

If the design should read as `6rem` on the desktop frame itself, then the class that matches that viewport must reflect `6rem` at that viewport. Responsive prefixes should describe true changes around that baseline, not delay the baseline.

Apply this rule to:
- text size
- spacing
- gap
- section sizing
- width and max-width

Additional audit checks:
- [ ] At the same viewport width as the Figma frame, desktop typography already matches the design without requiring an incorrectly larger responsive override
- [ ] No `md:` rule is being used to introduce the primary desktop size for a design whose baseline viewport is much larger than `md`
- [ ] Project breakpoints from `tailwind.config.ts` such as `md-lg`, `al`, `xxl`, and `1xl` are preferred over generic defaults when they map more accurately to the design intent
