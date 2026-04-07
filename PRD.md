# Product Requirements Document (Current Implemented System)

## 1. Introduction

### 1.1 Purpose
This document describes the **currently implemented** Customer Feedback System. It is intended to reflect the real working behavior of the application in this repository rather than the earlier broader product vision.

### 1.2 Product Scope
The application currently provides:
- a customer-facing kiosk flow for collecting quick feedback in a retail environment
- an admin reporting dashboard for viewing monthly analytics
- credential-based admin authentication
- export of staff selection reports to PDF and Excel

### 1.3 Out of Scope for the Current Implementation
The following items are not implemented in the current version:
- staff CRUD management screens
- category management screens
- dissatisfaction reason management screens
- branding/settings management screens
- password reset
- customer free-text comment submission
- multi-select dissatisfaction reason submission

---

## 2. Product Overview

### 2.1 Product Vision for the Current Version
Provide a simple touch-friendly kiosk interface that captures high-level customer sentiment and produces usable monthly reporting for administrators.

### 2.2 Target Users
- **Customers:** retail customers using the feedback kiosk
- **Administrators:** users who log in to view dashboard analytics and export reports

---

## 3. Functional Requirements

## 3.1 Customer Kiosk Portal

### 3.1.1 Home Screen
- The customer is presented with a home screen containing:
  - company logo
  - a prompt asking about the visit experience
  - two choices: **Good** and **Bad**
- Selecting either option immediately creates a `Feedback` record.

### 3.1.2 Positive Feedback Flow
- If **Good** is selected:
  - the system creates a `Feedback` record with `overallRating = GOOD`
  - the customer is redirected to the staff selection screen
  - the customer can select **one staff member**
  - the system stores the association in `FeedbackStaff`
  - the user is redirected to the Thank You screen

### 3.1.3 Negative Feedback Flow
- If **Bad** is selected:
  - the system creates a `Feedback` record with `overallRating = NOT_SATISFIED`
  - the customer is redirected to the dissatisfaction reason screen
  - the customer can select **one dissatisfaction reason**
  - the system stores the association in `FeedbackReason`
  - the user is redirected to the Thank You screen

### 3.1.4 Staff Selection Screen
- The staff selection screen displays active staff only.
- Each staff card shows:
  - image
  - name
  - position
- If a staff image is missing or fails to load, a default placeholder image is used.

### 3.1.5 Dissatisfaction Reason Screen
- The dissatisfaction reason screen displays active dissatisfaction reasons.
- Each reason includes its associated category label.
- The current UI supports a **single selected reason** using radio-button style selection.

### 3.1.6 Thank You Screen
- After a successful follow-up selection, the customer is redirected to a Thank You screen.
- The screen shows a confirmation message and branding elements.

### 3.1.7 Inactivity Timeout
- The staff selection screen includes a 10-second inactivity timeout.
- The dissatisfaction reason screen includes a 10-second inactivity timeout.
- The Thank You screen includes a 10-second inactivity timeout.
- Any supported user interaction resets the timer.
- When the timeout is reached, the kiosk returns to the home screen.

---

## 3.2 Admin Portal

### 3.2.1 Authentication
- Admin users authenticate using username and password.
- Authentication is implemented using NextAuth.js with a credentials provider.
- Sessions use JWT strategy.
- Admin routes under `/admin` are protected by middleware.
- Non-authenticated users are redirected to `/admin/login`.

### 3.2.2 Admin Entry Points
- `/admin/login` provides the login form.
- `/admin` redirects users either to `/admin/dashboard` or `/admin/login` depending on auth status.
- `/admin/error` displays authentication-related error messaging.

### 3.2.3 Dashboard Reporting
The admin dashboard currently provides:
- monthly **Good** feedback count
- monthly **Bad** feedback count
- tabular staff selection report for the selected month
- staff comparison bar chart for the selected month
- staff selection trends chart over recent months
- dissatisfaction pie chart by reason for the selected month
- dissatisfaction trends chart over the last 6 months
- recurring issues analysis comparing the selected month to the previous month

### 3.2.4 Report Export
The admin dashboard supports export of the monthly staff selection report to:
- Excel
- PDF

---

## 4. Data and Reporting Requirements

### 4.1 Feedback Capture Model
- Every customer journey starts with a `Feedback` record.
- `Feedback.overallRating` stores the high-level sentiment.
- Positive flow links selected staff through `FeedbackStaff`.
- Negative flow links selected dissatisfaction reason through `FeedbackReason`.

### 4.2 Staff Reporting
The system shall support:
- counting staff selections by month
- comparing staff selection counts in chart and table form
- showing trend lines for staff selections over time

### 4.3 Dissatisfaction Reporting
The system shall support:
- counting monthly `NOT_SATISFIED` feedback records
- grouping dissatisfaction reason usage for the selected month
- comparing dissatisfaction reason counts with the previous month
- displaying last-6-month dissatisfaction trends

---

## 5. Non-Functional Requirements

### 5.1 Usability
- Customer-facing flow shall be touch-friendly and simple.
- Customer pages shall use a minimal interaction pattern suitable for kiosk usage.
- Dashboard pages shall provide clear data presentation for administrators.

### 5.2 Performance
- Customer interactions should complete quickly enough for kiosk usage.
- Reporting endpoints should return within a practical time range for monthly dashboard use.

### 5.3 Reliability
- The system should handle missing or invalid follow-up IDs gracefully.
- API routes should return structured error responses when operations fail.

### 5.4 Security
- Admin access is protected through authenticated sessions.
- Passwords are stored as bcrypt hashes.
- Database access is mediated through Prisma.

---

## 6. Technical Implementation Summary

### 6.1 Stack
- Next.js 15 (App Router)
- TypeScript
- Prisma ORM
- MySQL
- Tailwind CSS v4
- NextAuth.js
- Recharts
- ExcelJS
- jsPDF

### 6.2 Application Structure
- `src/app` contains App Router pages and API routes
- `src/lib` contains shared database/auth/reporting helpers
- `src/components/ui` contains chart components
- `prisma/schema.prisma` defines the database schema
- `prisma/seed.ts` loads development seed data

### 6.3 Deployment Support
- Dockerfile is included for the app
- Separate Docker Compose files exist for app and database services
- Prisma migrations are included in the repository

---

## 7. Current Known Constraints

- The customer positive flow currently captures **one staff selection per submission interaction**.
- The customer negative flow currently captures **one dissatisfaction reason**.
- `SystemConfig` values exist in the database but are not yet wired into an admin settings UI or fully consumed by the customer pages.
- A legacy `ratings` API route remains in the codebase but is not used in the implemented flow.

---

## 8. Future Enhancement Candidates

The following may be implemented in future versions, but are not part of the current delivered scope:
- staff management CRUD
- dissatisfaction reason/category management
- settings/branding management
- password reset
- multiple dissatisfaction reason selection
- customer comments
- richer exports and more filtering options
- operational monitoring and audit trails
