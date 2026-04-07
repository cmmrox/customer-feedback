# Plan 01 — Staff Management Real Implementation

## Objective
Replace the current admin staff management mock/hardcoded implementation with full backend-backed CRUD, real image persistence, validation, and safe staff lifecycle handling while preserving the approved UI and cropper experience.

## Current State Summary
- Public `/rate-staff` already reads from a real API backed by Prisma/MySQL.
- Prisma schema already includes a real `Staff` model and `FeedbackStaff` relation.
- Admin `/admin/staff` still uses hardcoded `initialStaff` and client-only mutations.
- Image cropping UI exists, but image persistence is still client-only.
- No project planning/progress files existed yet.

## Architecture Direction
- Keep public `/api/staff` for active staff only.
- Introduce admin-specific staff CRUD endpoints under `/api/admin/staff`.
- Add validation layer with Zod.
- Add file storage helper for persisted cropped images.
- Keep admin cropper UX, but save cropped output to real storage and DB.
- Preserve feedback history by preferring deactivate over unsafe hard delete.

## Data Model
Existing `Staff` model already supports the feature:
- `id`
- `name`
- `imageUrl`
- `position`
- `contactInfo`
- `status`
- `createdAt`
- `updatedAt`

Optional future enhancement:
- `imageUpdatedAt DateTime?` for cache busting/versioning.

## API Plan
### Public
- `GET /api/staff`
  - Active staff only
  - Used by customer rating flow

### Admin
- `GET /api/admin/staff`
  - Full staff list for admin UI
- `POST /api/admin/staff`
  - Create staff member
- `PUT /api/admin/staff/[id]`
  - Update staff member
- `DELETE /api/admin/staff/[id]`
  - Delete when safe, otherwise deactivate
- `POST /api/admin/staff/[id]/image`
  - Save cropped image and return persisted URL

## File/Module Plan
### New
- `src/app/api/admin/staff/route.ts`
- `src/app/api/admin/staff/[id]/route.ts`
- `src/app/api/admin/staff/[id]/image/route.ts`
- `src/lib/staff-validation.ts`
- `src/lib/staff-service.ts`
- `src/lib/file-storage.ts`
- supporting tests

### Existing to Update
- `src/app/admin/staff/page.tsx`
- possibly `src/app/api/staff/route.ts` to share service logic cleanly
- README / docs as needed

## Logging Approach
Add concise logs for:
- create/update/delete/deactivate attempts
- image upload success/failure
- validation failures
- admin route auth failures

Avoid noisy logs and raw image payloads.

## Testing Plan
- Validation unit tests
- API tests for CRUD/image upload rules
- UI smoke path for create/edit/delete/upload flows
- Build/type checks

## Stage Breakdown
### Stage 01 — Planning scaffold and current-state documentation
- Create `PROGRESS.md`, `impl-plans/`, `impl-logs/`
- Save approved plan
- Confirm current state and execution order

### Stage 02 — Real admin staff backend contract
- Add admin CRUD endpoints
- Add request/response validation
- Add auth checks

### Stage 03 — Real staff list integration in admin UI
- Remove `initialStaff`
- Load from backend
- Wire create/update/delete flows
- Add loading/error states

### Stage 04 — Real image upload and storage
- Persist cropped output to file storage
- Return stable image URL

### Stage 05 — Connect cropper save to backend
- Replace client-only image save with persisted upload
- Keep approved editor UX

### Stage 06 — Safe delete / deactivate behavior
- Protect historical feedback records
- Deactivate if hard delete is unsafe

### Stage 07 — Validation, authorization, and UX hardening
- Inline/server error handling
- submission guards
- auth enforcement

### Stage 08 — Testing
- API + validation + smoke coverage

### Stage 09 — Documentation and operational polish
- README updates
- implementation logs
- progress finalization

## Execution Order
1. Planning scaffold
2. Admin CRUD APIs
3. Admin UI integration
4. Image storage endpoint
5. Cropper backend integration
6. Safe delete/deactivate
7. Tests
8. Docs/logs
