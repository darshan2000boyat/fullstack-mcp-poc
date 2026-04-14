# /qa-ui-validator - QA UI Test Case Auto-Validator

Validate all UI test cases (Test Case Type = UI) from a Monday QA board using browser automation and Figma design comparison. Automatically updates Development Status on each verified item.

**Usage:** `/qa-ui-validator <monday_board_url>`

---

## Setup

Parse `$ARGUMENTS`:
- `monday_board_url` - full Monday board URL (required), e.g. `https://tentwenty.monday.com/boards/18407332607`

If missing, ask for it.

---

## Pre-flight

Before running:
1. Call `get_board_info` on the board ID to confirm column IDs — use the cached mapping in `.claude/skills/qa-ui-validator.md` if the board matches `18407332607`, otherwise remap.
2. Confirm the `playwright` MCP is available (`browser_navigate` tool must exist). If unavailable, report the blocker and stop.

---

## Execution

Read and follow `.claude/skills/qa-ui-validator.md` in full.

Target items: **Test Case Type = UI** only.

---

## Execution Rules

- Never modify items where Test Case Type is not UI.
- Never downgrade a Development Status that is already Done.
- For each item: navigate → screenshot → evaluate → (optional Figma compare) → update status.
- If the Chrome MCP is unavailable, list the items that would have been tested and stop.
- If a page returns 4xx/5xx or fails to load, do not mark Done — flag it explicitly to the user.
- Append a one-line verification note to each item's Notes field after processing.

---

## Required Final Output

Report:

1. Board name and total UI items found
2. Per-item result table (test case name, URL tested, browser result, Figma match, status set)
3. Items skipped (already Done)
4. Items flagged for manual review (load errors, missing URL)
5. Total items marked Done in this run
