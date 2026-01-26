# Project Instructions — Itinerary Feature

## OUTPUT RULES (token-saving)
- Never print full code, large snippets, or diffs.
- After applying changes, output ONLY:
  1) Files touched (paths only)
  2) Summary of what changed (max 10 bullets)
  3) TODOs / assumptions (max 5 bullets)
- If code is absolutely necessary, show at most 30 lines total.

## UI CONTRACT (must follow)
- Visual style: “Pinterest-like” (rounded cards, soft shadows, whitespace, friendly chips).
- Tech/UI: Tailwind CSS v4 + @ark-ui/react (Tabs/Drawer/Dialog/Menu) + lucide-react icons.
- Spacing: base 16px; card padding 16; card gap 12; section gap 24.
- Cards: radius-xl; subtle shadow; add borders only in dark mode.
- Typography: Nunito for headings, Open Sans for body. Labels in PT-BR.
- City color usage: ONLY as small left border (2–4px) + a small city chip. No full background coloring.
- Day View:
  - Tabs fixed: Manhã / Tarde / Noite
  - Card layout: icon + title + meta row (timeLabel, duration, cost) + actions row (priority/status/copy/amap/menu)
- Grid View:
  - Columns = days; 3 stacked sections (Manhã/Tarde/Noite); compact cards; same hierarchy.
- Do not introduce new visual patterns beyond this contract without asking.

## Feature rules (Itinerary)
- Offline-first, localStorage-based.
- Segments are fixed (morning/afternoon/evening).
- Multiple cities and multiple stays in the same day are supported (city/hotel are per item, not day header).
- Support dayTrip blocks that cover segments (primarySegment + coversSegments) with ghost indicators in covered segments.
- Status: planned/done/skipped. Priority: 0/1/2.
- Undo stack: 10 steps.
- Sharing: Export/Import JSON file (schemaVersion + migrations).

## Testing
- Use Playwright for E2E.
- Prefer data-testid selectors for stability.
