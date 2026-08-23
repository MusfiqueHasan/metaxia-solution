# Metaxia Solutions Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Metaxia Solutions company website: Next.js 15 marketing site + admin panel, NestJS 11 content/contact API, Tailwind v4, full SEO, in a pnpm monorepo.

**Architecture:** Next.js pages pre-render with ISR (`revalidate: 60`) fetching a NestJS REST API server-side. Browser writes (contact, newsletter, admin) go through Next.js route handlers that proxy to NestJS. Prisma + SQLite in dev (Postgres-portable schema). JWT-protected admin CRUD endpoints power a minimal `/admin` UI.

**Tech Stack:** pnpm workspaces, Next.js 15, React 19, Tailwind CSS v4, NestJS 11, Prisma 6, SQLite, @nestjs/jwt, bcryptjs, class-validator, @nestjs/throttler, helmet, Jest + Supertest.

**Spec:** `docs/superpowers/specs/2026-08-23-metaxia-solutions-site-design.md`

## Global Constraints

- Node >= 20, pnpm >= 9. Package manager is pnpm ONLY (no npm/yarn lockfiles).
- Versions: `next@^15`, `react@^19`, `tailwindcss@^4`, `@nestjs/*@^11`, `prisma@^6`.
- API listens on port **4000**; web on **3000**.
- Env vars — api: `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `WEB_ORIGIN`; web: `API_URL`, `NEXT_PUBLIC_SITE_URL`.
- All content copy must be ORIGINAL Metaxia Solutions text. Never copy ITSulu template text, images, or assets. Reference is structure only.
- Shared types package is named `@metaxia/shared`; import types from it on both sides — never redeclare content interfaces locally.
- SQLite has no array columns: list-like fields are stored as JSON strings and (de)serialized at the API boundary.
- Brand: "Metaxia Solutions". Title template: `%s | Metaxia Solutions`.
- Every UI task: invoke the `frontend-design` skill before writing JSX, and follow the design language defined in Task 9.
- Commit after every task (git repo already initialized, branch `main`).

---

### Task 1: Monorepo scaffold

**Files:**
- Create: `pnpm-workspace.yaml`, `package.json`, `.gitignore`, `.npmrc`, `tsconfig.base.json`, `README.md`

**Interfaces:**
- Produces: workspace layout `apps/*`, `packages/*`; root scripts `dev`, `build`, `test`.

- [ ] **Step 1: Write root files**

`pnpm-workspace.yaml`:
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

`package.json`:
```json
{
  "name": "metaxia-solutions",
  "private": true,
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "build": "pnpm -r build",
    "test": "pnpm -r test"
  },
  "engines": { "node": ">=20" }
}
```

`.npmrc`:
```
shamefully-hoist=false
```

`.gitignore`:
```
node_modules/
.next/
dist/
*.db
*.db-journal
.env
.env.local
.DS_Store
coverage/
```

`tsconfig.base.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true
  }
}
```

`README.md`: one paragraph describing the project, the two apps, and `pnpm install && pnpm dev`.

- [ ] **Step 2: Verify**

Run: `pnpm install`
Expected: succeeds (no packages yet, creates lockfile).

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "chore: scaffold pnpm monorepo"
```

---

### Task 2: Shared types package

**Files:**
- Create: `packages/shared/package.json`, `packages/shared/tsconfig.json`, `packages/shared/src/index.ts`

**Interfaces:**
- Produces (exact exported types, used by BOTH apps):

```ts
export interface Service { id: string; slug: string; title: string; excerpt: string; body: string; icon: string; order: number; }
export interface CaseStudy { id: string; slug: string; title: string; category: string; excerpt: string; body: string; coverGradient: string; order: number; }
export interface Post { id: string; slug: string; title: string; category: string; excerpt: string; body: string; publishedAt: string; }
export interface TeamMember { id: string; slug: string; name: string; role: string; bio: string; linkedinUrl: string | null; order: number; }
export interface Job { id: string; slug: string; title: string; location: string; type: string; body: string; createdAt: string; }
export interface PricingPlan { id: string; name: string; price: number; period: string; description: string; features: string[]; highlighted: boolean; order: number; }
export interface FaqItem { id: string; question: string; answer: string; order: number; }
export interface Testimonial { id: string; quote: string; author: string; company: string; order: number; }
export interface ContactInput { name: string; email: string; phone?: string; message: string; }
export interface NewsletterInput { email: string; }
export interface LoginInput { email: string; password: string; }
export interface LoginResponse { accessToken: string; }
export interface ApiError { statusCode: number; message: string | string[]; error?: string; }
```

- [ ] **Step 1: Write the package**

`packages/shared/package.json`:
```json
{
  "name": "@metaxia/shared",
  "version": "0.0.1",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": { "build": "tsc --noEmit", "test": "tsc --noEmit" }
}
```

`packages/shared/tsconfig.json`:
```json
{ "extends": "../../tsconfig.base.json", "include": ["src"] }
```

`packages/shared/src/index.ts`: the exact interfaces from the Interfaces block above.

- [ ] **Step 2: Verify**

Run: `pnpm --filter @metaxia/shared build`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add @metaxia/shared types package"
```

---

### Task 3: NestJS app scaffold

**Files:**
- Create: `apps/api/package.json`, `apps/api/tsconfig.json`, `apps/api/tsconfig.build.json`, `apps/api/nest-cli.json`, `apps/api/.env.example`, `apps/api/.env`, `apps/api/src/main.ts`, `apps/api/src/app.module.ts`, `apps/api/src/app.controller.ts`, `apps/api/test/jest-e2e.json`, `apps/api/test/health.e2e-spec.ts`

**Interfaces:**
- Produces: bootable Nest app on port 4000; `GET /health` → `{ status: "ok" }`; global ValidationPipe (whitelist+transform), helmet, CORS to `WEB_ORIGIN`, ThrottlerModule (20 req / 60s default).

- [ ] **Step 1: Write package + config**

`apps/api/package.json`:
```json
{
  "name": "@metaxia/api",
  "version": "0.0.1",
  "scripts": {
    "build": "nest build",
    "dev": "nest start --watch",
    "start": "node dist/main.js",
    "test": "jest --config test/jest-e2e.json --runInBand",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "ts-node prisma/seed.ts"
  },
  "dependencies": {
    "@metaxia/shared": "workspace:*",
    "@nestjs/common": "^11.0.0",
    "@nestjs/config": "^4.0.0",
    "@nestjs/core": "^11.0.0",
    "@nestjs/jwt": "^11.0.0",
    "@nestjs/platform-express": "^11.0.0",
    "@nestjs/throttler": "^6.3.0",
    "@prisma/client": "^6.0.0",
    "bcryptjs": "^3.0.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "helmet": "^8.0.0",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^11.0.0",
    "@nestjs/testing": "^11.0.0",
    "@types/bcryptjs": "^2.4.6",
    "@types/express": "^5.0.0",
    "@types/jest": "^29.5.0",
    "@types/node": "^22.0.0",
    "@types/supertest": "^6.0.0",
    "jest": "^29.7.0",
    "prisma": "^6.0.0",
    "supertest": "^7.0.0",
    "ts-jest": "^29.2.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.6.0"
  }
}
```

`apps/api/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "sourceMap": true,
    "strictPropertyInitialization": false
  },
  "include": ["src", "test", "prisma"]
}
```

`apps/api/tsconfig.build.json`:
```json
{ "extends": "./tsconfig.json", "exclude": ["node_modules", "test", "dist", "prisma/seed.ts"] }
```

`apps/api/nest-cli.json`:
```json
{ "collection": "@nestjs/schematics", "sourceRoot": "src" }
```

`apps/api/.env.example` and `apps/api/.env` (same content in dev):
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="dev-only-change-in-production"
ADMIN_EMAIL="admin@metaxia.io"
ADMIN_PASSWORD="metaxia-admin-dev"
WEB_ORIGIN="http://localhost:3000"
PORT=4000
```

- [ ] **Step 2: Write the failing e2e test**

`apps/api/test/jest-e2e.json`:
```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": { "^.+\\.(t|j)s$": "ts-jest" }
}
```

`apps/api/test/health.e2e-spec.ts`:
```ts
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('health', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    await app.init();
  });
  afterAll(async () => app.close());

  it('GET /health returns ok', () =>
    request(app.getHttpServer()).get('/health').expect(200).expect({ status: 'ok' }));
});
```

- [ ] **Step 3: Run test, verify it fails**

Run: `pnpm --filter @metaxia/api test`
Expected: FAIL (AppModule does not exist).

- [ ] **Step 4: Implement app**

`apps/api/src/main.ts`:
```ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({ origin: process.env.WEB_ORIGIN ?? 'http://localhost:3000' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
```

`apps/api/src/app.module.ts`:
```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 20 }]),
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
```

`apps/api/src/app.controller.ts`:
```ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
```

- [ ] **Step 5: Install, run test, verify pass**

Run: `pnpm install && pnpm --filter @metaxia/api test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat(api): scaffold NestJS app with health endpoint"
```

---

### Task 4: Prisma schema, client service, seed

**Files:**
- Create: `apps/api/prisma/schema.prisma`, `apps/api/prisma/seed.ts`, `apps/api/src/prisma/prisma.module.ts`, `apps/api/src/prisma/prisma.service.ts`
- Modify: `apps/api/src/app.module.ts` (import PrismaModule)

**Interfaces:**
- Produces: global `PrismaService` (extends `PrismaClient`, injectable everywhere); models below; seeded dev DB.
- Model names (exact, used by all later API tasks): `Service`, `CaseStudy`, `Post`, `TeamMember`, `Job`, `PricingPlan`, `FaqItem`, `Testimonial`, `ContactSubmission`, `NewsletterSubscriber`, `AdminUser`.

- [ ] **Step 1: Write schema**

`apps/api/prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Service {
  id        String   @id @default(cuid())
  slug      String   @unique
  title     String
  excerpt   String
  body      String
  icon      String
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model CaseStudy {
  id            String   @id @default(cuid())
  slug          String   @unique
  title         String
  category      String
  excerpt       String
  body          String
  coverGradient String
  order         Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Post {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  category    String
  excerpt     String
  body        String
  publishedAt DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model TeamMember {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  role        String
  bio         String
  linkedinUrl String?
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Job {
  id        String   @id @default(cuid())
  slug      String   @unique
  title     String
  location  String
  type      String
  body      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model PricingPlan {
  id           String  @id @default(cuid())
  name         String
  price        Int
  period       String
  description  String
  featuresJson String  // JSON-encoded string[]
  highlighted  Boolean @default(false)
  order        Int     @default(0)
}

model FaqItem {
  id       String @id @default(cuid())
  question String
  answer   String
  order    Int    @default(0)
}

model Testimonial {
  id      String @id @default(cuid())
  quote   String
  author  String
  company String
  order   Int    @default(0)
}

model ContactSubmission {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String?
  message   String
  createdAt DateTime @default(now())
}

model NewsletterSubscriber {
  id        String   @id @default(cuid())
  email     String   @unique
  createdAt DateTime @default(now())
}

model AdminUser {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}
```

- [ ] **Step 2: Write PrismaService**

`apps/api/src/prisma/prisma.service.ts`:
```ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

`apps/api/src/prisma/prisma.module.ts`:
```ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({ providers: [PrismaService], exports: [PrismaService] })
export class PrismaModule {}
```

Add `PrismaModule` to `AppModule` imports.

- [ ] **Step 3: Write seed**

`apps/api/prisma/seed.ts` — seeds ALL content with ORIGINAL copy. Structure:

```ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const db = new PrismaClient();

async function main() {
  // Admin user from env
  const email = process.env.ADMIN_EMAIL ?? 'admin@metaxia.io';
  const password = process.env.ADMIN_PASSWORD ?? 'metaxia-admin-dev';
  await db.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash: await bcrypt.hash(password, 10) },
  });

  // Wipe + reseed content (idempotent dev seed)
  await db.service.deleteMany();
  await db.service.createMany({
    data: [
      { slug: 'cloud-architecture', title: 'Cloud Architecture', icon: 'cloud', order: 1,
        excerpt: 'Design and migration of resilient, cost-aware cloud platforms.',
        body: 'We assess your current infrastructure, design a target architecture on AWS, GCP, or Azure, and run the migration with zero-downtime cutover strategies. Our engagements cover landing zones, IaC baselines, and FinOps guardrails so your platform stays fast and affordable as it grows.' },
      { slug: 'web-development', title: 'Web Development', icon: 'code', order: 2,
        excerpt: 'Product-grade web applications built with modern frameworks.',
        body: '...' },
      // + 4 more: 'data-security', 'mobile-apps', 'ai-integration', 'seo-optimization'
    ],
  });
  // ... same pattern for caseStudy (8), post (6), teamMember (6), job (4),
  // pricingPlan (3), faqItem (8), testimonial (5)
}

main().finally(() => db.$disconnect());
```

Seed content requirements (hard requirements, not suggestions):
- **6 services** with slugs: `cloud-architecture`, `web-development`, `data-security`, `mobile-apps`, `ai-integration`, `seo-optimization`. Each: 1-sentence excerpt, 3-5 sentence body.
- **8 case studies** across categories `Software`, `Design`, `Cloud`, `AI`. `coverGradient` is a CSS gradient string, e.g. `linear-gradient(135deg,#0ea5e9,#6366f1)` — vary hues per study.
- **6 blog posts**, categories from `Engineering`, `Business`, `AI`; `publishedAt` spread over the last 6 months; bodies 4+ paragraphs of plain markdown.
- **6 team members** (varied roles: CEO, CTO, Lead Engineer, Design Lead, PM, DevOps), 2-3 sentence bios, invented names that do not match real public figures.
- **4 jobs** (`type` one of `Full-time`/`Contract`, `location` one of `Remote`/`Dhaka, BD`).
- **3 pricing plans**: Starter 499, Growth 1499, Enterprise 4999; `period: "per month"`; `featuresJson: JSON.stringify([...])` with 4-6 features each; Growth `highlighted: true`.
- **8 FAQ items** about process, pricing, timelines, support, stack, ownership, NDAs, maintenance.
- **5 testimonials** with invented author + company names.
- ALL copy written fresh for Metaxia Solutions. Zero sentences from the ITSulu demo.

- [ ] **Step 4: Migrate + seed + verify**

Run:
```bash
cd apps/api && pnpm prisma migrate dev --name init && pnpm prisma:seed
pnpm exec prisma studio --browser none & sleep 2; kill %1  # optional sanity
node -e "const {PrismaClient}=require('@prisma/client');const d=new PrismaClient();d.service.count().then(c=>{console.log('services',c);process.exit(c===6?0:1)})"
```
Expected: migration applies, seed exits 0, count prints `services 6`.

- [ ] **Step 5: Verify existing tests still pass**

Run: `pnpm --filter @metaxia/api test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat(api): add Prisma schema, service, and seed data"
```

---

### Task 5: Content read endpoints (all 8 resources)

**Files:**
- Create: `apps/api/src/content/content.module.ts`, `apps/api/src/content/content.service.ts`, `apps/api/src/content/content.controller.ts`, `apps/api/src/content/serialize.ts`
- Modify: `apps/api/src/app.module.ts` (import ContentModule)
- Test: `apps/api/test/content.e2e-spec.ts`

**Interfaces:**
- Consumes: `PrismaService` (Task 4).
- Produces public routes (all return shared-package shapes; dates as ISO strings; `PricingPlan.features` as `string[]`):
  - `GET /services`, `GET /services/:slug`
  - `GET /case-studies`, `GET /case-studies/:slug`
  - `GET /posts`, `GET /posts/:slug`
  - `GET /team`, `GET /team/:slug`
  - `GET /jobs`, `GET /jobs/:slug`
  - `GET /pricing`, `GET /faq`, `GET /testimonials`
  - Unknown slug → 404 `NotFoundException`.
- Produces for Task 8: `ContentService` methods `listService/getService/createService/updateService/deleteService` and equivalents per resource (create/update/delete added in Task 8; list/get here).

One module, one controller, one service — resources are thin and identical in shape; splitting into 8 modules adds noise, not isolation. `serialize.ts` owns the DB→DTO mapping (pricing JSON decode, date→ISO).

- [ ] **Step 1: Write the failing e2e test**

`apps/api/test/content.e2e-spec.ts`:
```ts
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('content (read)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    await app.init();
  });
  afterAll(async () => app.close());

  const lists: Array<[string, number]> = [
    ['/services', 6], ['/case-studies', 8], ['/posts', 6], ['/team', 6],
    ['/jobs', 4], ['/pricing', 3], ['/faq', 8], ['/testimonials', 5],
  ];
  it.each(lists)('GET %s returns %i items', async (path, count) => {
    const res = await request(app.getHttpServer()).get(path).expect(200);
    expect(res.body).toHaveLength(count);
  });

  it('GET /services/:slug returns one service', async () => {
    const res = await request(app.getHttpServer()).get('/services/cloud-architecture').expect(200);
    expect(res.body.title).toBe('Cloud Architecture');
  });

  it('GET /services/unknown returns 404', () =>
    request(app.getHttpServer()).get('/services/nope').expect(404));

  it('pricing features decodes to array', async () => {
    const res = await request(app.getHttpServer()).get('/pricing').expect(200);
    expect(Array.isArray(res.body[0].features)).toBe(true);
  });
});
```

Note: e2e tests run against the seeded dev DB (`DATABASE_URL` from `.env`). Test setup at top of file: `process.env.DATABASE_URL = 'file:./dev.db';` if needed. Tests are read-only against seed data here.

- [ ] **Step 2: Run test, verify it fails**

Run: `pnpm --filter @metaxia/api test`
Expected: content spec FAILS with 404s (routes missing).

- [ ] **Step 3: Implement serializers**

`apps/api/src/content/serialize.ts`:
```ts
import type { PricingPlan as DbPricingPlan, Post as DbPost, Job as DbJob } from '@prisma/client';
import type { PricingPlan, Post, Job } from '@metaxia/shared';

export const toPricingPlan = (p: DbPricingPlan): PricingPlan => ({
  id: p.id, name: p.name, price: p.price, period: p.period,
  description: p.description, features: JSON.parse(p.featuresJson) as string[],
  highlighted: p.highlighted, order: p.order,
});

export const toPost = (p: DbPost): Post => ({
  id: p.id, slug: p.slug, title: p.title, category: p.category,
  excerpt: p.excerpt, body: p.body, publishedAt: p.publishedAt.toISOString(),
});

export const toJob = (j: DbJob): Job => ({
  id: j.id, slug: j.slug, title: j.title, location: j.location,
  type: j.type, body: j.body, createdAt: j.createdAt.toISOString(),
});
```
(Other models serialize cleanly via JSON; controller strips `createdAt`/`updatedAt` from Prisma results only where the shared type omits them — acceptable to pass through extra fields EXCEPT `featuresJson`, which must never leak.)

- [ ] **Step 4: Implement service + controller**

`apps/api/src/content/content.service.ts`:
```ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toPricingPlan, toPost, toJob } from './serialize';

@Injectable()
export class ContentService {
  constructor(private db: PrismaService) {}

  listServices() { return this.db.service.findMany({ orderBy: { order: 'asc' } }); }
  async getService(slug: string) {
    const s = await this.db.service.findUnique({ where: { slug } });
    if (!s) throw new NotFoundException('service not found');
    return s;
  }

  listCaseStudies() { return this.db.caseStudy.findMany({ orderBy: { order: 'asc' } }); }
  async getCaseStudy(slug: string) {
    const c = await this.db.caseStudy.findUnique({ where: { slug } });
    if (!c) throw new NotFoundException('case study not found');
    return c;
  }

  async listPosts() {
    return (await this.db.post.findMany({ orderBy: { publishedAt: 'desc' } })).map(toPost);
  }
  async getPost(slug: string) {
    const p = await this.db.post.findUnique({ where: { slug } });
    if (!p) throw new NotFoundException('post not found');
    return toPost(p);
  }

  listTeam() { return this.db.teamMember.findMany({ orderBy: { order: 'asc' } }); }
  async getTeamMember(slug: string) {
    const t = await this.db.teamMember.findUnique({ where: { slug } });
    if (!t) throw new NotFoundException('team member not found');
    return t;
  }

  async listJobs() {
    return (await this.db.job.findMany({ orderBy: { createdAt: 'desc' } })).map(toJob);
  }
  async getJob(slug: string) {
    const j = await this.db.job.findUnique({ where: { slug } });
    if (!j) throw new NotFoundException('job not found');
    return toJob(j);
  }

  async listPricing() {
    return (await this.db.pricingPlan.findMany({ orderBy: { order: 'asc' } })).map(toPricingPlan);
  }
  listFaq() { return this.db.faqItem.findMany({ orderBy: { order: 'asc' } }); }
  listTestimonials() { return this.db.testimonial.findMany({ orderBy: { order: 'asc' } }); }
}
```

`apps/api/src/content/content.controller.ts`:
```ts
import { Controller, Get, Param } from '@nestjs/common';
import { ContentService } from './content.service';

@Controller()
export class ContentController {
  constructor(private content: ContentService) {}

  @Get('services') services() { return this.content.listServices(); }
  @Get('services/:slug') service(@Param('slug') slug: string) { return this.content.getService(slug); }

  @Get('case-studies') caseStudies() { return this.content.listCaseStudies(); }
  @Get('case-studies/:slug') caseStudy(@Param('slug') slug: string) { return this.content.getCaseStudy(slug); }

  @Get('posts') posts() { return this.content.listPosts(); }
  @Get('posts/:slug') post(@Param('slug') slug: string) { return this.content.getPost(slug); }

  @Get('team') team() { return this.content.listTeam(); }
  @Get('team/:slug') teamMember(@Param('slug') slug: string) { return this.content.getTeamMember(slug); }

  @Get('jobs') jobs() { return this.content.listJobs(); }
  @Get('jobs/:slug') job(@Param('slug') slug: string) { return this.content.getJob(slug); }

  @Get('pricing') pricing() { return this.content.listPricing(); }
  @Get('faq') faq() { return this.content.listFaq(); }
  @Get('testimonials') testimonials() { return this.content.listTestimonials(); }
}
```

`apps/api/src/content/content.module.ts`:
```ts
import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';

@Module({ controllers: [ContentController], providers: [ContentService], exports: [ContentService] })
export class ContentModule {}
```

Import `ContentModule` in `AppModule`.

- [ ] **Step 5: Run tests, verify pass**

Run: `pnpm --filter @metaxia/api test`
Expected: PASS (health + content).

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat(api): add public content read endpoints"
```

---

### Task 6: Contact + newsletter write endpoints

**Files:**
- Create: `apps/api/src/inbound/inbound.module.ts`, `apps/api/src/inbound/inbound.controller.ts`, `apps/api/src/inbound/inbound.service.ts`, `apps/api/src/inbound/dto.ts`
- Modify: `apps/api/src/app.module.ts`
- Test: `apps/api/test/inbound.e2e-spec.ts`

**Interfaces:**
- Consumes: `PrismaService`.
- Produces: `POST /contact` (201 `{ ok: true }`), `POST /newsletter` (201 `{ ok: true }`, duplicate email also `{ ok: true }` — no enumeration). Validation errors → 400 with field messages. Both throttled at 5 req / 60s.

- [ ] **Step 1: Write the failing e2e test**

`apps/api/test/inbound.e2e-spec.ts`:
```ts
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('inbound', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });
  afterAll(async () => app.close());

  it('POST /contact accepts valid submission', () =>
    request(app.getHttpServer())
      .post('/contact')
      .send({ name: 'Test User', email: 'test@example.com', message: 'Hello there, we need a website.' })
      .expect(201)
      .expect({ ok: true }));

  it('POST /contact rejects bad email', async () => {
    const res = await request(app.getHttpServer())
      .post('/contact')
      .send({ name: 'X', email: 'not-an-email', message: 'hi' })
      .expect(400);
    expect(JSON.stringify(res.body.message)).toContain('email');
  });

  it('POST /contact rejects missing message', () =>
    request(app.getHttpServer())
      .post('/contact')
      .send({ name: 'X', email: 'a@b.co' })
      .expect(400));

  it('POST /newsletter accepts and dedupes', async () => {
    await request(app.getHttpServer()).post('/newsletter').send({ email: 'dup@example.com' }).expect(201);
    await request(app.getHttpServer()).post('/newsletter').send({ email: 'dup@example.com' }).expect(201);
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `pnpm --filter @metaxia/api test`
Expected: inbound spec FAILS (404).

- [ ] **Step 3: Implement**

`apps/api/src/inbound/dto.ts`:
```ts
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class ContactDto {
  @IsString() @IsNotEmpty() @MaxLength(120) name: string;
  @IsEmail() email: string;
  @IsOptional() @IsString() @MaxLength(40) phone?: string;
  @IsString() @IsNotEmpty() @MaxLength(5000) message: string;
}

export class NewsletterDto {
  @IsEmail() email: string;
}
```

`apps/api/src/inbound/inbound.service.ts`:
```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContactDto, NewsletterDto } from './dto';

@Injectable()
export class InboundService {
  constructor(private db: PrismaService) {}

  async contact(dto: ContactDto) {
    await this.db.contactSubmission.create({ data: dto });
    return { ok: true };
  }

  async newsletter(dto: NewsletterDto) {
    await this.db.newsletterSubscriber.upsert({
      where: { email: dto.email },
      update: {},
      create: { email: dto.email },
    });
    return { ok: true };
  }
}
```

`apps/api/src/inbound/inbound.controller.ts`:
```ts
import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { InboundService } from './inbound.service';
import { ContactDto, NewsletterDto } from './dto';

@Controller()
export class InboundController {
  constructor(private inbound: InboundService) {}

  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @Post('contact')
  contact(@Body() dto: ContactDto) { return this.inbound.contact(dto); }

  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @Post('newsletter')
  newsletter(@Body() dto: NewsletterDto) { return this.inbound.newsletter(dto); }
}
```

`apps/api/src/inbound/inbound.module.ts`:
```ts
import { Module } from '@nestjs/common';
import { InboundController } from './inbound.controller';
import { InboundService } from './inbound.service';

@Module({ controllers: [InboundController], providers: [InboundService] })
export class InboundModule {}
```

Import `InboundModule` in `AppModule`.

- [ ] **Step 4: Run tests, verify pass**

Run: `pnpm --filter @metaxia/api test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(api): add contact and newsletter endpoints"
```

---

### Task 7: Auth module (JWT login + guard)

**Files:**
- Create: `apps/api/src/auth/auth.module.ts`, `apps/api/src/auth/auth.controller.ts`, `apps/api/src/auth/auth.service.ts`, `apps/api/src/auth/admin.guard.ts`, `apps/api/src/auth/dto.ts`
- Modify: `apps/api/src/app.module.ts`
- Test: `apps/api/test/auth.e2e-spec.ts`

**Interfaces:**
- Consumes: `PrismaService`, seeded `AdminUser` (Task 4), `JWT_SECRET` env.
- Produces: `POST /auth/login` `{ email, password }` → 200 `{ accessToken }` | 401. Exported `AdminGuard` (class) for Task 8 — reads `Authorization: Bearer <jwt>`, verifies, 401 on failure. `AuthModule` exports `AdminGuard` and registers `JwtModule` globally (expiry `12h`).

- [ ] **Step 1: Write the failing e2e test**

`apps/api/test/auth.e2e-spec.ts`:
```ts
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('auth', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    await app.init();
  });
  afterAll(async () => app.close());

  it('login with seeded credentials returns token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: process.env.ADMIN_EMAIL ?? 'admin@metaxia.io', password: process.env.ADMIN_PASSWORD ?? 'metaxia-admin-dev' })
      .expect(200);
    expect(typeof res.body.accessToken).toBe('string');
  });

  it('login with wrong password returns 401', () =>
    request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@metaxia.io', password: 'wrong' })
      .expect(401));
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `pnpm --filter @metaxia/api test`
Expected: auth spec FAILS (404).

- [ ] **Step 3: Implement**

`apps/api/src/auth/dto.ts`:
```ts
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail() email: string;
  @IsString() @IsNotEmpty() password: string;
}
```

`apps/api/src/auth/auth.service.ts`:
```ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private db: PrismaService, private jwt: JwtService) {}

  async login(dto: LoginDto) {
    const user = await this.db.adminUser.findUnique({ where: { email: dto.email } });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('invalid credentials');
    }
    return { accessToken: await this.jwt.signAsync({ sub: user.id, email: user.email }) };
  }
}
```

`apps/api/src/auth/admin.guard.ts`:
```ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const token = (req.headers.authorization ?? '').replace(/^Bearer /, '');
    if (!token) throw new UnauthorizedException();
    try {
      req.user = await this.jwt.verifyAsync(token);
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
```

`apps/api/src/auth/auth.controller.ts`:
```ts
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @HttpCode(200)
  @Post('login')
  login(@Body() dto: LoginDto) { return this.auth.login(dto); }
}
```

`apps/api/src/auth/auth.module.ts`:
```ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminGuard } from './admin.guard';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? 'dev-only-change-in-production',
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AdminGuard],
  exports: [AdminGuard],
})
export class AuthModule {}
```

Import `AuthModule` in `AppModule`.

- [ ] **Step 4: Run tests, verify pass**

Run: `pnpm --filter @metaxia/api test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(api): add JWT auth with admin guard"
```

---

### Task 8: Admin CRUD endpoints

**Files:**
- Create: `apps/api/src/content/admin-content.controller.ts`, `apps/api/src/content/dto.ts`, `apps/api/src/inbound/admin-inbound.controller.ts`
- Modify: `apps/api/src/content/content.service.ts` (add mutations), `apps/api/src/content/content.module.ts`, `apps/api/src/inbound/inbound.module.ts`
- Test: `apps/api/test/admin.e2e-spec.ts`

**Interfaces:**
- Consumes: `AdminGuard` (Task 7), `ContentService` (Task 5).
- Produces (ALL guarded by `@UseGuards(AdminGuard)`):
  - Per resource in {`services`, `case-studies`, `posts`, `team`, `jobs`}: `POST /admin/<resource>`, `PATCH /admin/<resource>/:id`, `DELETE /admin/<resource>/:id`
  - Per resource in {`pricing`, `faq`, `testimonials`}: same three routes
  - `GET /admin/contact-submissions`, `GET /admin/newsletter-subscribers` (read inbox)
  - No token / bad token → 401. Unknown id on PATCH/DELETE → 404.
- Create DTO classes (exact names): `CreateServiceDto`, `CreateCaseStudyDto`, `CreatePostDto`, `CreateTeamMemberDto`, `CreateJobDto`, `CreatePricingPlanDto`, `CreateFaqItemDto`, `CreateTestimonialDto` — fields mirror shared interfaces minus `id`; pricing takes `features: string[]` (service serializes to `featuresJson`). Update DTOs via `PartialType(CreateXDto)` from `@nestjs/mapped-types`.

- [ ] **Step 1: Write the failing e2e test**

`apps/api/test/admin.e2e-spec.ts`:
```ts
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('admin crud', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: process.env.ADMIN_EMAIL ?? 'admin@metaxia.io', password: process.env.ADMIN_PASSWORD ?? 'metaxia-admin-dev' });
    token = res.body.accessToken;
  });
  afterAll(async () => app.close());

  it('rejects unauthenticated create', () =>
    request(app.getHttpServer()).post('/admin/services').send({}).expect(401));

  it('creates, updates, deletes a service', async () => {
    const created = await request(app.getHttpServer())
      .post('/admin/services')
      .set('Authorization', `Bearer ${token}`)
      .send({ slug: 'test-svc', title: 'Test Svc', excerpt: 'x', body: 'y', icon: 'code', order: 99 })
      .expect(201);
    const id = created.body.id;

    await request(app.getHttpServer())
      .patch(`/admin/services/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Renamed Svc' })
      .expect(200);

    const fetched = await request(app.getHttpServer()).get('/services/test-svc').expect(200);
    expect(fetched.body.title).toBe('Renamed Svc');

    await request(app.getHttpServer())
      .delete(`/admin/services/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer()).get('/services/test-svc').expect(404);
  });

  it('creates and deletes a pricing plan with features array', async () => {
    const created = await request(app.getHttpServer())
      .post('/admin/pricing')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Temp', price: 1, period: 'per month', description: 'd', features: ['a', 'b'], highlighted: false, order: 99 })
      .expect(201);
    expect(created.body.features).toEqual(['a', 'b']);
    await request(app.getHttpServer())
      .delete(`/admin/pricing/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('404 on unknown id', () =>
    request(app.getHttpServer())
      .patch('/admin/services/nope')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'x' })
      .expect(404));

  it('reads contact submissions inbox', async () => {
    const res = await request(app.getHttpServer())
      .get('/admin/contact-submissions')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `pnpm --filter @metaxia/api test`
Expected: admin spec FAILS (404 / 401 mismatches).

- [ ] **Step 3: Implement DTOs**

Add dependency: `pnpm --filter @metaxia/api add @nestjs/mapped-types`.

`apps/api/src/content/dto.ts` — every Create DTO in full with class-validator decorators (`@IsString() @IsNotEmpty()` on required strings, `@IsInt()` on ints, `@IsBoolean()`, `@IsArray() @IsString({ each: true })` for `features`, `@IsOptional()` where the shared type is nullable/optional, `@IsISO8601()` for `publishedAt` on posts with `@IsOptional()`), plus `export class UpdateServiceDto extends PartialType(CreateServiceDto) {}` etc. for all 8.

- [ ] **Step 4: Add mutations to ContentService**

Add to `content.service.ts` (pattern per resource; pricing shown because it serializes):
```ts
// services
createService(data: CreateServiceDto) { return this.db.service.create({ data }); }
async updateService(id: string, data: UpdateServiceDto) {
  await this.mustExist(this.db.service, id);
  return this.db.service.update({ where: { id }, data });
}
async deleteService(id: string) {
  await this.mustExist(this.db.service, id);
  return this.db.service.delete({ where: { id } });
}

// pricing (JSON boundary)
async createPricingPlan({ features, ...rest }: CreatePricingPlanDto) {
  return toPricingPlan(await this.db.pricingPlan.create({ data: { ...rest, featuresJson: JSON.stringify(features) } }));
}
async updatePricingPlan(id: string, { features, ...rest }: UpdatePricingPlanDto) {
  await this.mustExist(this.db.pricingPlan, id);
  return toPricingPlan(await this.db.pricingPlan.update({
    where: { id },
    data: { ...rest, ...(features ? { featuresJson: JSON.stringify(features) } : {}) },
  }));
}

private async mustExist(delegate: { findUnique(args: { where: { id: string } }): Promise<unknown> }, id: string) {
  if (!(await delegate.findUnique({ where: { id } }))) throw new NotFoundException();
}
```
Repeat create/update/delete for: caseStudy, post (parse `publishedAt` string → `new Date()` when present), teamMember, job, faqItem, testimonial. Posts return through `toPost`, jobs through `toJob`.

- [ ] **Step 5: Implement admin controllers**

`apps/api/src/content/admin-content.controller.ts`:
```ts
import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { ContentService } from './content.service';
import {
  CreateServiceDto, UpdateServiceDto, CreateCaseStudyDto, UpdateCaseStudyDto,
  CreatePostDto, UpdatePostDto, CreateTeamMemberDto, UpdateTeamMemberDto,
  CreateJobDto, UpdateJobDto, CreatePricingPlanDto, UpdatePricingPlanDto,
  CreateFaqItemDto, UpdateFaqItemDto, CreateTestimonialDto, UpdateTestimonialDto,
} from './dto';

@UseGuards(AdminGuard)
@Controller('admin')
export class AdminContentController {
  constructor(private content: ContentService) {}

  @Post('services') createService(@Body() d: CreateServiceDto) { return this.content.createService(d); }
  @Patch('services/:id') updateService(@Param('id') id: string, @Body() d: UpdateServiceDto) { return this.content.updateService(id, d); }
  @Delete('services/:id') deleteService(@Param('id') id: string) { return this.content.deleteService(id); }

  // ...identical trio for case-studies, posts, team, jobs, pricing, faq, testimonials,
  // each wired to its ContentService methods with its own DTO pair. Write all of them out.
}
```

`apps/api/src/inbound/admin-inbound.controller.ts`:
```ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { PrismaService } from '../prisma/prisma.service';

@UseGuards(AdminGuard)
@Controller('admin')
export class AdminInboundController {
  constructor(private db: PrismaService) {}

  @Get('contact-submissions')
  contactSubmissions() { return this.db.contactSubmission.findMany({ orderBy: { createdAt: 'desc' } }); }

  @Get('newsletter-subscribers')
  newsletterSubscribers() { return this.db.newsletterSubscriber.findMany({ orderBy: { createdAt: 'desc' } }); }
}
```

Register controllers in their modules; `ContentModule` must import `AuthModule` (for `AdminGuard`'s `JwtService` — JwtModule is global, but import keeps the provider) — add `AdminGuard` to each module's providers or import `AuthModule` which exports it.

- [ ] **Step 6: Run tests, verify pass**

Run: `pnpm --filter @metaxia/api test`
Expected: PASS (all suites). Re-run seed afterwards if tests mutated dev data: `pnpm --filter @metaxia/api prisma:seed`.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat(api): add JWT-guarded admin CRUD endpoints"
```

---

### Task 9: Next.js scaffold, design system, header/footer, API client

**Files:**
- Create: `apps/web/package.json`, `apps/web/tsconfig.json`, `apps/web/next.config.ts`, `apps/web/postcss.config.mjs`, `apps/web/.env.local`, `apps/web/.env.example`, `apps/web/src/app/globals.css`, `apps/web/src/app/layout.tsx`, `apps/web/src/app/page.tsx` (placeholder), `apps/web/src/app/not-found.tsx`, `apps/web/src/app/error.tsx`, `apps/web/src/components/site-header.tsx`, `apps/web/src/components/site-footer.tsx`, `apps/web/src/components/container.tsx`, `apps/web/src/components/button.tsx`, `apps/web/src/components/section-heading.tsx`, `apps/web/src/lib/api.ts`, `apps/web/src/lib/site.ts`

**Interfaces:**
- Consumes: running API on :4000 (graceful fallback if down), `@metaxia/shared` types.
- Produces:
  - `lib/site.ts`: `export const site = { name: 'Metaxia Solutions', url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000', description: 'Technology and IT solutions partner for ambitious enterprises.' }`
  - `lib/api.ts` exact exports (all later page tasks consume these):
    `getServices(): Promise<Service[]>`, `getService(slug): Promise<Service | null>`, `getCaseStudies()`, `getCaseStudy(slug)`, `getPosts()`, `getPost(slug)`, `getTeam()`, `getTeamMember(slug)`, `getJobs()`, `getJob(slug)`, `getPricing()`, `getFaq()`, `getTestimonials()` — lists fall back to `[]`, details to `null`, all with `next: { revalidate: 60 }`.
  - Components: `<Container>` (max-w wrapper), `<Button href variant="primary"|"ghost">`, `<SectionHeading eyebrow title lede?>`, `<SiteHeader>`, `<SiteFooter>`.
  - Design tokens in `globals.css` `@theme` (exact names): `--color-ink`, `--color-ink-soft`, `--color-surface`, `--color-surface-alt`, `--color-accent`, `--color-accent-soft`, `--font-display`, `--font-body`.

**BEFORE writing any JSX in this task: invoke the `frontend-design` skill.** Design language (binding for all UI tasks): near-black ink `#0B0F1A` surfaces for hero/footer, off-white `#F7F8FB` content surfaces, one electric accent `#4F46E5`-family (pick final hue during design pass), display font via `next/font/google` (a characterful grotesk — e.g. "Space Grotesk"), body font ("Inter" or similar), oversized display headlines, generous section padding (`py-24`+), card grids with 1px hairline borders rather than drop shadows.

- [ ] **Step 1: Write configs**

`apps/web/package.json`:
```json
{
  "name": "@metaxia/web",
  "version": "0.0.1",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "next build"
  },
  "dependencies": {
    "@metaxia/shared": "workspace:*",
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.6.0"
  }
}
```

`apps/web/postcss.config.mjs`:
```js
export default { plugins: { "@tailwindcss/postcss": {} } };
```

`apps/web/next.config.ts`:
```ts
import type { NextConfig } from 'next';
const config: NextConfig = {};
export default config;
```

`apps/web/tsconfig.json`: standard Next 15 tsconfig (jsx `preserve`, `moduleResolution: "bundler"`, plugin `next`, paths `"@/*": ["./src/*"]`, include `next-env.d.ts`, `**/*.ts(x)`, `.next/types/**/*.ts`).

`apps/web/.env.local` + `.env.example`:
```
API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Step 2: globals.css with tokens**

```css
@import "tailwindcss";

@theme {
  --color-ink: #0b0f1a;
  --color-ink-soft: #4b5163;
  --color-surface: #f7f8fb;
  --color-surface-alt: #ffffff;
  --color-accent: #4f46e5;
  --color-accent-soft: #eef2ff;
  --font-display: var(--font-space-grotesk);
  --font-body: var(--font-inter);
}

body {
  background: var(--color-surface);
  color: var(--color-ink);
  font-family: var(--font-body);
}
```

- [ ] **Step 3: lib/site.ts and lib/api.ts**

`apps/web/src/lib/api.ts`:
```ts
import type {
  Service, CaseStudy, Post, TeamMember, Job, PricingPlan, FaqItem, Testimonial,
} from '@metaxia/shared';

const API_URL = process.env.API_URL ?? 'http://localhost:4000';

async function get<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 60 } });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export const getServices = () => get<Service[]>('/services', []);
export const getService = (slug: string) => get<Service | null>(`/services/${slug}`, null);
export const getCaseStudies = () => get<CaseStudy[]>('/case-studies', []);
export const getCaseStudy = (slug: string) => get<CaseStudy | null>(`/case-studies/${slug}`, null);
export const getPosts = () => get<Post[]>('/posts', []);
export const getPost = (slug: string) => get<Post | null>(`/posts/${slug}`, null);
export const getTeam = () => get<TeamMember[]>('/team', []);
export const getTeamMember = (slug: string) => get<TeamMember | null>(`/team/${slug}`, null);
export const getJobs = () => get<Job[]>('/jobs', []);
export const getJob = (slug: string) => get<Job | null>(`/jobs/${slug}`, null);
export const getPricing = () => get<PricingPlan[]>('/pricing', []);
export const getFaq = () => get<FaqItem[]>('/faq', []);
export const getTestimonials = () => get<Testimonial[]>('/testimonials', []);
```

- [ ] **Step 4: Layout + chrome components**

`layout.tsx`: loads Space Grotesk + Inter via `next/font/google` with CSS variables `--font-space-grotesk` / `--font-inter`, sets `metadata` export:
```ts
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Metaxia Solutions — Technology & IT Solutions', template: '%s | Metaxia Solutions' },
  description: site.description,
  openGraph: { siteName: 'Metaxia Solutions', type: 'website' },
};
```
Renders `<SiteHeader />`, `{children}`, `<SiteFooter />`.

`site-header.tsx`: server component; sticky, ink background. Logo wordmark "Metaxia" (text, accent dot). Nav links: Services, Work (→ /case-studies), About, Blog, Pricing, Contact — desktop row + mobile `<details>`-based disclosure menu (no JS lib). CTA button "Let's Talk" → /contact.

`site-footer.tsx`: ink background; 4 columns (brand + blurb, Company links [About, Team, Careers, FAQ], Resources [Blog, Case Studies, Pricing, Contact], Newsletter form — form is a client component placeholder wired in Task 13, render disabled input for now); bottom row: © year, Privacy, Terms.

`container.tsx`, `button.tsx`, `section-heading.tsx`: small typed components per Interfaces block.

`page.tsx` placeholder: `<main><Container><h1>Metaxia Solutions</h1></Container></main>` (replaced in Task 10).

`not-found.tsx` / `error.tsx`: branded minimal screens with link home. `error.tsx` is `'use client'`.

- [ ] **Step 5: Verify build**

Run: `pnpm install && pnpm --filter @metaxia/web build`
Expected: build succeeds. Then `pnpm --filter @metaxia/web dev &`, `curl -s localhost:3000 | grep -i metaxia`, kill dev server.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat(web): scaffold Next.js app with design system and API client"
```

---

### Task 10: Landing page

**Files:**
- Create: `apps/web/src/components/home/hero.tsx`, `featured-services.tsx`, `logo-strip.tsx`, `service-groups.tsx`, `case-study-scroller.tsx`, `approach.tsx`, `skills.tsx`, `blog-preview.tsx`, `testimonials.tsx`, `contact-cta.tsx` (all under `apps/web/src/components/home/`)
- Modify: `apps/web/src/app/page.tsx`

**Interfaces:**
- Consumes: `getServices()`, `getCaseStudies()`, `getPosts()`, `getTestimonials()` from `lib/api`; chrome components from Task 9.
- Produces: complete `/` route. `page.tsx` fetches all data in parallel (`Promise.all`) and passes props down; section components are presentational (server components; scrollers use CSS `overflow-x-auto` + `snap-x`, NOT a carousel lib).

**Invoke the `frontend-design` skill before writing JSX.**

Section spec (structure from reference, execution original):
1. `<Hero>`: full-bleed ink background, eyebrow "The Next Gen", display headline "We build technology that moves enterprises forward" (final copy at design pass, same intent), sub-line, primary CTA "Let's Talk" → /contact, ghost CTA "Our services" → /services.
2. `<FeaturedServices services={first 3}>`: 3-card grid, icon, title, excerpt, link to detail.
3. `<LogoStrip>`: 6 inline-SVG wordmarks of invented client names (e.g. "Northwind Labs", "Helios Bank") — grayscale, opacity hover.
4. `<ServiceGroups services={remaining}>`: two columns × three numbered cards (01–03), icon + title + excerpt + arrow link.
5. `<CaseStudyScroller items>`: horizontal snap scroller of cards — `coverGradient` as card background, category chip, title, excerpt, link.
6. `<Approach>`: static 4-col grid: Think Big / Start Small / Ship Fast / Scale Smart, each 2 sentences (original copy).
7. `<Skills>`: static list of 6 capabilities with percentage bars (CSS width, accent fill): Web Development 90, Cloud 85, Security 80, AI Integration 75, Mobile 70, Design 65. Bars are `<div role="progressbar" aria-valuenow=...>`.
8. `<BlogPreview posts={first 3}>`: 3-card grid with category, date (formatted `en-US` long), title, excerpt.
9. `<Testimonials items>`: snap scroller of quote cards (quote, author, company).
10. `<ContactCta>`: dark band, headline + "Let's Talk" button (full form lives on /contact).

Icons: single `apps/web/src/components/icon.tsx` mapping `icon` string keys (`cloud`, `code`, `shield`, `phone`, `spark`, `chart`) to inline SVG paths — create it in this task.

- [ ] **Step 1: Build sections + assemble page.tsx** (code per spec above)
- [ ] **Step 2: Verify**

Run: API running (`pnpm --filter @metaxia/api dev &`), then `pnpm --filter @metaxia/web build`
Expected: build passes; `/` prerenders with real seed content (grep output HTML for a seeded service title).

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(web): build landing page"
```

---

### Task 11: About, Services, Case Studies pages

**Files:**
- Create: `apps/web/src/app/about/page.tsx`, `apps/web/src/app/services/page.tsx`, `apps/web/src/app/services/[slug]/page.tsx`, `apps/web/src/app/case-studies/page.tsx`, `apps/web/src/app/case-studies/[slug]/page.tsx`, `apps/web/src/components/page-hero.tsx`, `apps/web/src/components/markdown.tsx`

**Interfaces:**
- Consumes: `lib/api` getters, chrome + home components (`CaseStudyScroller` reused on service detail), `Icon`.
- Produces: `<PageHero eyebrow title lede?>` (shared inner-page header band) and `<Markdown body>` (renders seeded markdown bodies — paragraphs and `##` headings only; simple split-based renderer, NO markdown dependency:
  ```tsx
  export function Markdown({ body }: { body: string }) {
    return (
      <div className="space-y-5">
        {body.split(/\n\n+/).map((block, i) =>
          block.startsWith('## ')
            ? <h2 key={i} className="font-display text-2xl mt-10">{block.slice(3)}</h2>
            : <p key={i} className="text-ink-soft leading-relaxed">{block}</p>
        )}
      </div>
    );
  }
  ```
  ).
- Detail pages: `generateStaticParams` from list endpoints, `dynamicParams = true`, unknown slug → `notFound()`.

Page content:
- `/about`: PageHero; story section (2-3 original paragraphs); stats row (4 stat tiles: projects shipped, years, clients, team size — static numbers); values grid (4 values); reuse `<Approach>`.
- `/services`: PageHero; full service card grid (all 6).
- `/services/[slug]`: PageHero from service title/excerpt; `<Markdown body>`; "Other services" 3-card row; ContactCta.
- `/case-studies`: PageHero; 2-col grid of gradient cover cards.
- `/case-studies/[slug]`: gradient hero band, category chip, `<Markdown>`, prev/next links, ContactCta.

**Invoke `frontend-design` skill before JSX.**

- [ ] **Step 1: Build shared components + 5 pages**
- [ ] **Step 2: Verify**

Run: `pnpm --filter @metaxia/web build`
Expected: passes; routes listed in build output include `/about`, `/services`, `/services/[slug]`, `/case-studies`, `/case-studies/[slug]`.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(web): add about, services, and case study pages"
```

---

### Task 12: Blog, Team, Careers, Pricing, FAQ, legal pages

**Files:**
- Create: `apps/web/src/app/blog/page.tsx`, `apps/web/src/app/blog/[slug]/page.tsx`, `apps/web/src/app/team/page.tsx`, `apps/web/src/app/team/[slug]/page.tsx`, `apps/web/src/app/careers/page.tsx`, `apps/web/src/app/careers/[slug]/page.tsx`, `apps/web/src/app/pricing/page.tsx`, `apps/web/src/app/faq/page.tsx`, `apps/web/src/app/privacy/page.tsx`, `apps/web/src/app/terms/page.tsx`

**Interfaces:**
- Consumes: `lib/api` getters, `PageHero`, `Markdown`, `ContactCta`, `Button`.
- Produces: all remaining public routes; detail pages use `generateStaticParams` + `notFound()` like Task 11.

Page content:
- `/blog`: PageHero; post grid (category chip, formatted date, title, excerpt).
- `/blog/[slug]`: article layout — category, date, h1, `<Markdown>`, "More from the blog" 3-card row.
- `/team`: grid of member cards — initials avatar (two letters on accent-soft circle; NO photos), name, role.
- `/team/[slug]`: profile — avatar, name, role, bio paragraphs, LinkedIn link if present.
- `/careers`: intro blurb + job list rows (title, location chip, type chip, arrow) linking to detail.
- `/careers/[slug]`: job header (title, location, type), `<Markdown body>`, "Apply" button → `/contact`.
- `/pricing`: 3 plan cards from API — name, `$`+price, period, description, feature checklist, CTA; `highlighted` plan gets accent border + "Most popular" tag.
- `/faq`: `<details>/<summary>` accordion list from API (no JS).
- `/privacy`, `/terms`: PageHero + static original legal-stub prose (clearly generic, 4-6 sections each).

**Invoke `frontend-design` skill before JSX.**

- [ ] **Step 1: Build all 10 pages**
- [ ] **Step 2: Verify**

Run: `pnpm --filter @metaxia/web build`
Expected: passes with all routes present.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(web): add blog, team, careers, pricing, faq, and legal pages"
```

---

### Task 13: Contact page + form proxy route handlers + newsletter form

**Files:**
- Create: `apps/web/src/app/contact/page.tsx`, `apps/web/src/app/api/contact/route.ts`, `apps/web/src/app/api/newsletter/route.ts`, `apps/web/src/components/contact-form.tsx`, `apps/web/src/components/newsletter-form.tsx`
- Modify: `apps/web/src/components/site-footer.tsx` (mount real `<NewsletterForm />`)

**Interfaces:**
- Consumes: API `POST /contact`, `POST /newsletter` (Task 6).
- Produces: `POST /api/contact` and `POST /api/newsletter` route handlers proxying JSON to `${API_URL}` and passing through status + body; client components `<ContactForm />`, `<NewsletterForm />`.

- [ ] **Step 1: Route handlers**

`apps/web/src/app/api/contact/route.ts`:
```ts
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL ?? 'http://localhost:4000';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ message: 'invalid body' }, { status: 400 });
  try {
    const res = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
  } catch {
    return NextResponse.json({ message: 'service unavailable' }, { status: 503 });
  }
}
```
`api/newsletter/route.ts`: identical shape targeting `/newsletter`.

- [ ] **Step 2: Forms**

`contact-form.tsx` (`'use client'`): controlled fields name/email/phone/message; states `idle | sending | sent | error` via `useState`; on submit POST `/api/contact`; success → replace form with thank-you panel; 400 → show returned field messages; disabled while sending; labels tied via `htmlFor`, `aria-live="polite"` on status region.

`newsletter-form.tsx` (`'use client'`): single email input + button, same state machine, posts `/api/newsletter`, success → "You're in." message.

`/contact` page: PageHero; two-column layout — left: contact info block (email `hello@metaxia.io`, invented HQ address, response-time note), right: `<ContactForm />`. Then FAQ teaser linking to `/faq`.

- [ ] **Step 3: Verify end-to-end**

Run both apps; then:
```bash
curl -s -X POST localhost:3000/api/contact -H 'content-type: application/json' \
  -d '{"name":"E2E","email":"e2e@test.com","message":"proxy works"}'
```
Expected: `{"ok":true}`. Bad email → 400 passthrough. `pnpm --filter @metaxia/web build` passes.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat(web): add contact page and form proxy handlers"
```

---

### Task 14: Admin panel

**Files:**
- Create: `apps/web/src/app/api/admin/[...path]/route.ts`, `apps/web/src/app/admin/layout.tsx`, `apps/web/src/app/admin/page.tsx` (login), `apps/web/src/app/admin/dashboard/page.tsx`, `apps/web/src/app/admin/[resource]/page.tsx` (list), `apps/web/src/app/admin/[resource]/new/page.tsx`, `apps/web/src/app/admin/[resource]/[id]/page.tsx` (edit), `apps/web/src/lib/admin.ts`, `apps/web/src/components/admin/resource-table.tsx`, `apps/web/src/components/admin/resource-form.tsx`

**Interfaces:**
- Consumes: API auth + admin CRUD (Tasks 7-8) via proxy.
- Produces: working `/admin` panel. All admin pages are client components (`'use client'`); token in `localStorage` key `metaxia_admin_token`; no token → redirect to `/admin`.

- [ ] **Step 1: Catch-all proxy**

`apps/web/src/app/api/admin/[...path]/route.ts`:
```ts
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL ?? 'http://localhost:4000';

async function proxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const target = `${API_URL}/${path.join('/')}`;
  const init: RequestInit = {
    method: req.method,
    headers: {
      'content-type': 'application/json',
      ...(req.headers.get('authorization') ? { authorization: req.headers.get('authorization')! } : {}),
    },
  };
  if (req.method !== 'GET' && req.method !== 'DELETE') init.body = await req.text();
  try {
    const res = await fetch(target, init);
    return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
  } catch {
    return NextResponse.json({ message: 'service unavailable' }, { status: 503 });
  }
}

export { proxy as GET, proxy as POST, proxy as PATCH, proxy as DELETE };
```
Allowed paths pass through as-is: client calls `/api/admin/auth/login`, `/api/admin/admin/services` (mutations), `/api/admin/services` (row listing), etc. Guard: reject with 404 unless `path[0]` is one of `auth`, `admin`, `services`, `case-studies`, `posts`, `team`, `jobs`, `pricing`, `faq`, `testimonials` (prevents open proxy to arbitrary API routes).

- [ ] **Step 2: Admin client lib**

`apps/web/src/lib/admin.ts` (`'use client'` consumers only):
```ts
const KEY = 'metaxia_admin_token';
export const getToken = () => (typeof window === 'undefined' ? null : localStorage.getItem(KEY));
export const setToken = (t: string) => localStorage.setItem(KEY, t);
export const clearToken = () => localStorage.removeItem(KEY);

export async function adminFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api/admin${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', authorization: `Bearer ${getToken()}`, ...init.headers },
  });
  if (res.status === 401) { clearToken(); window.location.href = '/admin'; throw new Error('unauthorized'); }
  if (!res.ok) throw new Error(((await res.json()) as { message?: string }).message ?? 'request failed');
  return res.json() as Promise<T>;
}
```

Resource registry (single source for tables and forms), in `lib/admin.ts`:
```ts
export interface FieldDef { name: string; label: string; kind: 'text' | 'textarea' | 'number' | 'boolean' | 'list' | 'date'; }
export interface ResourceDef { key: string; apiPath: string; label: string; columns: string[]; fields: FieldDef[]; }

export const RESOURCES: ResourceDef[] = [
  { key: 'services', apiPath: '/admin/services', label: 'Services',
    columns: ['title', 'slug', 'order'],
    fields: [
      { name: 'title', label: 'Title', kind: 'text' },
      { name: 'slug', label: 'Slug', kind: 'text' },
      { name: 'excerpt', label: 'Excerpt', kind: 'textarea' },
      { name: 'body', label: 'Body (markdown)', kind: 'textarea' },
      { name: 'icon', label: 'Icon key', kind: 'text' },
      { name: 'order', label: 'Order', kind: 'number' },
    ] },
  // ...analogous defs for case-studies, posts (date field publishedAt), team, jobs,
  // pricing (list field features, boolean highlighted, number price), faq, testimonials.
  // Write ALL of them with fields matching the Create DTOs exactly.
];
```
`list` kind renders a textarea, one item per line, serializes to `string[]`. Each def also carries `publicPath` (`/services`, `/case-studies`, `/posts`, `/team`, `/jobs`, `/pricing`, `/faq`, `/testimonials`): the admin UI READS rows through the proxy at `/api/admin${publicPath}` (public GETs) and MUTATES through `/api/admin/admin/...` (guarded routes). Matches the proxy allowlist in Step 1.

- [ ] **Step 3: Pages**

- `/admin` (login): email+password form → `POST /api/admin/auth/login`; on success `setToken`, `router.push('/admin/dashboard')`.
- `admin/layout.tsx`: renders `<meta name="robots" content="noindex" />` via metadata `robots: { index: false }`; plain utilitarian shell — sidebar with a link per `RESOURCES` entry plus "Inbox" (contact submissions + subscribers, read-only tables) and Logout (clearToken).
- `/admin/dashboard`: card per resource with row count.
- `/admin/[resource]`: `<ResourceTable def>` — fetch rows, render `columns`, Edit link per row, Delete button with `confirm()`, "New" button.
- `/admin/[resource]/new` + `/admin/[resource]/[id]`: `<ResourceForm def initial?>` — renders inputs from `fields`, number→`Number()`, boolean→checkbox, list→lines textarea, date→`datetime-local` → ISO string; submit POST or PATCH; on success navigate back to list.
- Unknown `[resource]` param → `notFound()`.

- [ ] **Step 4: Verify manually**

Both apps running: log in at `/admin` with seeded credentials, create a service, see it on `/services` after ≤60s (or restart dev to skip ISR wait), edit it, delete it. `pnpm --filter @metaxia/web build` passes.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(web): add admin panel with login and CRUD forms"
```

---

### Task 15: SEO layer

**Files:**
- Create: `apps/web/src/app/sitemap.ts`, `apps/web/src/app/robots.ts`, `apps/web/src/components/json-ld.tsx`, `apps/web/src/app/blog/[slug]/opengraph-image.tsx`, `apps/web/src/app/opengraph-image.tsx`
- Modify: every page from Tasks 10-12 (add `generateMetadata`/`metadata` + JSON-LD), `apps/web/src/app/layout.tsx`

**Interfaces:**
- Consumes: `lib/api` getters, `site` from `lib/site.ts`.
- Produces: complete SEO surface per spec.

- [ ] **Step 1: JSON-LD component + root data**

`json-ld.tsx`:
```tsx
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
```
Root layout: `Organization` (name, url, logo-less, sameAs []) + `WebSite` nodes.

- [ ] **Step 2: Per-page metadata**

Every page exports `metadata` (static pages) or `generateMetadata` (dynamic): unique title + description, `alternates: { canonical: '<path>' }`, OG title/description. Dynamic detail pages: 404 branch returns `{ title: 'Not found' }`. Blog post metadata includes `openGraph: { type: 'article', publishedTime }`.

JSON-LD per page: `Service` on service detail, `Article` on blog post, `BreadcrumbList` on all detail pages (Home → section → page), `FAQPage` on /faq (all Q/A), `JobPosting` on job detail (title, datePosted, employmentType, jobLocationType for Remote).

- [ ] **Step 3: sitemap.ts + robots.ts**

`sitemap.ts`:
```ts
import type { MetadataRoute } from 'next';
import { getServices, getCaseStudies, getPosts, getTeam, getJobs } from '@/lib/api';
import { site } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, cases, posts, team, jobs] = await Promise.all([
    getServices(), getCaseStudies(), getPosts(), getTeam(), getJobs(),
  ]);
  const statics = ['', '/about', '/services', '/case-studies', '/blog', '/team',
    '/careers', '/pricing', '/faq', '/contact', '/privacy', '/terms']
    .map((p) => ({ url: `${site.url}${p}` }));
  return [
    ...statics,
    ...services.map((s) => ({ url: `${site.url}/services/${s.slug}` })),
    ...cases.map((c) => ({ url: `${site.url}/case-studies/${c.slug}` })),
    ...posts.map((p) => ({ url: `${site.url}/blog/${p.slug}` })),
    ...team.map((t) => ({ url: `${site.url}/team/${t.slug}` })),
    ...jobs.map((j) => ({ url: `${site.url}/careers/${j.slug}` })),
  ];
}
```

`robots.ts`:
```ts
import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
```

- [ ] **Step 4: OG images**

`app/opengraph-image.tsx`: `ImageResponse` (from `next/og`) — ink background, wordmark, tagline, accent bar; size 1200×630. `app/blog/[slug]/opengraph-image.tsx`: same frame + post title + category.

- [ ] **Step 5: Verify**

```bash
pnpm --filter @metaxia/web build
curl -s localhost:3000/sitemap.xml | grep -c '<url>'   # with both apps running
curl -s localhost:3000/robots.txt
curl -s localhost:3000/services/cloud-architecture | grep 'application/ld+json'
```
Expected: build passes; sitemap has 12 static + 30 dynamic URLs (42); robots disallows /admin; JSON-LD present. Check one page's `<title>` contains `| Metaxia Solutions`.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat(web): add SEO layer - metadata, sitemap, JSON-LD, OG images"
```

---

### Task 16: Final verification + polish

**Files:**
- Modify: anything failing checks; `README.md` (full run instructions)

- [ ] **Step 1: Full test + build sweep**

```bash
pnpm --filter @metaxia/api test
pnpm build   # builds shared, api, web
```
Expected: all pass.

- [ ] **Step 2: Runtime smoke**

Start both apps. Check every route with curl (200): `/`, `/about`, `/services`, `/services/cloud-architecture`, `/case-studies`, one case study, `/blog`, one post, `/team`, one member, `/careers`, one job, `/pricing`, `/faq`, `/contact`, `/privacy`, `/terms`, `/sitemap.xml`, `/robots.txt`. Check `/admin` renders login. Check a 404 slug returns the branded not-found page. Submit contact form via curl through the proxy.

- [ ] **Step 3: Graceful-degradation check**

Stop the API, `rm -rf apps/web/.next`, run `pnpm --filter @metaxia/web build`.
Expected: build STILL succeeds (fallbacks) — list pages render empty-state, `generateStaticParams` returns `[]`.

- [ ] **Step 4: README**

Document: prerequisites, install, env files, migrate + seed, run dev, admin credentials location, test commands, architecture sketch.

- [ ] **Step 5: Use superpowers:requesting-code-review skill, then commit**

```bash
git add -A && git commit -m "chore: final verification and README"
```
