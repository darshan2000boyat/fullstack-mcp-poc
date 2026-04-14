# Skill: figma-tokens

Resolve Figma design tokens to project CSS variables. Run after figma-extract, before component building.

---

## Step 1 — Read globals.css

Locate the globals file (check in order):
1. `{workspace_path}/src/styles/globals.css`
2. `{workspace_path}/src/app/globals.css`
3. `{workspace_path}/app/globals.css`

Read the file. Extract all CSS variables from `@theme {}` and `:root {}` blocks.
Build: `existing_tokens = { "--var-name": "value" }`

Also note the Tailwind version: v4 uses `@theme {}`, v3 uses `tailwind.config.js`.

---

## Step 2 — Map Figma Tokens to Project Tokens

For each Figma token in `token_map` from figma-extract, find its project equivalent:

**Name matching** (normalize Figma slashes to hyphens):
```
figma: "color/primary/500"  →  look for "--color-primary-500" or "--color-primary"
figma: "spacing/4"          →  look for "--spacing-4" or "--space-4"
figma: "radius/md"          →  look for "--radius-md" or "--rounded-md"
figma: "font/size/sm"       →  look for "--font-size-sm" or "--text-sm"
```

**Value matching** (if name doesn't match):
```
figma value: "#3B82F6"  →  find existing token with same resolved hex value
figma value: "16px"     →  find existing spacing token with value "16px" or "1rem"
```

**Semantic matching** (last resort):
```
figma: primary brand color  →  "--color-primary" or "--primary"
figma: background color     →  "--color-background" or "--background"
figma: foreground/text      →  "--color-foreground" or "--foreground"
figma: border color         →  "--color-border" or "--border"
figma: muted/subtle text    →  "--color-muted-foreground" or "--muted-foreground"
```

---

## Step 3 — Add Missing Tokens

For each token with NO match in existing_tokens:

1. Verify it's genuinely new (not a duplicate value already covered)
2. Determine the correct CSS variable name using project naming convention
3. Add to `globals.css` inside `@theme {}` block:
   ```css
   --{normalized-name}: {value};
   ```
4. Record in `tokens_added = { "--new-token": "value" }` for the session log
5. **NEVER** define the same semantic token twice
6. **NEVER** hardcode the raw value in JSX — always reference the CSS variable

---

## Step 4 — Build Final Token Map

Produce the complete resolved mapping:
```
resolved_token_map = {
  "figma/color/primary":    "--color-primary",       // existing
  "figma/spacing/4":        "--spacing-4",            // existing
  "figma/color/accent/500": "--color-accent",         // new — added to globals.css
}
```

This map is used in Phase 3 (component building). Every Tailwind class that uses a design value MUST come from this map.

---

## Tailwind v4 Patterns

| Design value | Correct class |
|-------------|---------------|
| Primary color | `bg-primary`, `text-primary`, `border-primary` |
| Foreground text | `text-foreground` |
| Muted text | `text-muted-foreground` |
| Background | `bg-background` |
| Card bg | `bg-card` |
| Border | `border-border` |
| Gradient | `bg-linear-to-b from-x to-y` (NOT `bg-gradient-to-b`) |
| Shadow token | `shadow-{token-name}` |

---

## Forbidden Patterns

```
❌  style={{ color: "#3B82F6" }}
❌  className="text-[#3B82F6]"
❌  className="p-[12px]"
❌  className="w-[320px]"
❌  var(--color-primary, #3B82F6)     ← no fallback values allowed
❌  @apply text-[14px]

✅  className="text-primary"
✅  className="p-3"
✅  className="w-80"
✅  var(--color-primary)
```
