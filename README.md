# Customer Feedback System

A kiosk-oriented customer feedback application for retail environments, built with Next.js, TypeScript, Prisma, MySQL, Tailwind CSS, and NextAuth.js.

The current implementation focuses on two working areas:
- a **customer-facing kiosk flow** for collecting quick feedback
- an **admin dashboard** for authentication, reporting, and export

---

## Current Features

### Customer kiosk flow
- Home screen with two options:
  - **Good**
  - **Bad** (`NOT_SATISFIED` in the database)
- Immediate feedback record creation when a customer selects an overall rating
- Positive flow:
  - redirects to a staff selection screen
  - allows the customer to choose **one staff member** they interacted with
- Negative flow:
  - redirects to a dissatisfaction reason screen
  - allows the customer to choose **one dissatisfaction reason**
- Thank-you screen after submission
- 10-second inactivity timeout on customer-facing screens, with automatic reset back to the home screen

### Admin portal
- Credential-based login using NextAuth.js
- Protected `/admin` routes via middleware
- Dashboard with:
  - monthly **Good** feedback count
  - monthly **Bad** feedback count
  - staff selection table by month
  - staff comparison bar chart
  - staff selection trends chart
  - dissatisfaction reason pie chart
  - dissatisfaction trends chart (last 6 months)
  - recurring issues analysis comparing selected month vs previous month
- Staff management with live CRUD:
  - list all staff records
  - create staff members
  - edit staff member details
  - safe delete/deactivate behavior when feedback history exists
  - inline image crop and backend image persistence under `public/uploads/staff`
- Export of staff selection report to:
  - **Excel**
  - **PDF**

### Data & infrastructure
- Prisma ORM with MySQL
- Seed script for admin user, staff, categories, dissatisfaction reasons, and system configuration values
- Docker support for app and database containers
- Prisma migrations included in the repository

---

## Current Tech Stack

- **Frontend & Backend:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** MySQL
- **ORM:** Prisma
- **Authentication:** NextAuth.js (credentials provider)
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts
- **Exports:** ExcelJS, jsPDF, jspdf-autotable
- **Containerization:** Docker, Docker Compose

---

## Current Project Structure

```text
.
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── emojis/
│   └── images/staff/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── api/
│   │   ├── dissatisfaction-reasons/
│   │   ├── rate-staff/
│   │   └── thank-you/
│   ├── components/ui/
│   ├── hooks/
│   └── lib/
├── DATABASE_SETUP.md
├── Dockerfile
├── ERD.md
├── PRD.md
├── README.md
└── TASKS.md
```

---

## Current User Flow

### Customer flow
1. Customer opens the home screen
2. Customer selects **Good** or **Bad**
3. App creates a `Feedback` record through `POST /api/feedback`
4. App branches by rating:
   - **Good** → `/rate-staff?feedbackId=...`
   - **Bad** → `/dissatisfaction-reasons?feedbackId=...`
5. Customer submits one follow-up selection
6. App redirects to `/thank-you`
7. Kiosk returns to `/` after inactivity timeout

### Admin flow
1. Admin visits `/admin/login`
2. Admin signs in with username and password
3. Authenticated user is redirected to `/admin/dashboard`
4. Dashboard fetches reporting data from API routes
5. Admin can export the monthly staff selection report to Excel or PDF

---

## Current API Routes

### Authentication
- `GET/POST /api/auth/[...nextauth]`

### Customer flow
- `POST /api/feedback`
- `POST /api/feedback-staff`
- `POST /api/feedback-dissatisfaction`
- `GET /api/staff`
- `GET /api/dissatisfaction-reasons`

### Admin staff management
- `GET /api/admin/staff`
- `POST /api/admin/staff`
- `GET /api/admin/staff/[id]`
- `PUT /api/admin/staff/[id]`
- `DELETE /api/admin/staff/[id]`
- `POST /api/admin/staff/image`

### Dashboard/reporting
- `GET /api/staff-selections?month=...`
- `GET /api/staff-selection-trends`
- `GET /api/good-summary?month=...`
- `GET /api/dissatisfaction-summary?month=...`
- `GET /api/dissatisfaction-comparison?month=...`
- `GET /api/dissatisfaction-trends`
- `GET /api/ratings` *(legacy placeholder route; currently returns an empty array)*

---

## Environment Variables

Create a `.env` file for development or update `.env.prod` for production-like Docker runs.

```env
DATABASE_URL="mysql://feedback_user:your_password@localhost:3306/customer_feedback"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
MYSQL_DATABASE="customer_feedback"
MYSQL_USER="feedback_user"
MYSQL_PASSWORD="your_password"
MYSQL_ROOT_PASSWORD="your_root_password"
```

---

## Getting Started (Development)

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Create a `.env` file with your database and NextAuth settings.

### 3. Run database migrations
```bash
npx prisma migrate dev
```

### 4. Seed initial data
```bash
npm run prisma:seed
```

### 5. Start the development server
```bash
npm run dev
```

Open:
- Customer flow: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`

---

## Docker Usage

### Start the database
```bash
docker-compose -f docker-compose-database.yml up -d
```

### Start the app
```bash
docker-compose -f docker-compose-app.yml up -d
```

### Apply migrations in the app container
```bash
docker-compose -f docker-compose-app.yml exec app npx prisma migrate deploy
```

### Seed data in the app container
```bash
docker-compose -f docker-compose-app.yml exec app npm run prisma:seed
```

---

## Seeded Development Data

The seed script currently creates:
- 1 admin user
  - username: `admin`
  - password: `admin123`
- 8 staff records with image paths
- 3 categories
- 5 dissatisfaction reasons
- 3 system configuration records

Change these values before any real deployment.

---

## Current Limitations

The documentation in this repository is now aligned to the **current implementation**, which means the following are **not** part of the implemented feature set yet:
- dissatisfaction reason management UI
- category management UI
- system configuration UI
- password reset
- multiple dissatisfaction reason selection in the customer flow
- optional customer comments in the customer flow
- automatic use of `SystemConfig` values inside the kiosk pages

---

## Related Documentation

- `PRD.md` — product requirements for the current implementation
- `ERD.md` — current data model and relationships
- `DATABASE_SETUP.md` — database and Prisma setup
- `TASKS.md` — implemented work, pending work, and future enhancements
- `CLAUDE.md` — contributor/developer guidance for this repository

---

## Docker release and deployment

This project is prepared for Docker Hub releases using semantic version tags plus the moving `latest` tag.

### Canonical version source

The application version is stored in `package.json`.

Example:
```json
"version": "1.0.0"
```

### Release tags

Each release should publish:
- `cmmrox/customer-feedback:<exact-version>`
- `cmmrox/customer-feedback:latest`

For the first production release:
- `cmmrox/customer-feedback:1.0.0`
- `cmmrox/customer-feedback:latest`

### Build and push to Docker Hub

From the project root:

```bash
chmod +x scripts/docker-release.sh
./scripts/docker-release.sh
```

That script will:
- read the version from `package.json`
- build the image
- tag the image with the exact version
- tag the same image as `latest`
- push both tags to Docker Hub

If you want to publish a different explicit version after updating `package.json`:

```bash
./scripts/docker-release.sh 1.0.1
```

### Production deployment with Docker Compose

The production compose file pulls the image directly from Docker Hub instead of building from source.

Default behavior:
```bash
docker compose -f docker-compose-app.yml --env-file .env.prod pull
docker compose -f docker-compose-app.yml --env-file .env.prod up -d
```

To deploy a specific version instead of `latest`:

```bash
APP_IMAGE_TAG=1.0.0 docker compose -f docker-compose-app.yml --env-file .env.prod pull
APP_IMAGE_TAG=1.0.0 docker compose -f docker-compose-app.yml --env-file .env.prod up -d
```

### Uploaded staff images

Staff images are written to `/app/uploads` in the container. The compose file mounts a named Docker volume so uploaded images survive container restarts and image updates.

### Database migrations

Run Prisma migrations separately during deployment if needed:

```bash
docker compose -f docker-compose-app.yml --env-file .env.prod exec app npx prisma migrate deploy
```

### Future version management policy

Use semantic versioning:
- `PATCH` (`1.0.1`) for bug fixes
- `MINOR` (`1.1.0`) for backward-compatible features
- `MAJOR` (`2.0.0`) for breaking changes

Recommended production practice:
- publish both `latest` and exact version tags
- deploy exact version tags in production for safer rollbacks
- keep `latest` for convenience and quick smoke deployments
