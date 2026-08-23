# Metaxia Solutions — Company Website Design Spec

**Date:** 2026-08-23
**Status:** Approved by owner (musfiquehasan.me@gmail.com)

## Purpose

Build the real Metaxia Solutions company website: a full marketing site with an
original visual design inspired by the structure of the ITSulu "Home V2" template
(https://itsulu.bslthemes.com/home-2/). No template assets, images, or copy are
copied — the layout rhythm is the reference, the execution is original and
branded for Metaxia Solutions.

## Stack

- **Frontend:** Next.js 15 (App Router), Tailwind CSS v4, TypeScript
- **Backend:** NestJS 11, Prisma ORM, SQLite for development (schema portable to
  PostgreSQL for production)
- **Repo:** pnpm workspaces monorepo

## Architecture

```
metaxia-solutions/
├── apps/
│   ├── web/          # Next.js 15, App Router, Tailwind v4
│   └── api/          # NestJS 11, Prisma, SQLite (dev) / Postgres-ready
├── packages/
│   └── shared/       # TypeScript DTO/response types shared by web and api
├── pnpm-workspace.yaml
└── package.json
```

### Data flow

- Web pages fetch the NestJS REST API **server-side only**, using Incremental
  Static Regeneration (`revalidate: 60`). Pages are pre-rendered; content
  changes appear within ~60 seconds without a rebuild.
- API base URL comes from an environment variable (`API_URL`), never exposed to
  the browser.
- Browser-initiated writes (contact form, newsletter signup) POST to Next.js
  route handlers (`/api/contact`, `/api/newsletter`) which proxy to NestJS.
  This keeps the API origin private and avoids a public CORS surface.
- If the API is unreachable at request time, pages serve the last cached ISR
  render; at build time, fetch failures fall back to empty lists with a visible
  "content unavailable" state rather than failing the build.

## Frontend pages (App Router routes)

| Route | Content |
|---|---|
| `/` | Landing page (structure below) |
| `/about` | Company story, values, stats |
| `/services`, `/services/[slug]` | Service list + service detail |
| `/case-studies`, `/case-studies/[slug]` | Case study grid + detail |
| `/blog`, `/blog/[slug]` | Post list + single post |
| `/team`, `/team/[slug]` | Team grid + member profile |
| `/careers`, `/careers/[slug]` | Job list + job detail |
| `/pricing` | Pricing plans |
| `/faq` | FAQ (accordion) |
| `/contact` | Contact page with form |
| `/privacy`, `/terms` | Legal stubs |

### Landing page sections (in order)

1. Sticky header with logo, nav (dropdowns for Company / Services / Work), and
   "Let's Talk" CTA button
2. Hero: large display headline, supporting line, primary CTA
3. Three featured service cards
4. Client logo strip
5. Two numbered service groups (cards numbered 01–03 each, icon + title + blurb
   + link to service detail)
6. Case studies horizontal scroller
7. "How we work" 4-column section (Think Big / Start Small / Ship Fast / Scale)
8. Skills/expertise section with progress indicators
9. Latest blog posts carousel
10. Testimonials carousel
11. Contact form section
12. Footer: newsletter signup, social links, nav columns, legal links, copyright

## Backend (NestJS modules)

### Read-only content modules

`services`, `case-studies`, `posts`, `team`, `jobs`, `pricing`, `faq`,
`testimonials` — each exposes:

- `GET /<resource>` — list
- `GET /<resource>/:slug` — detail (where slugs apply; `pricing`, `faq`,
  `testimonials` are list-only)

### Write modules

- `contact` — `POST /contact` accepting name, email, phone (optional), message.
  Validated with class-validator. Rate-limited with `@nestjs/throttler`.
  Persists to `ContactSubmission`.
- `newsletter` — `POST /newsletter` accepting email. Validated, rate-limited,
  deduplicated. Persists to `NewsletterSubscriber`.

### Admin (dynamic content management)

Content (projects/case studies, blog posts, services, team, jobs, pricing,
FAQ, testimonials) is managed dynamically through an admin panel. ISR means
published changes appear on the site within ~60 seconds.

- `auth` module: JWT login (`POST /auth/login`). Single admin user, credentials
  seeded from environment variables. Passwords hashed with bcrypt.
- Every content module gains protected CRUD endpoints: `POST /<resource>`,
  `PATCH /<resource>/:id`, `DELETE /<resource>/:id`, guarded by a JWT
  `AuthGuard`. Public `GET` routes stay open.
- Admin UI lives in the Next.js app under `/admin`: login page, per-resource
  tables, and create/edit forms. Functional and minimal — plain fields,
  textarea for body content (markdown), no rich text editor in v1.
- `/admin` is excluded from the sitemap, disallowed in `robots.ts`, and marked
  `noindex`.

### Cross-cutting

- Global `ValidationPipe` (whitelist, transform)
- Global exception filter producing consistent JSON error envelopes
- CORS restricted to the web app origin
- `helmet` security headers
- Prisma models mirror the modules above plus `ContactSubmission` and
  `NewsletterSubscriber`
- Seed script populates every content type with realistic, **original** Metaxia
  Solutions copy (no ITSulu text)

## SEO requirements

- Per-page `generateMetadata`: title template (`%s | Metaxia Solutions`),
  description, canonical URL, Open Graph + Twitter cards
- `app/sitemap.ts` — dynamic sitemap including all content slugs fetched from
  the API; `app/robots.ts`
- JSON-LD structured data: `Organization` + `WebSite` in the root layout,
  `Service` on service detail, `Article` on blog posts, `BreadcrumbList` on
  detail pages, `FAQPage` on `/faq`, `JobPosting` on job detail
- Semantic HTML: exactly one `h1` per page, proper landmark elements
- `next/image` for all imagery; fonts via `next/font` (zero layout shift)
- OG images: static branded default site-wide; dynamic `opengraph-image` for
  blog posts

## Design direction

Original visual identity: dark-ink base with a single electric accent color,
large confident display typography, generous whitespace, card-grid rhythm
echoing the reference structure without pixel-copying it. The
`frontend-design` skill is loaded at implementation time to finalize the
direction. Placeholder imagery is generated (gradients / SVG patterns) — no
stock photos, no template assets.

## Error handling

- API: global exception filter → consistent JSON errors with correct status
  codes; validation errors return field-level messages
- Web: `not-found.tsx` and `error.tsx` boundaries; content fetch helpers catch
  failures and return typed empty results so pages degrade gracefully

## Testing

- API: unit tests per content service; e2e tests for contact and newsletter
  validation paths (happy path + rejection cases)
- Web: production build must pass; smoke checks that metadata, sitemap, and
  robots render correctly

## Build order

1. Scaffold monorepo (pnpm workspaces, shared package)
2. Shared types package
3. API: Prisma schema, seed, content endpoints, write endpoints, auth + admin
   CRUD, tests
4. Web foundations: layout, header/footer, design tokens, typography
5. Landing page
6. Inner pages
7. Admin panel (`/admin` login, tables, forms)
8. SEO layer (metadata, sitemap, JSON-LD, OG images)
9. Polish + full verification

## Out of scope (v1)

- Rich text editor, image upload, draft/publish workflow, multiple admin
  users/roles (admin panel phase 2)
- i18n / multi-language
- E-commerce ("Shop" page from the reference template)
- Search
