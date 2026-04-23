# CLAUDE.md

This file provides guidance to coding agents and contributors working with code in this repository.

## Project Overview

This repository contains a **Next.js-based Customer Feedback System** with:
- a customer-facing kiosk flow
- an authenticated admin dashboard for reporting and staff management
- Prisma + MySQL persistence
- NextAuth.js credential-based authentication
- runtime-served uploaded staff images

This document is aligned to the **current implementation**.

## Essential Commands

### Development
```bash
npm run dev              # Start dev server with Turbopack
npm run build            # Production build (always run to verify no errors)
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run test:staff       # Helper-level smoke tests for staff validation/storage
```

### Database operations
```bash
npx prisma generate       # Generate Prisma client after schema changes
npx prisma migrate dev    # Create and apply migrations in development
npx prisma migrate deploy # Apply migrations in production
npm run prisma:seed       # Seed database with initial data
npx prisma migrate reset  # Reset database (wipe all data, reapply migrations, and reseed)
npx prisma studio         # Open Prisma Studio at localhost:5555
```

### Docker operations
```bash
# Database container
docker-compose -f docker-compose-database.yml up -d
docker-compose -f docker-compose-database.yml logs -f

# Application container
docker-compose -f docker-compose-app.yml up -d
docker-compose -f docker-compose-app.yml exec app npx prisma migrate deploy
docker-compose -f docker-compose-app.yml exec app npm run prisma:seed
```

---

## Current Architecture

### 1. Customer portal
Implemented flow:
- home screen with **Good** / **Bad** selection
- feedback record creation via `POST /api/feedback`
- positive branch to staff selection
- negative branch to dissatisfaction reason selection
- thank-you page
- 10-second inactivity timeout on follow-up kiosk pages

### 2. Admin portal
Implemented flow:
- credentials login
- protected `/admin` routes
- dashboard analytics and charts
- export of monthly staff-selection report to Excel and PDF
- staff management CRUD UI and APIs
- image crop + persisted upload flow for staff profile images

Not implemented yet:
- reason/category management screens
- config/settings management UI
- password reset

---

## Current Database Design

The current schema includes:
- `User`
- `Staff`
- `Feedback`
- `FeedbackStaff`
- `Category`
- `DissatisfactionReason`
- `FeedbackReason`
- `SystemConfig`

Key relationship notes:
- customer journeys always start with a `Feedback` row
- positive flow stores follow-up selection in `FeedbackStaff`
- negative flow stores follow-up selection in `FeedbackReason`
- `comments` exists on `Feedback` but is not yet wired to the UI

---

## Authentication Flow

- Uses NextAuth.js with credentials provider
- JWT-based sessions (30-day expiration)
- bcrypt password hashing
- custom pages: `/admin/login` and `/admin/error`
- middleware protection for `/admin/:path*`
- admin access is based on `ADMIN` / `SUPER_ADMIN` role values

---

## Inactivity Timeout

The current kiosk implementation uses a 10-second inactivity timer on:
- `src/app/rate-staff/page.tsx`
- `src/app/dissatisfaction-reasons/page.tsx`
- `src/app/thank-you/page.tsx`

Behavior:
- timer resets on user activity
- timeout redirects back to `/`

Note: timeout behavior is currently hardcoded in the UI; it is not dynamically read from `SystemConfig`.

---

## Uploaded Staff Images

Current behavior:
- uploads are stored in runtime storage (`uploads/staff` or `/app/uploads/staff` in Docker)
- the app serves uploaded images through:
  - `GET /api/uploads/staff/[filename]`
- this avoids production issues caused by writing new files into `public/` at runtime

---

## Important Files

### Configuration and schema
- `prisma/schema.prisma` — source of truth for the database schema
- `src/lib/db.ts` — shared Prisma client
- `src/lib/auth.ts` — NextAuth configuration
- `src/lib/file-storage.ts` — runtime upload save/read/remove helpers

### Customer routes
- `src/app/page.tsx` — home screen and initial feedback creation
- `src/app/rate-staff/page.tsx` — positive feedback follow-up
- `src/app/dissatisfaction-reasons/page.tsx` — negative feedback follow-up
- `src/app/thank-you/page.tsx` — thank-you screen

### Admin routes
- `src/app/admin/login/page.tsx`
- `src/app/admin/login/login-form.tsx`
- `src/app/admin/dashboard/page.tsx`
- `src/app/admin/error/page.tsx`
- `src/app/admin/staff/page.tsx`

### Key API routes
- `src/app/api/feedback/route.ts`
- `src/app/api/feedback-staff/route.ts`
- `src/app/api/feedback-dissatisfaction/route.ts`
- `src/app/api/staff/route.ts`
- `src/app/api/dissatisfaction-reasons/route.ts`
- `src/app/api/admin/staff/route.ts`
- `src/app/api/admin/staff/[id]/route.ts`
- `src/app/api/admin/staff/image/route.ts`
- `src/app/api/uploads/staff/[filename]/route.ts`
- reporting routes under `src/app/api/*`

---

## Coding Notes

### Database access
Preferred pattern:
```typescript
import { prisma } from "@/lib/db";
```

Note: most routes follow this pattern, but `src/app/api/staff/route.ts` currently instantiates `PrismaClient` directly. Keep that in mind when refactoring.

### API route conventions
Current routes generally follow this pattern:
- validate inputs when needed
- use try/catch around async operations
- return JSON responses with appropriate HTTP status codes

### Reporting behavior
Current reporting is based on:
- month-based `Feedback` filtering
- grouping and joining through `FeedbackStaff` / `FeedbackReason`
- dashboard visualisation via Recharts
- export of staff selection data via ExcelJS and jsPDF

---

## Current Known Gaps

- no settings/config UI
- no customer comments flow
- no multi-select dissatisfaction reason UI
- no password reset flow
- no meaningful use of `GET /api/ratings`
- no broad end-to-end test coverage yet

---

## Validation Expectations After Changes

After making changes, contributors should ideally:
1. run `npm run build`
2. run `npm run test:staff` for staff/upload-related changes
3. test the customer flow
4. test admin login, dashboard loading, and staff management flows
5. verify Prisma migrations and seed behavior when schema/data changes are involved
6. keep `README.md`, `PRD.md`, `ERD.md`, and `TASKS.md` in sync with implementation changes
