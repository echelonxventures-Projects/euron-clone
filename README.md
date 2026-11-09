# Euron Clone — Next.js full-stack

A learning-platform site inspired by euron.one: a marketing site plus a working backend (auth, courses, enrollments, subscriptions, admin).

## Stack
| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Server Components, Server Actions, Turbopack) |
| UI | React 19, Tailwind CSS v4 |
| Database | SQLite via libSQL (local file) — switch to Turso by changing `DATABASE_URL` |
| ORM / migrations | Drizzle ORM + drizzle-kit |
| Auth | Email/password, bcrypt hashing, JWT session in an httpOnly cookie (`jose`) |
| Validation | Zod |

## Getting started
```bash
npm install
cp .env.example .env.local     # then set AUTH_SECRET (openssl rand -base64 32)
npm run setup                  # create tables + seed courses, projects, admin user
npm run dev                    # http://localhost:5566
```
Seeded admin: `admin@euron.local` / `admin12345` (override with `ADMIN_EMAIL` / `ADMIN_PASSWORD` before seeding). **Change this before deploying.**

## Features
- **Landing page** — hero with live DB stats, filterable course explorer, projects, career tools, pricing, FAQ, newsletter.
- **Courses** — `/courses` with server-side search + category filters; `/courses/[slug]` detail pages.
- **Auth** — `/signup`, `/login`, logout; protected routes redirect to login and back (`?next=`).
- **Subscriptions** — `/checkout` takes payment via Razorpay and activates Euron One; free courses are open to all, paid ones require an active subscription. Cancel keeps access until period end.
- **Dashboard** — enrolled courses, progress tracking, subscription management.
- **Admin** (`/admin`, admin role only) — create / publish / delete courses, view users, sales leads, newsletter subscribers.
- **Teams** — `/contact` lead form stored in the DB.
- **API** — `GET /api/courses?q=&category=` (JSON), `GET /api/health`.

## Project layout
```
app/            routes (pages, API routes) and app/actions/* server actions
components/     UI components (client components marked "use client")
lib/db/         Drizzle schema + client
lib/            auth, queries, validation, static marketing copy
scripts/seed.ts database seed
static-version/ the original plain HTML/CSS/JS build
```

## Scripts
`dev`, `build`, `start`, `lint` (typecheck), `db:push`, `db:seed`, `db:studio`, `setup`.

## Payments (Razorpay)
Flow: **server creates order → Razorpay Checkout modal → server verifies signature → subscription activated**, with a webhook as the backstop.

1. In the Razorpay Dashboard (Test mode first) generate API keys and set `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` in `.env.local`.
2. Add a webhook → URL `https://<your-domain>/api/webhooks/razorpay`, events `payment.captured`, `order.paid`, `payment.failed`, and put its secret in `RAZORPAY_WEBHOOK_SECRET`. For local testing expose your dev server with a tunnel (e.g. `ngrok http 5566`).
3. Pay with Razorpay's test cards / UPI (`success@razorpay`) in Test mode.

Details:
- Prices live server-side (`lib/billing.ts`, from `PLANS`); the client never sends an amount.
- Every order is stored in the `payments` table; `fulfillOrder` is idempotent, so the checkout callback and webhook can both fire safely. Renewing early stacks onto the remaining period.
- Signatures are checked with HMAC-SHA256 and constant-time comparison (`lib/razorpay.ts`).
- Without keys in development, checkout is simulated. **In production, missing keys disable checkout** rather than granting free access.
- Billing is one-time per period (monthly/yearly prepaid). For auto-renewing mandates, move to Razorpay Subscriptions (Plans API) and handle `subscription.*` webhooks.

## Going to production
- **Database:** create a Turso DB, set `DATABASE_URL=libsql://…` and `DATABASE_AUTH_TOKEN`, then run `npm run setup`. (To use Postgres instead, swap the Drizzle dialect and driver.)
- **Hosting:** deploy to Vercel; set `AUTH_SECRET` and the DB env vars.
- **Content:** testimonials and company logos are placeholders — replace with real, consented content.
