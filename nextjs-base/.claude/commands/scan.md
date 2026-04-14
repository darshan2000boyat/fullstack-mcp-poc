# /scan — Project Scanner

Scan a Next.js project and create or update `ai-memory.md` with full project context.
Run this before your first `/figma` extraction, and again after major structural changes.

**Usage:** `/scan <workspace_path>`

---

## Setup

Get `workspace_path` from `$ARGUMENTS`.
If not provided, ask: "What is the absolute path to your project? (e.g. /Users/josh/projects/my-app)"

Verify the path exists by reading `{workspace_path}/package.json`.
If it doesn't exist, tell the user the path seems incorrect and ask them to confirm.

---

## Execution

Read and follow `.claude/skills/project-scan.md` exactly, using the provided `workspace_path`.

Complete all 9 steps:
1. Read package.json — project name, versions, package manager
2. Map file structure — 2-level directory tree
3. Inventory components — name, path, purpose
4. Inventory custom hooks — name, path, purpose
5. Extract design tokens — CSS variables from globals.css
6. Inventory icons — files in public/icon/ and public/other/
7. Detect layout fonts — from layout.tsx
8. Preserve existing memory — save Session Log and Notes sections
9. Write ai-memory.md — complete file at `{workspace_path}/ai-memory.md`

---

## Output to User

After writing the file, show this summary:

```
✅ Scan complete — ai-memory.md written to {workspace_path}/ai-memory.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Project:     {name}
Framework:   Next.js {version} — App Router
Tailwind:    v{version}
Package mgr: {bun|npm|yarn|pnpm}

Components:  {n} found
Hooks:       {n} found
Tokens:      {n} CSS variables
Icons:       {n} files across {n} directories
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ready. Run `/figma <url> {workspace_path}` to extract your first design.
```
