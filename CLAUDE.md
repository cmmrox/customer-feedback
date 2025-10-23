# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js-based Customer Satisfaction Feedback System for retail environments with a customer-facing kiosk interface and admin portal. Built with TypeScript, Prisma ORM, MySQL, and NextAuth.js authentication.

## Essential Commands

### Development
```bash
npm run dev              # Start dev server with Turbopack
npm run build            # Production build (always run to verify no errors)
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
```

### Database Operations
```bash
npx prisma generate       # Generate Prisma client after schema changes
npx prisma migrate dev    # Create and apply migrations in development
npx prisma migrate deploy # Apply migrations in production
npm run prisma:seed       # Seed database with initial data
npx prisma migrate reset  # Reset database (wipe all data, reapply migrations, and reseed)
npx prisma studio         # Open Prisma Studio at localhost:5555
```

**IMPORTANT**: Never use `npx prisma db push` in production. Always use migrations.

### Docker Operations
```bash
# Database container
docker-compose -f docker-compose-database.yml up -d
docker-compose -f docker-compose-database.yml logs -f

# Application container
docker-compose -f docker-compose-app.yml up -d
docker-compose -f docker-compose-app.yml exec app npx prisma migrate deploy
docker-compose -f docker-compose-app.yml exec app npm run prisma:seed

# Database backup
docker-compose -f docker-compose-database.yml exec db mysqldump -u root -p customer_feedback > backup_$(date +%Y%m%d).sql
```

## Architecture

### Two-Portal System
1. **Customer Portal**: Touch-optimized kiosk interface with automatic session timeout
   - Initial rating selection (Good/Not Satisfied)
   - Staff selection flow (for positive feedback)
   - Dissatisfaction reason selection (for negative feedback)
   - Thank you page with auto-redirect

2. **Admin Portal**: Secured management interface
   - Staff management (CRUD operations)
   - Analytics and reporting (staff selections, dissatisfaction trends)
   - Export functionality (PDF, Excel)

### Database Design
The schema uses junction tables for many-to-many relationships:

- **FeedbackStaff**: Links Feedback to Staff (one feedback can select multiple staff)
- **FeedbackReason**: Links Feedback to DissatisfactionReason (one feedback can have multiple reasons)
- **Category**: Groups DissatisfactionReasons for better organization

All models use `cuid()` for IDs and include `createdAt`/`updatedAt` timestamps.

### Authentication Flow
- Uses NextAuth.js with credentials provider
- JWT-based sessions (30-day expiration)
- bcrypt password hashing
- Custom pages: `/admin/login` and `/admin/error`
- Role-based access (ADMIN, SUPER_ADMIN)
- Session validation via `authOptions` in `src/lib/auth.ts`

### Inactivity Timeout System
The customer portal implements automatic session reset:
- 10-second inactivity timeout on all customer-facing pages (configurable via `SESSION_TIMEOUT` env var)
- Timer resets on any user interaction
- Automatically redirects to home page on timeout
- Used for kiosk deployments to prevent stale sessions

## Critical Code Patterns

### Database Access
Always import Prisma client from `src/lib/db.ts`:
```typescript
import { prisma } from "@/lib/db";

// Use transactions for related operations
await prisma.$transaction(async (tx) => {
  const feedback = await tx.feedback.create({ ... });
  await tx.feedbackStaff.create({ ... });
});
```

### API Route Structure
All API routes follow this pattern:
- Input validation with Zod schemas
- Try-catch error handling
- Consistent response formats
- Proper HTTP status codes

### Staff Selection Analytics
The `src/lib/staff-selection.ts` module handles complex aggregation:
- Filters feedback by date range (using `date-fns`)
- Groups by staffId using Prisma's `groupBy`
- Joins with staff names for display

## Important Files

### Configuration
- `.cursorrules`: Development standards and TypeScript conventions (follow strictly)
- `prisma/schema.prisma`: Database schema with junction tables
- `src/lib/auth.ts`: NextAuth configuration
- `.env` / `.env.production`: Environment variables (never commit)

### Key Routes
- `src/app/page.tsx`: Customer feedback home (initial rating selection)
- `src/app/rate-staff/page.tsx`: Staff selection interface
- `src/app/dissatisfaction-reasons/page.tsx`: Reason selection
- `src/app/admin/dashboard/page.tsx`: Admin analytics dashboard
- `src/app/api/staff/route.ts`: Staff CRUD operations

## Development Guidelines from .cursorrules

### TypeScript
- Always use explicit types, avoid `any`
- PascalCase for components/types, camelCase for functions/variables
- Use JSDoc for public methods
- Strict mode enabled

### Database
- Use `snake_case` for DB columns, `camelCase` for Prisma fields
- Always include `@@map()` directives for table names
- Include indexes for frequently queried fields
- Use transactions for multi-table operations

### Components
- Functional components only (no class components)
- Server components by default, `"use client"` only when needed
- Keep components under 100 lines
- Use TypeScript interfaces for props

### Styling
- Tailwind utility classes
- Mobile-first responsive design
- Consistent spacing (4, 8, 12, 16, 24, 32px)
- Use `cn()` utility for conditional classes

### Security
- All user inputs validated (client and server)
- CSRF protection enabled
- Environment variables for secrets
- bcrypt for password hashing
- Proper CORS policies

## Common Workflows

### Adding a New Staff Member
1. POST to `/api/staff` with validated data
2. Image upload handling via `src/lib/image-utils.ts`
3. Automatic `createdAt`/`updatedAt` tracking

### Generating Reports
1. Query feedback within date range
2. Use junction tables (FeedbackStaff, FeedbackReason) for aggregation
3. Export via Excel (ExcelJS) or PDF (jsPDF)

### Deploying Changes
1. Test locally: `npm run build`
2. Update migrations: `npx prisma migrate dev`
3. Build Docker image: `docker-compose -f docker-compose-app.yml build app`
4. Deploy migrations: `docker-compose -f docker-compose-app.yml exec app npx prisma migrate deploy`
5. Restart containers: `docker-compose -f docker-compose-app.yml up -d`

## Testing Notes
After any changes:
1. Run `npm run build` to verify no TypeScript/build errors
2. Test both customer and admin portals
3. Verify session timeout behavior in customer portal
4. Check database migrations apply cleanly
5. Test with production-like data volumes

## Reference Documentation
- Product requirements: `PRD.md`
- Database schema: `ERD.md`
- Setup instructions: `DATABASE_SETUP.md`, `README.md`
- Project tasks: `TASKS.md`
