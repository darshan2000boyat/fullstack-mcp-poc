# Skill: qa-ui-validator

Validate UI test cases from a Monday QA board using browser automation (Playwright MCP) and optionally Figma for design comparison. Update Development Status on each verified item.

## Trigger

`/qa-ui-validator` followed by a Monday board URL.

---

## Inputs

- `monday_board_url` — e.g. `https://tentwenty.monday.com/boards/18407332607`

---

## Board Column Reference (POC Test Cases Board — 18407332607)

| Column            | ID                   | Relevant Labels                                      |
|-------------------|----------------------|------------------------------------------------------|
| Test Case Type    | `color_mm25c0j1`     | UI = `2`                                             |
| Development Status| `color_mm25vbp7`     | Done = `0`, In progress = `4`, Pending = `5`, Closed-based-on-comments = `1` |
| Status            | `color_mm25bqat`     | Completed = `1`, Failed = `2`, In Progress = `0`, Not Started = `5` |
| Procedural Steps  | `long_text_mm25q7k8` | —                                                    |
| Expected Result   | `long_text_mm25hcvh` | —                                                    |
| Notes             | `text_mm25rz9s`      | —                                                    |

> If the board URL differs from the above, call `get_board_info` first to remap column IDs before filtering.

---

## Execution

### Step 1 — Parse Board ID

Extract the numeric board ID from the URL:
```
https://tentwenty.monday.com/boards/<BOARD_ID>
```

### Step 2 — Fetch UI Test Case Items

Call `get_board_items_page` filtering by **Test Case Type = UI** only:

```json
filters: [
  { "columnId": "color_mm25c0j1", "compareValue": [2], "operator": "any_of" }
]
```

Set `includeColumns: true` and `includeItemDescription: true`.

Collect for each item:
- `item_id`
- `name` (test case title)
- `long_text_mm25q7k8` → Procedural Steps
- `long_text_mm25hcvh` → Expected Result
- `text_mm25rz9s` → Notes
- Current `color_mm25vbp7` (Development Status) — skip items already marked **Done**

Paginate with `nextCursor` if `has_more` is true.

---

### Step 3 — For Each Item: Extract URL to Test

Scan these fields in order for a testable URL (http/https):
1. Notes (`text_mm25rz9s`)
2. Procedural Steps (`long_text_mm25q7k8`)
3. Item name (if it mentions a page path)

If no URL is found, mark the item as **Pending** and note "No URL found — manual verification required."

---

### Step 4 — Browser Verification via Playwright MCP

Playwright MCP tool names (`playwright` server):

| Action              | Tool                    | Key params                          |
|---------------------|-------------------------|-------------------------------------|
| Open URL            | `browser_navigate`      | `url`                               |
| Take screenshot     | `browser_screenshot`    | —                                   |
| Run JS in page      | `browser_evaluate`      | `expression`                        |
| Wait for load       | `browser_wait_for_load_state` | `state: "networkidle"`        |

For each item with a URL:

**4a. Navigate**
```
browser_navigate(url: "<extracted_url>")
browser_wait_for_load_state(state: "networkidle")
```

**4b. Screenshot**
```
browser_screenshot()
```
Attach the screenshot to your analysis.

**4c. Evaluate Page Health**
Run these checks via `browser_evaluate`:

```js
// Check 1 — HTTP status / error page
document.title + " | " + (document.querySelector("h1")?.innerText ?? "")

// Check 2 — Content present
document.querySelector("main, [role='main'], #root, #__next, body")?.children?.length > 0

// Check 3 — No error overlays
!document.querySelector(".error-page, .error-boundary, [data-error]")
```

Pass criteria:
- Title is not empty and does not contain "404", "500", "Error", "Not Found"
- Content check returns `true`
- No error overlay detected

**4d. Figma Comparison (optional but preferred)**
If the test case item or its notes contain a Figma URL (`figma.com/...`):
- Call `mcp__claude_ai_Figma__get_design_context` with the Figma URL
- Compare the screenshot against the Figma reference visually
- Note any obvious layout regressions or missing sections

---

### Step 5 — Decide Development Status

Apply this decision logic per item:

| Condition                                        | Set Development Status |
|--------------------------------------------------|------------------------|
| Page loads, no errors, matches expected result   | **Done** (id: `0`)     |
| Page loads but has minor issues or partial match | **In progress** (id: `4`) |
| Page does not load, 4xx/5xx, major breakage      | leave as-is, add note  |
| No URL found                                     | **Pending** (id: `5`)  |

---

### Step 6 — Update Monday Board

For each item where a status change is warranted, call `change_item_column_values`:

```json
{
  "boardId": <board_id>,
  "itemId": <item_id>,
  "columnValues": "{\"color_mm25vbp7\": {\"label\": \"Done\"}}"
}
```

Use the label name string (e.g. `"Done"`, `"In progress"`, `"Pending"`) inside `columnValues`.

If updating Notes to append a verification summary, use column `text_mm25rz9s`.

---

### Step 7 — Summary Report

After processing all items, output a Markdown table:

```
| # | Test Case | URL | Browser Check | Figma Match | Dev Status Set |
|---|-----------|-----|---------------|-------------|----------------|
| 1 | ...       | ... | Pass / Fail   | Yes/No/N/A  | Done           |
```

Conclude with:
- Total items found
- Items marked Done
- Items left Pending (no URL)
- Items with issues (left unchanged)

---

## Rules

- Only process items where **Test Case Type = UI** — do not touch other items.
- Never downgrade an item that is already **Done**.
- If a page fails hard (5xx, DNS error), do not mark Done — flag it to the user.
- Add a one-line verification note to the Notes field for each item processed.
- Keep browser sessions stateless — navigate fresh for each test case URL.
