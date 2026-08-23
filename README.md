# Metaxia Solutions

Metaxia Solutions is a comprehensive website platform built with a modern monorepo
architecture. It contains a Next.js 15 marketing site + admin panel (`apps/web`), a
NestJS API backend (`apps/api`), and a shared TypeScript types package
(`packages/shared`), managed with pnpm workspaces.

## Prerequisites

- Node.js >= 20
- pnpm (via corepack: `corepack enable`, or `npm i -g pnpm`)

## Install

```bash
pnpm install
```

This installs dependencies for all workspace packages (`apps/api`, `apps/web`,
`packages/shared`) in one step.

## Environment setup

Each app reads config from its own `.env` file. Copy the example files and adjust
as needed — the defaults work out of the box for local development.

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

`apps/api/.env`:

| Variable         | Purpose                                                       |
| ---------------- | -------------------------------------------------------------- |
| `DATABASE_URL`   | Prisma datasource (SQLite file by default: `file:./dev.db`)    |
| `JWT_SECRET`     | Signing secret for admin auth tokens                            |
| `ADMIN_EMAIL`    | Seeded admin login email                                        |
| `ADMIN_PASSWORD` | Seeded admin login password                                     |
| `WEB_ORIGIN`     | Allowed CORS origin (the web app's URL)                         |
| `PORT`           | API listen port (default `4000`)                                |

`apps/web/.env.local`:

| Variable              | Purpose                                             |
| --------------------- | ---------------------------------------------------- |
| `API_URL`              | Base URL the web app uses to reach the API server    |
| `NEXT_PUBLIC_SITE_URL` | Public site URL, used for sitemap/robots/OG metadata |

## Database: migrate + seed

Run from `apps/api` (or use `pnpm --filter @metaxia/api <script>` from the repo root):

```bash
pnpm --filter @metaxia/api prisma:migrate
pnpm --filter @metaxia/api prisma:seed
```

`prisma:migrate` applies migrations to the local SQLite database (`apps/api/dev.db`).
`prisma:seed` populates it with sample services, case studies, posts, team members,
jobs, pricing plans, FAQ items, and testimonials, plus the admin user defined by
`ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`.

## Running in development

From the repo root, run both apps in parallel:

```bash
pnpm dev
```

Or run them individually:

```bash
pnpm --filter @metaxia/api dev   # NestJS, http://localhost:4000
pnpm --filter @metaxia/web dev   # Next.js,  http://localhost:3000
```

### Ports

| App          | Dev/prod port |
| ------------ | ------------- |
| API (NestJS) | 4000          |
| Web (Next)   | 3000          |

### Admin login

Visit `http://localhost:3000/admin` and sign in with the credentials from
`apps/api/.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`; the dev defaults are
`admin@metaxia.io` / `metaxia-admin-dev`). The admin panel lets you create, edit,
and delete all content types (services, case studies, posts, team, jobs, pricing,
FAQ) and view inbound contact/newsletter submissions.

## Testing

```bash
pnpm --filter @metaxia/api test   # Jest e2e suite (23 tests) against a real Nest app instance
pnpm --filter @metaxia/web test   # next build, used as a type/build smoke test
pnpm test                          # runs test in every workspace package
```

## Building for production

```bash
pnpm build   # builds packages/shared, apps/api, apps/web in dependency order
```

Then run the production servers:

```bash
node apps/api/dist/main.js   # API
pnpm --filter @metaxia/web start   # Web (next start)
```

## Architecture sketch

```
apps/web (Next.js 15, App Router)
  ├─ Server components fetch content from the API via apps/web/src/lib/api.ts
  │  Each call uses `fetch(..., { next: { revalidate: 60 } })` — Next's
  │  Incremental Static Regeneration (ISR). Pages are statically generated at
  │  build time, then revalidated in the background at most once every 60s, so
  │  content edited in the admin panel appears on the live site within ~60
  │  seconds without a full redeploy.
  │
  ├─ Every fetch helper in lib/api.ts fails soft: a network error or non-OK
  │  response resolves to an empty-array/null fallback instead of throwing.
  │  This is what makes builds succeed even if the API is unreachable (see
  │  "Graceful degradation" below) — list pages render an empty state and
  │  generateStaticParams() returns [] so no static detail pages are built.
  │
  └─ apps/web/src/app/api/* — server-side proxy routes (contact, newsletter,
     admin/[...path]) that forward requests to the NestJS API. The browser
     never talks to the API directly; the admin panel calls
     /api/admin/<resource> which proxies to the real API with the
     Authorization header attached, and /api/admin/[...path]/route.ts
     allow-lists which resource roots may be proxied.

apps/api (NestJS)
  ├─ Prisma ORM against SQLite (dev) — schema at apps/api/prisma/schema.prisma
  ├─ REST endpoints for each content type (services, case-studies, posts,
  │  team, jobs, pricing, faq, testimonials) plus /admin/* CRUD endpoints
  │  guarded by JWT auth (/auth/login), and /contact + /newsletter inbound
  │  endpoints.
  └─ CORS restricted to WEB_ORIGIN; helmet + rate limiting (throttler) enabled.

packages/shared
  └─ Shared TypeScript types (Service, CaseStudy, Post, TeamMember, Job,
     PricingPlan, FaqItem, Testimonial, ...) imported by both apps so API
     responses and web components stay in sync.
```

### Graceful degradation

The web app is designed to build and run even when the API is completely
unreachable: every data-fetching helper catches errors and falls back to `[]`
or `null`, list pages render an explicit empty state, and dynamic route
`generateStaticParams()` functions return `[]` instead of throwing — so
`pnpm --filter @metaxia/web build` still succeeds with zero pre-rendered
detail pages. This has been verified: stopping the API and deleting
`apps/web/.next` before rebuilding completes without error.

## Production notes

Before deploying:

- **Secrets**: set a strong, unique `JWT_SECRET` and a strong `ADMIN_PASSWORD`
  in the production `apps/api` environment — never reuse the dev defaults
  committed in `.env.example`.
- **Database**: swap SQLite for Postgres by changing
  `datasource db { provider = "sqlite" ... }` to `provider = "postgresql"` in
  `apps/api/prisma/schema.prisma`, pointing `DATABASE_URL` at your Postgres
  instance, and re-running `prisma migrate deploy`.
- **CORS**: set `WEB_ORIGIN` to the deployed web app's real origin.
- **Env files**: `apps/web/.env.local`'s `API_URL` should point at the deployed
  API's internal/public URL, and `NEXT_PUBLIC_SITE_URL` should be the site's
  public domain (used in sitemap.xml, robots.txt, and Open Graph metadata).
