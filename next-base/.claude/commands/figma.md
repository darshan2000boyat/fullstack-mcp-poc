# /figma — Figma-to-Code Extractor

Extract a Figma design into a production-ready Next.js + Tailwind component.

**Usage:** `/figma <figma_url> <workspace_path>`

---

## Setup

Parse `$ARGUMENTS`:
- `figma_url` — the Figma share URL (required)
- `workspace_path` — absolute path to the Next.js project root (required — ask if missing)

Read `{workspace_path}/ai-memory.md`. Load these sections into context:
- **Component Inventory** — what components already exist
- **Design Tokens** — CSS variables already defined
- **Icon Inventory** — icons available in public/
- **Session Log** — what was done previously, where we left off
- **Project Overview** — package manager, Next.js version, UI libs

If `ai-memory.md` does not exist, warn the user:
> ⚠️ No ai-memory.md found at `{workspace_path}`. For best results, run `/scan {workspace_path}` first.
> Continuing with limited context — component reuse and token matching may be incomplete.

---

## Execution Pipeline

### Phase 0 — Pre-flight Check

Before calling any MCP tools or reading any skill files, run these two checks:

**1. Duplicate extraction check**
Search the `## Session Log` in `ai-memory.md` for any entry where `**Figma:**` matches `figma_url` (compare the `node-id` param — ignore access tokens or version params).

If a match is found, stop and tell the user:
```
⚠️ This frame was previously extracted.

  Date:    {date from session entry}
  Output:  {component_file_path}
  Status:  {status}
  Notes:   {notes}

How do you want to proceed?
  [1] Re-extract fresh — overwrite the existing component
  [2] Update — re-run extraction and patch only what changed
  [3] Skip — abort and use the existing component as-is
```
Wait for the user's choice before continuing. Do not proceed automatically.

**2. Output file check**
If `ai-memory.md` has no match but the expected output file path already exists on disk (infer from the Figma frame name), warn the user:
```
⚠️ A file already exists at {expected_path}. Proceeding will overwrite it.
   Continue? (yes / no)
```

Only proceed to Phase 1 once both checks are resolved.

---

### Phase 1 — Extract
Read and follow `.claude/skills/figma-extract.md` exactly.
Execute all MCP calls. Build: `design_context`, `token_map`, `component_map`, `icons`.
Save the Figma screenshot to disk as instructed — record the `screenshot_path`.
Do not proceed until all calls have completed, `token_map` is built, and `screenshot_path` is confirmed saved.

### Phase 2 — Resolve Tokens
Read and follow `.claude/skills/figma-tokens.md` exactly.
Cross-reference `token_map` against ai-memory.md Design Tokens and globals.css.
Produce `resolved_token_map`. Add any new tokens to globals.css before writing component code.

### Phase 3 — Build Component
Read and follow `.claude/skills/figma-component.md` exactly.
Also apply rules from:
- `.claude/skills/figma-responsive.md` — layout and breakpoints
- `.claude/skills/figma-a11y.md` — semantic HTML and ARIA

Use `resolved_token_map` for every design value. Reuse components from ai-memory.md inventory.
Write the complete component to the appropriate file path.

### Phase 4 — Verify
Read and follow `.claude/skills/figma-verify.md` exactly.
Pass `screenshot_path` from Phase 1 into Check 7 (Visual Design Review).
Run all 7 checks. Apply all auto-fixes. Report all warnings.
Output the final verification summary.

### Phase 5 — Update Memory
Append the following entry to the `## Session Log` section in `{workspace_path}/ai-memory.md`.
Insert at the TOP of the section (most recent first):

```markdown
### {YYYY-MM-DD HH:MM} — {figma_frame_name}
**Status:** done
**Figma:** {figma_url}
**Output:** `{component_file_path}`
**Tokens added:** {comma-separated list of new CSS vars, or "none"}
**Components reused:** {comma-separated list, or "none"}
**Icons missing:** {comma-separated list, or "none — all resolved"}
**Screenshot:** `.figma/screenshots/{file_id}/{node_id}--{frame_name}.png`
**Visual match:** {excellent | good | needs-attention}
**Notes:** {anything notable — warnings, manual steps needed, decisions made}
```

If any new tokens were added to globals.css, also update the `## Design Tokens` table in ai-memory.md.

---

## Final Output to User

Present in this order:
1. **Component code** — complete, ready to use
2. **New tokens** — any CSS variables added to globals.css (show the additions)
3. **Missing icons** — list with TODO locations in the code
4. **Verification summary** — what was fixed, what needs manual attention
5. **Session logged** — confirm ai-memory.md was updated
