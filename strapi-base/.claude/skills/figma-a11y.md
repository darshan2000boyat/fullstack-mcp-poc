# Skill: figma-a11y

Accessibility rules for Figma-extracted components. Apply during component building.

---

## Semantic HTML Mapping

| Figma element type | HTML element |
|-------------------|--------------|
| Navigation frame | `<nav aria-label="Main navigation">` |
| Top nav bar | `<header>` |
| Page section with heading | `<section aria-labelledby="{heading-id}">` |
| Hero / banner area | `<section>` or `<div role="banner">` |
| Article / blog card | `<article>` |
| Sidebar / aside panel | `<aside aria-label="...">` |
| Toolbar / action bar | `<div role="toolbar" aria-label="...">` |
| Ordered/unordered list | `<ul>` / `<ol>` with `<li>` |
| Form group | `<fieldset>` with `<legend>` |
| Footer | `<footer>` |

**Default to semantic elements.** Only use `<div>` and `<span>` for non-semantic grouping.

---

## Image alt Text Rules

```tsx
// Decorative (icon, divider, bg element) — empty alt + aria-hidden
<img src="/icon/24/star.svg" alt="" aria-hidden width={24} height={24} />

// Informative (conveys meaning) — descriptive alt
<img src={campaign.image} alt={`${campaign.title} campaign cover`} />

// Linked image (the link needs a label) — alt describes destination
<a href="/profile">
  <img src={avatar} alt={`${name}'s profile`} />
</a>

// Complex image (chart, diagram) — alt summarizes OR use aria-describedby
<img src={chart} alt="Monthly revenue chart" aria-describedby="chart-desc" />
<p id="chart-desc" className="sr-only">Revenue increased 32% from Jan to Jun.</p>
```

---

## Button & Interactive Element Rules

```tsx
// Icon-only button — MUST have aria-label
<button
  aria-label="Close dialog"
  className="... focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
>
  <img src="/icon/24/x.svg" alt="" aria-hidden width={24} height={24} />
</button>

// Button with visible text — no aria-label needed
<button className="...">Save changes</button>

// Toggle button — use aria-pressed
<button aria-pressed={isOpen} aria-label="Toggle menu">

// Link that looks like a button — use <Link>, not <button>
<Link href="/checkout" className="btn-primary">Proceed to checkout</Link>
```

---

## Focus Management

All interactive elements need visible focus styles. Standard pattern:

```tsx
className="... focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

Never use `outline: none` or `outline-none` without a focus-visible replacement.

---

## Heading Order

- One `<h1>` per page (usually lives in layout or page.tsx — rarely in a component)
- Components use `<h2>` → `<h3>` → `<h4>` in strict descending order
- Never skip levels: `<h2>` directly to `<h4>` is invalid
- Visually hidden headings: `<h2 className="sr-only">Section name</h2>`

---

## ARIA Quick Reference

| Situation | Solution |
|-----------|----------|
| Loading state | `aria-busy="true"` on container |
| Error message | `role="alert"` or `aria-live="polite"` |
| Required field | `aria-required="true"` on input |
| Expanded/collapsed | `aria-expanded={isOpen}` on trigger |
| Controlled element | `aria-controls="{id}"` on trigger, `id="{id}"` on target |
| Decorative icon | `aria-hidden="true"` |
| Screen-reader only text | `className="sr-only"` |
| Skip link | `<a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>` |

---

## Color & Contrast

- Normal text on background: minimum 4.5:1 contrast ratio (WCAG AA)
- Large text (18px bold or 24px normal): minimum 3:1 ratio
- Interactive element boundaries: minimum 3:1 against adjacent colors
- **Never** convey meaning through color alone — always add text, icon, or pattern
- Check Figma muted/placeholder text carefully — it often fails contrast
