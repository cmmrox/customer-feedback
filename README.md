# Customer Satisfaction Feedback System

This project is a web-based Customer Satisfaction Feedback System built with Next.js, TypeScript, and Tailwind CSS.

## Project Setup & Architecture

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Linting:** ESLint
- **Directory Structure:**
  - `/src/app` - Application routes and pages
  - `/public` - Static assets
  - `/src/components` - (To be created) Reusable UI components
  - `/src/styles` - (To be created) Custom styles
  - `/src/utils` - (To be created) Utility functions

## Getting Started

```bash
npm install
npm run dev
```

## Next Steps
- Configure Prettier
- Set up environment variables
- Create component library and design system
- Set up state management
- Establish API structure
- Configure authentication (NextAuth.js)
- Add Docker configuration

---

For more details, see the [Development Task List](../Development%20Task%20List_%20Customer%20Satisfaction%20Feedb.md) and [Product Requirements Document](../Product%20Requirements%20Document_%20Customer%20Satisfacti.md).

## Docker Deployment

### Prerequisites

- Docker and Docker Compose installed on your server
- Domain name for your application
- SSL certificates for your domain

### Setup Instructions

1. Clone the repository to your production server:

```bash
git clone [repository-url]
cd customer-feedback
```

2. Create necessary directories for Nginx:

```bash
mkdir -p nginx/conf nginx/ssl nginx/www
```

3. Copy your SSL certificates to the nginx/ssl directory:

```bash
cp /path/to/your/certificate.pem nginx/ssl/cert.pem
cp /path/to/your/key.pem nginx/ssl/key.pem
```

4. Configure your production environment by creating a `.env.production` file:

```bash
# Database
DATABASE_URL=mysql://user:password@db:3306/customer_feedback

# NextAuth.js
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-nextauth-secret-key-at-least-32-chars

# Upload storage
UPLOAD_DIR=/app/uploads

# App settings
SESSION_TIMEOUT=10000

# MySQL Root Password (for docker-compose)
MYSQL_ROOT_PASSWORD=secure-root-password
```

5. Update the Nginx configuration in `nginx/conf/app.conf` with your domain name.

6. Build and start the application:

```bash
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

7. Initialize the database (first time only):

```bash
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
docker-compose -f docker-compose.prod.yml exec app npx prisma db seed
```

### Maintenance Commands

- View logs:
  ```bash
  docker-compose -f docker-compose.prod.yml logs -f
  ```

- Restart services:
  ```bash
  docker-compose -f docker-compose.prod.yml restart
  ```

- Update the application:
  ```bash
  git pull
  docker-compose -f docker-compose.prod.yml build app
  docker-compose -f docker-compose.prod.yml up -d
  ```

### Backup and Restore

- Backup the database:
  ```bash
  docker-compose -f docker-compose.prod.yml exec db mysqldump -u root -p customer_feedback > backup_$(date +%Y%m%d).sql
  ```

- Restore the database:
  ```bash
  docker-compose -f docker-compose.prod.yml exec -T db mysql -u root -p customer_feedback < backup_file.sql
  ```

## Security Considerations

- Always use strong passwords in production
- Regularly update Docker images for security patches
- Set up automatic backups for your database
- Monitor application logs for suspicious activity
- Use a firewall to restrict access to the server
