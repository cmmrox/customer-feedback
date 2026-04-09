# PROGRESS.md

## Staff Management — Real Implementation

- ✅ Done — Stage 00: Admin staff UI preview built
- ✅ Done — Stage 00.1: Inline image crop editor added
- ✅ Done — Stage 00.2: Crop ratio aligned to frontend staff card image area

- ✅ Done — Stage 01: Planning scaffold and current-state documentation
  - plan-01-staff-management-real-implementation.md created in impl-plans/
  - impl-logs/ initialized
  - Current project state reviewed against schema and existing APIs

- ✅ Done — Stage 02: Real admin staff backend contract
  - Admin CRUD routes added under /api/admin/staff
  - Zod validation layer added
  - Server-side admin auth guard added
  - Safe delete/deactivate behavior implemented at API layer

- ✅ Done — Stage 03: Real staff list integration in admin UI
  - Hardcoded initialStaff removed
  - Admin page now loads and mutates live data via admin APIs
  - Real create, edit, and safe delete/deactivate flows wired
  - Loading, empty, refresh, and error states added

- ✅ Done — Stage 04: Real image upload and storage
  - Added backend image upload endpoint under /api/admin/staff/image
  - Added file storage helper for persisted staff image files under public/uploads/staff
  - Cropped image payloads now save as real reusable URLs

- ✅ Done — Stage 05: Connect cropper save to backend
  - Cropper save now uploads cropped output to backend storage
  - Admin form stores real image URLs instead of temporary client-only data

- ✅ Done — Stage 06: Safe delete / deactivate behavior
  - Staff with feedback history are deactivated instead of permanently deleted
  - Uploaded image files are cleaned up on permanent delete when possible

- ✅ Done — Stage 07: Validation, authorization, and UX hardening
  - Admin route auth enforcement added
  - Validation errors and load/save failure states surfaced in UI
  - Submission and deletion guard states added

- ✅ Done — Stage 08: Testing
  - Added helper-level smoke tests for validation and file storage
  - Verified with npm run test:staff, npx tsc --noEmit, and npm run build

- 🔄 In Progress — Stage 09: Documentation and operational polish
  - Current step: implementation log created; README/env/docs cleanup still pending

- ✅ Done — Stage 10: Dashboard negative feedback widget
  - Added protected paginated admin API for recent negative feedback
  - Added dashboard widget showing date, exact time, and dissatisfaction reasons
  - Added Previous/Next pagination with 10 records per page
  - Verified with npx tsc --noEmit and npm run build
