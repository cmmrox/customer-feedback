# Plan 10 — Dashboard Negative Feedback Widget

## Goal
Add a paginated **Recent Negative Feedback** widget to the admin dashboard so administrators can see exactly when negative feedback was submitted and browse older records.

## Stages

- ⏳ Stage 01: Inspect dashboard and data flow
- ⏳ Stage 02: Define backend contract for paginated negative feedback
- ⏳ Stage 03: Implement backend query/service
- ⏳ Stage 04: Add protected admin API endpoint
- ⏳ Stage 05: Build dashboard widget UI
- ⏳ Stage 06: Add pagination states and controls
- ⏳ Stage 07: Integrate widget into dashboard layout
- ⏳ Stage 08: Format timestamps and polish UX states
- ⏳ Stage 09: Validate with typecheck/build and spot tests
- ⏳ Stage 10: Update progress/docs and summarize implementation

## Detailed tasks

### Stage 01 — Inspect dashboard and data flow
- review existing admin dashboard page layout and reusable card patterns
- verify negative feedback persistence model and timestamp field
- confirm dissatisfaction reasons relationships and available fields

### Stage 02 — Define backend contract for paginated negative feedback
- create a typed payload for paginated negative feedback items
- include exact timestamp plus derived date/time display fields when useful
- define page, pageSize, totalItems, totalPages response shape

### Stage 03 — Implement backend query/service
- fetch only `overallRating=NOT_SATISFIED`
- sort newest first by feedback timestamp
- include dissatisfaction reasons and related labels
- support pagination with safe bounds

### Stage 04 — Add protected admin API endpoint
- implement `GET /api/admin/dashboard/negative-feedback`
- validate `page` and `pageSize`
- require admin session
- return typed JSON response and safe errors

### Stage 05 — Build dashboard widget UI
- create widget section in admin dashboard
- show rows with date, time, and dissatisfaction reasons
- add loading, empty, and error states

### Stage 06 — Add pagination states and controls
- default to first 10 results
- add Previous / Next controls
- show page indicator and record count
- disable controls appropriately

### Stage 07 — Integrate widget into dashboard layout
- place widget prominently on dashboard below summary cards
- keep layout responsive and visually aligned with current design

### Stage 08 — Format timestamps and polish UX states
- show a clear, operator-friendly timestamp format
- preserve exact submission time for CCTV/log matching use case
- keep rows compact and readable

### Stage 09 — Validate with typecheck/build and spot tests
- run `npx tsc --noEmit`
- run `npm run build`
- verify route and UI behavior manually where possible

### Stage 10 — Update progress/docs and summarize implementation
- update `PROGRESS.md`
- add implementation log entry under `impl-logs/`
- summarize what changed and any follow-up items
