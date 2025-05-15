# Database Setup Guide

This document provides instructions for setting up the MySQL database and Prisma ORM for the Customer Satisfaction Feedback System.

## Prerequisites

- MySQL server installed and running
- Node.js and npm installed

## Database Setup

1. Create a new MySQL database:

```sql
CREATE DATABASE customer_feedback CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Create a database user and grant permissions:

```sql
CREATE USER 'feedback_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON customer_feedback.* TO 'feedback_user'@'localhost';
FLUSH PRIVILEGES;
```

3. Create a `.env` file in the root directory with the following content (update with your credentials):

```
DATABASE_URL="mysql://feedback_user:your_password@localhost:3306/customer_feedback"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Prisma Setup

1. Install dependencies:

```bash
npm install
```

2. Generate Prisma Client:

```bash
npx prisma generate
```

3. Apply database migrations:

```bash
npx prisma migrate dev --name init
```

4. Seed the database with initial data:

```bash
npx prisma db seed
```

## Database Schema

The database schema includes the following models:

- **User**: Admin users who manage the system
- **Staff**: Staff members who receive feedback
- **Feedback**: Customer feedback entries
- **DissatisfactionReason**: Predefined reasons for customer dissatisfaction
- **DissatisfactionFeedback**: Junction table linking feedback to reasons
- **SystemConfig**: System configuration settings

## Working with the Database

### Using Prisma Studio

You can use Prisma Studio to view and edit data in your database:

```bash
npx prisma studio
```

This will open a web interface at http://localhost:5555

### Data Access Layer

The data access layer is implemented in `lib/db.ts`, which exports a Prisma client instance that can be imported and used throughout the application.

Example usage:

```typescript
import prisma from '@/lib/db';

// Get all staff members
const staff = await prisma.staff.findMany();

// Create a new feedback entry
const feedback = await prisma.feedback.create({
  data: {
    experienceRating: 'GOOD',
    emotionRating: 'HEART',
    staffId: '123',
  },
});
```

## Troubleshooting

If you encounter connection issues:

1. Verify your MySQL server is running
2. Check your database credentials in the `.env` file
3. Ensure your MySQL user has the necessary permissions
4. Try connecting to the database using a MySQL client 