# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Customer Satisfaction Feedback System - A Next.js web application for collecting and analyzing customer feedback in retail environments. Features a touch-optimized customer interface, admin portal with analytics, and MySQL database backend.

## Commands

### Development
```bash
npm run dev              # Start development server (uses Turbopack)
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
```

### Database
```bash
npx prisma migrate dev           # Create and apply migration in development
npx prisma migrate deploy        # Apply migrations in production
npm run prisma:seed              # Seed database with initial data
npx prisma studio                # Open Prisma Studio GUI
npx prisma generate              # Regenerate Prisma Client after schema changes
```

### Docker (Production)
```bash
# Start database
docker-compose -f docker-compose-database.yml up -d

# Start application
docker-compose -f docker-compose-app.yml up -d

# Initialize database in Docker
docker-compose -f docker-compose-app.yml exec app npx prisma migrate deploy
docker-compose -f docker-compose-app.yml exec app npx prisma db seed

# View logs
docker-compose -f docker-compose-app.yml logs -f

# Restart services
docker-compose -f docker-compose-app.yml restart
```

## Architecture

### Application Flow
1. **Customer Portal** (`/`) - Rating selection (Good/Not Satisfied)
2. **Good Rating Flow** → Staff selection (`/rate-staff`) → Thank you
3. **Not Satisfied Flow** → Dissatisfaction reasons (`/dissatisfaction-reasons`) → Staff selection → Thank you
4. **Admin Portal** (`/admin`) - Protected by NextAuth.js, provides analytics and management

### Key Patterns

**Authentication**
- NextAuth.js with credentials provider
- Session strategy: JWT (30-day max age)
- Password hashing: bcrypt
- Auth configuration: `src/lib/auth.ts`
- Protected routes use `getServerSession()` from `next-auth/next`

**Database Access**
- Always import Prisma client from `src/lib/db.ts` as `prisma`
- Client is singleton pattern to prevent connection exhaustion in development
- All database operations should use try-catch with proper error handling

**API Routes Pattern**
```typescript
// All API routes in src/app/api/
// Use Zod for request validation
// Return consistent response formats
// Example structure:
export async function GET(request: Request) {
  try {
    const data = await prisma.model.findMany();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Message' }, { status: 500 });
  }
}
```

**Feedback Data Model**
- `Feedback` table stores overall rating (GOOD/NOT_SATISFIED) and comments
- `FeedbackStaff` junction table links feedback to selected staff members
- `FeedbackReason` junction table links dissatisfied feedback to reasons
- All cascade deletes configured on junction tables

**Session Timeout**
- Customer-facing pages implement inactivity timeout
- Configured via `SESSION_TIMEOUT` environment variable
- Automatically redirects to home after timeout period

### File Structure Notes

**Important Files**
- `src/lib/db.ts` - Prisma client singleton (always use this export)
- `src/lib/auth.ts` - NextAuth configuration
- `src/lib/staff-selection.ts` - Staff selection business logic
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth handler
- `prisma/schema.prisma` - Database schema with MySQL provider
- `prisma/seed.ts` - Database seeding script

**Component Organization**
- `src/components/ui/` - Reusable UI components (charts, shimmer effects)
- All components are functional components with TypeScript interfaces for props
- Use `"use client"` directive for client components (including those with hooks)

### Database Schema Key Points

**Users**
- Admin authentication (username/password/email)
- Role-based: ADMIN or SUPER_ADMIN
- Passwords stored as bcrypt hashes

**Staff**
- Can have images stored in `/public/staff/` or uploads directory
- Status field for active/inactive

**Feedback Relations**
- One feedback can have multiple staff selections (many-to-many)
- One feedback can have multiple dissatisfaction reasons (many-to-many)
- Use `@@unique([feedbackId, staffId])` and `@@unique([feedbackId, reasonId])` constraints

**Categories and DissatisfactionReason**
- Reasons are grouped by categories for organization
- Active/inactive flag on reasons for soft deletion

## TypeScript Configuration

- Strict mode enabled
- Path alias: `@/*` maps to `./src/*`
- Seed script uses separate `tsconfig.seed.json` to include Prisma seed files

## Code Style (from .cursorrules)

**Key Principles**
- Use explicit types for all variables and functions (avoid `any`)
- Use PascalCase for components/types, camelCase for variables/functions, kebab-case for files
- Server components by default; only add `"use client"` when needed
- Keep components under 100 lines and focused on single responsibility
- Always include proper error handling with try-catch for async operations
- Validate all user inputs with Zod schemas

**Database Operations**
- Never use raw SQL unless absolutely necessary
- Use transactions for related operations
- Use `include` and `select` to optimize queries
- Import from `@/lib/db` (singleton pattern)

**Important Rules**
- After making changes, always run `npm run build` to verify no build errors
- Run Prisma migrations with `npx prisma migrate dev` (never use `db push` in production)
- Use absolute imports with `@/` prefix

## Environment Variables

Required variables (see `.env` or `.env.prod`):
```
DATABASE_URL                    # MySQL connection string
NEXTAUTH_URL                    # Application URL
NEXTAUTH_SECRET                 # Min 32 chars for JWT signing
UPLOAD_DIR                      # Upload directory path
SESSION_TIMEOUT                 # Inactivity timeout in milliseconds
```

For Docker deployment, also configure:
```
MYSQL_DATABASE
MYSQL_USER
MYSQL_PASSWORD
MYSQL_ROOT_PASSWORD
```
