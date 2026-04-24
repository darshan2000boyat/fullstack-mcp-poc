# Skill: figma-verify

Validate generated Next.js blocks before delivery.

---

## Verification Goals

- pixel-accurate visual match
- correct mobile-first behavior
- robust data-driven rendering
- intentional carousel behavior when required
- no accidental simplification of non-auto-layout designs

---

## Check 1 - Asset And Import Safety

- verify all imports resolve
- verify image and icon assets exist
- verify tokens referenced in code actually exist
- replace missing decorative assets with explicit TODO placeholders only when unavoidable

---

## Check 2 - Contract Safety

- confirm the component consumes the Strapi payload shape exactly
- confirm optional fields fail safely
- confirm repeatable nested components render with stable keys
- confirm `block.Common` does not break rendering

---

## Check 3 - Layout Fidelity

Review the generated block against the saved screenshot.

Validate:
- spacing rhythm
- horizontal and vertical alignment
- typography scale
- container widths
- image aspect ratios
- layering and overlap
- card widths and gaps
- border radii and shadows

Do not auto-normalize exact values away if those values are preserving the design.

---

## Check 4 - Mobile-First Behavior

- base classes represent the mobile layout
- if a mobile Figma was provided, mobile matches that frame
- if mobile was inferred, the component still reads as intentionally designed
- desktop styles are layered on top at the correct breakpoints
- no horizontal scroll appears unintentionally

---

## Check 5 - Non-Auto-Layout Integrity

If the extracted design was manually positioned:
- verify key anchors remain in place
- verify overlap and absolute positioning are intentional
- verify refactors did not flatten a layered composition into a generic stack

---

## Check 6 - Carousel Integrity

If the design was flagged as a carousel candidate:
- confirm an Embla carousel pattern is used
- confirm the block does not rely on accidental overflow
- confirm visible partial slides, gaps, and slide widths match Figma
- confirm any progress bar, scrubber, or slider-progress indicator from Figma is implemented and synced to the active slide
- confirm touch, keyboard, and button navigation behavior are wired correctly when controls exist

---

## Check 7 - Accessibility And Interaction

- semantics are correct
- focus-visible states exist
- icon-only controls have labels
- links and buttons have correct roles
- touch targets remain usable on mobile

---

## Final Report Format

```text
Verification complete - {component_file_path}
Visual match: {excellent | good | needs-attention}
Mobile source: {provided | inferred}
Carousel: {yes | no}
Warnings: {list or none}
Design review comments: {list or none}
```
