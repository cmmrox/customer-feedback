# Demo Data Usage

This project includes a reusable demo SQL file:

- `demo-data-db.sql`

It populates **3 months of dashboard-friendly demo data** for the current schema.

## What it inserts

The script clears and repopulates only these tables:
- `feedback_reasons`
- `feedback_staff`
- `feedback`

It does **not** delete or recreate:
- `users`
- `staff`
- `categories`
- `dissatisfaction_reasons`
- `system_config`

## Prerequisites

Before importing the demo data, make sure the base seed data already exists.

That means the database should already contain:
- seeded staff records
- seeded dissatisfaction reasons
- seeded categories
- admin user and config data if needed for the full app

If needed, run the normal seed flow first.

## Import command (Docker MySQL)

From the project root:

```bash
docker compose -f docker-compose-database.yml exec -T db   mysql -uroot -p${MYSQL_ROOT_PASSWORD:-Yathura321} customer_feedback < demo-data-db.sql
```

## Import command (explicit password)

```bash
docker compose -f docker-compose-database.yml exec -T db   mysql -uroot -pYathura321 customer_feedback < demo-data-db.sql
```

## What the script is designed for

It creates demo feedback across:
- February 2026
- March 2026
- April 2026

Approximate reporting totals:
- February 2026: **11 GOOD / 3 NOT_SATISFIED**
- March 2026: **12 GOOD / 3 NOT_SATISFIED**
- April 2026: **13 GOOD / 4 NOT_SATISFIED**

Total feedback rows inserted: **46**

## Notes

- The script looks up current `staff.id` and `dissatisfaction_reasons.id` values by name/description before inserting records.
- This makes it reusable even if seeded IDs differ between environments.
- The script includes simple lookup checks so you can spot missing prerequisite data.

## Recommended usage flow

1. Start DB container
2. Ensure base seed data exists
3. Import `demo-data-db.sql`
4. Refresh the dashboard
5. Review charts and monthly reporting views
