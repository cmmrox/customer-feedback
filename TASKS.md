# Implementation Status and Forward Task List

This document reflects the **current implementation status** of the project.

## 1. Implemented

### 1.1 Project foundation
- [x] Next.js project set up with TypeScript
- [x] ESLint and Prettier configuration added
- [x] App Router project structure established
- [x] Tailwind CSS integrated
- [x] Prisma ORM configured
- [x] MySQL integration configured
- [x] Docker support added
- [x] environment-based configuration files added

### 1.2 Database and data model
- [x] Prisma schema created for users, staff, feedback, dissatisfaction reasons, categories, junction tables, and system config
- [x] Prisma migrations added to the repository
- [x] Prisma seed script created
- [x] seed data includes admin user, staff, categories, dissatisfaction reasons, and system config values

### 1.3 Authentication
- [x] NextAuth credentials provider implemented
- [x] JWT-based session strategy configured
- [x] admin login page implemented
- [x] admin route protection via middleware implemented
- [x] auth error page implemented

### 1.4 Customer kiosk flow
- [x] home page implemented with Good/Bad selection
- [x] feedback creation endpoint implemented
- [x] positive flow to staff selection implemented
- [x] negative flow to dissatisfaction reason selection implemented
- [x] thank-you page implemented
- [x] inactivity timeout reset behavior implemented on customer-facing follow-up pages
- [x] active staff loading API implemented
- [x] active dissatisfaction reason loading API implemented

### 1.5 Admin portal and reporting
- [x] admin dashboard layout implemented
- [x] monthly Good count implemented
- [x] monthly Bad count implemented
- [x] monthly staff selection table implemented
- [x] staff comparison chart implemented
- [x] staff selection trends chart implemented
- [x] dissatisfaction pie chart implemented
- [x] dissatisfaction trends chart implemented
- [x] recurring issues comparison table implemented
- [x] recent negative feedback widget implemented
- [x] Excel export for staff selection report implemented
- [x] PDF export for staff selection report implemented

### 1.6 Staff management
- [x] staff management CRUD screens implemented
- [x] admin staff CRUD APIs implemented
- [x] inline cropper flow implemented
- [x] persisted staff image upload implemented
- [x] uploaded image serving implemented through `/api/uploads/staff/[filename]`
- [x] safe delete/deactivate behavior implemented

### 1.7 Delivery and operations
- [x] Docker image build support implemented
- [x] pull-based Docker deployment implemented
- [x] runtime uploads volume implemented
- [x] MIT license added

---

## 2. Partially Implemented / Present but Limited

- [~] `SystemConfig` model exists, but configuration values are not fully wired into runtime behavior
- [~] `Feedback.comments` exists in schema, but there is no UI/API path currently using it in the customer flow
- [~] `FeedbackStaff` and `FeedbackReason` junction tables allow scalable association patterns, but the current UI uses a single follow-up selection path
- [~] automated tests exist for helper-level smoke coverage, but end-to-end and broader API coverage are still limited
- [~] `GET /api/ratings` exists as a legacy placeholder and is not part of the active feature set

---

## 3. Not Yet Implemented

### 3.1 Admin management capabilities
- [ ] dissatisfaction reason management screens
- [ ] category management screens
- [ ] system configuration management UI
- [ ] admin profile management
- [ ] admin activity logging
- [ ] admin user management

### 3.2 Customer flow enhancements
- [ ] multi-select dissatisfaction reasons
- [ ] optional customer comments
- [ ] configurable timeout driven directly from stored system settings
- [ ] richer customer flow transitions/animations

### 3.3 Platform and operational improvements
- [ ] API test coverage
- [ ] CI pipeline
- [ ] health checks
- [ ] monitoring/logging improvements
- [ ] security hardening review
- [ ] deployment automation

---

## 4. Recommended Next Priorities

### Priority 1
- [ ] implement dissatisfaction reason/category management UI and APIs
- [ ] wire `SystemConfig` into runtime behavior where intended
- [ ] improve end-to-end and API-level automated tests

### Priority 2
- [ ] add customer comments support end-to-end
- [ ] decide whether negative feedback should remain single-select or become multi-select
- [ ] improve production observability and health checks

### Priority 3
- [ ] improve deployment automation
- [ ] remove or formalize legacy placeholder endpoints
- [ ] add contribution guide and PR template if open-source collaboration expands

---

## 5. Notes

- This file intentionally reflects **what is true in the code today**.
- If the product direction changes later, update this file together with `README.md`, `PRD.md`, and `ERD.md` so the repository stays internally consistent.
