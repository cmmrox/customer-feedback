# Database Setup Guide

This guide reflects the database setup required for the **current implementation** of the Customer Feedback System.

## 1. Prerequisites

- MySQL server installed and running
- Node.js and npm installed
- project dependencies installed with `npm install`

---

## 2. Database Creation

Create the database:

```sql
CREATE DATABASE customer_feedback CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Create a database user and grant permissions:

```sql
CREATE USER 'feedback_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON customer_feedback.* TO 'feedback_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## 3. Environment Configuration

Create a `.env` file in the project root with values similar to the following:

```env
DATABASE_URL="mysql://feedback_user:your_password@localhost:3306/customer_feedback"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
UPLOAD_DIR="./uploads"
```

If you use Docker Compose for MySQL, also provide:

```env
MYSQL_DATABASE="customer_feedback"
MYSQL_USER="feedback_user"
MYSQL_PASSWORD="your_password"
MYSQL_ROOT_PASSWORD="your_root_password"
```

For Docker app deployments, use a runtime upload path such as:

```env
UPLOAD_DIR="/app/uploads"
```

---

## 4. Install Dependencies

```bash
npm install
```

---

## 5. Prisma Setup

Generate the Prisma client:

```bash
npx prisma generate
```

Apply migrations in development:

```bash
npx prisma migrate dev
```

Apply migrations in production-like environments:

```bash
npx prisma migrate deploy
```

Seed the database:

```bash
npm run prisma:seed
```

Optional full reset:

```bash
npx prisma migrate reset
```

---

## 6. Current Database Models

The current schema contains these models:
- `User`
- `Staff`
- `Feedback`
- `FeedbackStaff`
- `Category`
- `DissatisfactionReason`
- `FeedbackReason`
- `SystemConfig`

### Model usage summary
- `User` stores admin login accounts.
- `Staff` stores kiosk-selectable staff members.
- `Feedback` stores the top-level rating submission.
- `FeedbackStaff` links positive feedback to selected staff.
- `Category` groups dissatisfaction reasons.
- `DissatisfactionReason` stores negative feedback options.
- `FeedbackReason` links negative feedback to selected reasons.
- `SystemConfig` stores configuration-style key/value data.

---

## 7. Seed Data

The current seed script creates:
- one admin user (`admin` / `admin123`)
- eight staff records
- three categories
- five dissatisfaction reasons
- three system configuration records

Change the seeded credentials and sample values before any real deployment.

---

## 8. Prisma Studio

To inspect and edit records during development:

```bash
npx prisma studio
```

Prisma Studio will open locally, typically on:
- `http://localhost:5555`

---

## 9. Docker-Based Setup

Start the database:

```bash
docker-compose -f docker-compose-database.yml up -d
```

Start the app:

```bash
docker-compose -f docker-compose-app.yml up -d
```

Apply migrations inside the app container:

```bash
docker-compose -f docker-compose-app.yml exec app npx prisma migrate deploy
```

Seed data inside the app container:

```bash
docker-compose -f docker-compose-app.yml exec app npm run prisma:seed
```

### Upload storage notes
- Uploaded staff images are stored in runtime storage, not inside `public/`
- Docker app deployments should mount the uploads folder persistently at `/app/uploads`
- The app serves those files through `/api/uploads/staff/[filename]`

---

## 10. Notes About the Current Implementation

- `Feedback.comments` exists in the schema but is not yet used by the customer UI.
- `SystemConfig` contains seeded values, but the customer-facing timeout is currently implemented in the UI as a fixed 10-second timer.
- The active customer flow uses:
  - `Feedback`
  - `FeedbackStaff`
  - `FeedbackReason`
- Dashboard reporting queries read from these tables to build monthly summaries and charts.
