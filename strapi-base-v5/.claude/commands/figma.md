# /figma - Figma to Strapi block

Usage: `/figma <figma_url> <workspace_path>`

## Goal

Generate or patch a reusable Strapi block with minimal token usage and no redundant schemas.

## Read Only What Is Needed

Inspect, in order, and stop once reuse is clear:
1. likely matching files in `src/components/blocks/`
2. likely matching files in `src/components/elements/`
3. `src/components/elements/common.json`
4. `src/api/sitemap/content-types/sitemap/schema.json`
5. `config/sitemap-components.ts`

Do not scan unrelated schemas.

## Flow

1. Run `.claude/skills/figma-extract.md`
2. Run `.claude/skills/figma-component.md`
3. Run `.claude/skills/figma-verify.md`

## Hard Rules

- Prefer reuse over new schema creation
- Every created or patched block must include `Common` using `elements.common`
- Repeated items should become reusable repeatable elements
- Every block must be registered in sitemap dynamic zone
- Every block must update `config/sitemap-components.ts`
- Never use `populate: "*"`

## Final Report

- reuse decision
- block UID
- element UIDs created or reused
- sitemap schema updated: yes or no
- sitemap populate updated: yes or no
