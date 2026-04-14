# Skill: figma-extract

Extract the backend-relevant structure from Figma before modeling Strapi schemas.

---

## Focus Areas

From the Figma frame, identify:
- overall block purpose
- repeated item groups
- CTAs and links
- media usage
- optional vs required content groups
- likely reusable child components

The goal is not to mirror styling. The goal is to model content structure cleanly.

---

## MCP Sequence

Run:
```text
get_design_context(node_url: figma_url)
get_variable_defs(node_url: figma_url)
get_screenshot(node_url: figma_url)
```

Use:
- design context for hierarchy and repetition
- screenshot for naming clarification and repeated-item confirmation
- variables only as supporting context when they reveal semantic grouping

---

## Extraction Output

Summarize:
- candidate block name
- candidate repeated element groups
- media fields required
- link or button groups required
- possible reuse matches from current Strapi components

Flag these explicitly if detected:
- repeated cards
- repeated stats
- hero media
- CTA clusters
- nested list items

This extraction summary feeds schema modeling and sitemap populate generation.
