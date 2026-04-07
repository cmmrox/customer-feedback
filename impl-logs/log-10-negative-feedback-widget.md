# Log 10 — Dashboard Negative Feedback Widget

## What was implemented
- Added a new protected admin API endpoint: `GET /api/admin/dashboard/negative-feedback`
- Added dashboard backend service under `src/lib/admin-dashboard/negative-feedback.ts`
- Implemented paginated retrieval of only `NOT_SATISFIED` feedback records
- Reused existing `Feedback.timestamp` field for exact submission time visibility
- Included dissatisfaction reason labels for each negative feedback item
- Added a new **Recent Negative Feedback** widget to the admin dashboard
- Widget shows:
  - submission date
  - exact submission time
  - dissatisfaction reason badges
  - pagination with 10 records per page
- Added loading, empty, and error states for the widget

## Key decisions
- No Prisma schema change was needed because `Feedback.timestamp` already captures the required time
- The widget was placed prominently on the dashboard below the summary cards for fast operational visibility
- Pagination kept intentionally simple with Previous/Next controls

## Validation
- `npx tsc --noEmit` ✅
- `npm run build` ✅

## Notes
- Existing unrelated build warning remains in `src/app/admin/staff/page.tsx` about `<img>` usage
- Current widget focuses on time + reasons only; staff/branch/kiosk context can be added later if the data model expands
