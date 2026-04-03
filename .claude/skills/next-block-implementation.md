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
- read `next-base/ai-memory.md` if present
- read `next-base/tailwind.config.ts`
- read `next-base/.claude/skills/figma-component.md`
- read `next-base/.claude/skills/figma-responsive.md`
- read `next-base/.claude/skills/figma-a11y.md`

Reuse the existing project style and block conventions.

---

## Target Files

- `next-base/src/components/blocks/<ComponentName>.tsx`
- `next-base/src/components/blocks/FullBlockRenderer.tsx`
- `next-base/src/typings/blocks.d.ts` when a new explicit block type is needed

---

## Implementation Steps

### Step 1 - Generate Or Patch Component

Create a React component that:
- accepts the block contract from Strapi
- renders the design faithfully
- uses Tailwind config primitives and existing local patterns first
- reuses existing elements/components whenever possible

Do not generate a brand-new design system.

### Step 1a - Tailwind Config First

Before writing class names, inspect `next-base/tailwind.config.ts` and prefer project-defined primitives in this order:

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

### Step 2 - Respect Existing Typing

If the repo uses explicit block interfaces in `src/typings/blocks.d.ts`:
- add or patch the relevant type

If an existing generic dynamic-zone shape is enough:
- do not add unnecessary typings noise

### Step 3 - Register Renderer Mapping

Update:
- `next-base/src/components/blocks/FullBlockRenderer.tsx`

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
- Treat `next-base/tailwind.config.ts` as the primary styling contract for generated blocks.
- Treat the Figma frame width as the baseline viewport for visual matching. If the design is a 1440px desktop frame, the intended desktop sizes should already be active at that viewport instead of being delayed behind `md:` or another too-small breakpoint.
- Do not generate classes like `md:text-[8rem]` when the design should be `6rem` on the same 1440px desktop viewport. The matching desktop size must be the active class at that viewport, with responsive prefixes reserved for real deviations above or below it.
- Never overwrite a mature block wholesale if a small patch will do.
