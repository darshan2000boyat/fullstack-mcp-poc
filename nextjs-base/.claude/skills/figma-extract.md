# Skill: figma-extract

MCP extraction sequence for Figma frames. Finish extraction before writing code.

---

## Inputs

- `desktop_figma_url`
- optional `mobile_figma_url`

When both are present:
- treat the mobile frame as the base-layout source
- treat the desktop frame as the large-screen source

When only desktop is present:
- still collect enough detail to infer a mobile-first implementation

---

## MCP Call Sequence

### Call 1 - Structure

Run:
```text
get_design_context(node_url: figma_url)
```

Do this for each provided Figma URL.

Capture:
- hierarchy
- naming
- component grouping
- explicit dimensions
- relative alignment
- whether the design appears auto-layout or manually positioned
- whether repeated cards overflow the frame

If truncated, fetch metadata and recurse by child node.

### Calls 2 and 3 - Tokens and Screenshot

Run after structure:
```text
get_variable_defs(node_url: figma_url)
get_screenshot(node_url: figma_url)
```

Do this for each provided Figma URL.

Use screenshots to confirm:
- visual grouping
- text content
- icon orientation
- overlap and layering
- carousel cues such as cut-off cards at the frame edge

### Call 4 - Component Map

If the project has a meaningful component inventory:
```text
get_code_connect_map(node_url: figma_url)
```

Use it only for reuse decisions.

---

## Output Requirements

Build an extraction summary that includes:
- `desktop_design_context`
- optional `mobile_design_context`
- token maps
- screenshot paths
- reusable component candidates
- inferred layout mode: `auto-layout` or `manual-positioned`
- carousel candidates

---

## Interpretation Rules

- structure is the primary source of truth
- screenshot resolves ambiguity, not hierarchy
- if the frame is manually positioned, preserve that signal for component generation
- if repeated items overflow horizontally, flag the section as `carousel_candidate`
- if only desktop exists, note which mobile behaviors must be inferred later

---

## Screenshot Storage

Save each screenshot to:
```text
{workspace_path}/.figma/screenshots/{file_id}/{node_id}--{frame_name}.png
```

Record both mobile and desktop screenshot paths when both exist.
