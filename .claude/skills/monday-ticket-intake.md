# Skill: monday-ticket-intake

Fetch and normalize a Monday ticket before code generation.

## Inputs

- `monday_ticket_url`

---

## Execution

### Step 1 - Fetch Ticket

Use Monday MCP to fetch the item referenced by `monday_ticket_url`.

Extract at minimum:
- `ticket_id`
- `board_id`
- `title`
- `description`
- `status`
- `assignee`
- `updates`
- `column_values`
- any linked docs or attachments

### Step 2 - Extract Figma URL

Search these sources in order:
1. explicit Figma column/custom field
2. ticket description
3. ticket updates/comments
4. linked docs or mirrored text blobs

Pick the first valid `https://www.figma.com/...` URL.

If multiple Figma URLs exist:
- prefer the one most clearly tied to the requested implementation
- if ambiguous, stop and ask the user which frame or page to use

### Step 3 - Infer Scope

Infer `scope` from the ticket text.

Map to one of:
- `block`
- `screen`

Use these heuristics:
- `screen` if the ticket mentions page, screen, full page, layout, or multiple sections
- `block` if the ticket mentions section, block, hero, card, CTA, banner, or one reusable component

### Step 4 - Build Working Summary

Produce a normalized ticket summary object:

```ts
{
  ticketId: string
  title: string
  figmaUrl: string
  scope: "block" | "screen"
  summary: string
  notes: string[]
}
```

This summary becomes the source of truth for the rest of the flow.

---

## Rules

- Do not start generation until `figmaUrl` is confirmed.
- Keep the normalized summary concise and implementation-focused.
- If the ticket text conflicts with the Figma design, prefer the ticket for scope and prefer Figma for visuals.
