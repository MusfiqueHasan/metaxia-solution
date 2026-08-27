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
      {
        slug: 'cloud-architecture',
        title: 'Cloud Architecture',
        icon: 'cloud',
        order: 1,
        excerpt: 'Design and migration of resilient, cost-aware cloud platforms.',
        body: `We assess your current infrastructure, design a target architecture on AWS, GCP, or Azure, and run the migration with zero-downtime cutover strategies. Our engagements cover landing zones, IaC baselines, and FinOps guardrails so your platform stays fast and affordable as it grows.

## What we deliver

- A target architecture document with a costed migration path, reviewed with your engineering leads
- Landing zones with account structure, network topology, and identity boundaries set up as code
- Infrastructure-as-code baselines in Terraform or Pulumi, wired into your CI pipeline
- Zero-downtime cutover runbooks, rehearsed against staging before anything touches production
- FinOps guardrails: budgets, tagging standards, and per-team cost dashboards

## How the engagement runs

The first two weeks are discovery: we read your existing infrastructure, interview the people who operate it, and map every dependency that could complicate a move. From there we design the target state and sequence the migration into increments that each leave you in a working, reversible position. Nothing cuts over until the rehearsal runs clean twice.

## Where this fits

Most teams bring us in at one of three moments: an expiring data-center contract, a platform that has outgrown a single region, or a cloud bill that nobody can explain anymore. All three are good times to talk.

## Outcomes you can expect

- Cutovers measured in minutes of read-only mode, not weekends of downtime
- Infrastructure any engineer can rebuild from the repository, not from memory
- A monthly bill your finance team can trace to products and teams
- An on-call rotation that pages less because the platform degrades gracefully`,
      },
      {
        slug: 'web-development',
        title: 'Web Development',
        icon: 'code',
        order: 2,
        excerpt: 'Product-grade web applications built with modern frameworks.',
        body: `Our engineering teams build fast, accessible web applications using React, Next.js, and Node.js, backed by strong typing and automated test coverage. From marketing sites to complex internal tools, we deliver codebases that new engineers can understand within a day of joining.

## What we deliver

- Production applications in React, Next.js, and Node.js with strict TypeScript throughout
- A component-driven design system so product teams ship new screens without waiting on engineering
- Automated test coverage at the unit, integration, and end-to-end levels
- Performance budgets and Core Web Vitals monitoring wired into CI, not bolted on at the end
- Documentation and onboarding notes written for the next engineer, not the current one

## How the engagement runs

We start with a one-week technical discovery: current codebase, deployment story, and the product roadmap the code has to serve. Work then runs in weekly releases against a shared board — you see the application grow in production, not in screenshots. Every pull request carries tests and a preview deployment.

## Stack we reach for

Next.js on the front, NestJS or plain Node services behind it, Postgres by default, and infrastructure as code from day one. When your existing stack differs, we meet it where it is — rewrites are a last resort, not a sales pitch.

## Outcomes you can expect

- First production deploy inside the first two weeks
- Page loads under budget on real devices, verified in CI on every merge
- A codebase your own hires can extend without a handover call
- Accessibility to WCAG AA as a default, not a change request`,
      },
      {
        slug: 'data-security',
        title: 'Data Security',
        icon: 'shield',
        order: 3,
        excerpt: 'Security assessments and hardening for applications, infrastructure, and data pipelines.',
        body: `We run threat modeling workshops, penetration tests, and infrastructure audits to find gaps before attackers do — then close them without freezing your roadmap.

## What we deliver

- A threat model of your product and infrastructure, built with your team so it survives the engagement
- Penetration testing of applications and cloud accounts with reproduction steps for every finding
- Encryption at rest and in transit, secrets management, and least-privilege access implemented, not just recommended
- Compliance groundwork for SOC 2 and ISO 27001 mapped to controls you already run
- Incident-response runbooks and tabletop exercises so the first real page is not the first rehearsal

## How the engagement runs

Week one is the threat-modeling workshop and scoping. Weeks two through four are assessment: application testing, cloud configuration review, and dependency audit. Everything we find lands in your tracker ranked by exploitability and blast radius, and we stay on to fix the top of that list with your engineers rather than leaving a PDF behind.

## Where this fits

Typical triggers: a security questionnaire from your biggest prospect, a SOC 2 deadline, or the quiet realization that every engineer has production access and nobody remembers why.

## Outcomes you can expect

- Findings ranked by real exploitability, with the critical list fixed before we leave
- Audit evidence your compliance platform can consume directly
- Access boundaries that survive employee offboarding
- A team that has rehearsed its worst day once before having it`,
      },
      {
        slug: 'mobile-apps',
        title: 'Mobile Apps',
        icon: 'phone',
        order: 4,
        excerpt: 'Native and cross-platform mobile apps built for reliability at scale.',
        body: `We design and build iOS and Android applications using React Native, and native Swift or Kotlin when performance demands it — apps built to survive bad networks, old devices, and app-store review.

## What we deliver

- iOS and Android apps from one React Native codebase, with native modules where they earn their keep
- Offline-first data sync so the app works on the subway, not just in the demo
- Push notification infrastructure with segmentation and quiet-hours handling
- Crash reporting, analytics, and phased rollouts configured before the first release
- App Store and Play Store submission handled end to end, including review-rejection triage

## How the engagement runs

We prototype the two or three screens that carry your app's core loop first and put them on real devices in week two. Every release after that goes through device-lab testing across screen sizes, OS versions, and throttled network conditions before your users ever see it. Phased rollouts mean a bad build reaches 5 percent of users, not all of them.

## Where this fits

Teams usually come to us with a web product that needs a real mobile presence, an agency-built app that has stopped scaling, or a native codebase their last mobile engineer took with them.

## Outcomes you can expect

- A first TestFlight or internal-track build within three weeks
- Crash-free session rates above 99.5 percent as a standing bar
- Rollbacks that take one click because releases are phased by default
- One codebase your web engineers can contribute to`,
      },
      {
        slug: 'ai-integration',
        title: 'AI Integration',
        icon: 'spark',
        order: 5,
        excerpt: 'Practical AI features woven into your existing product, not bolted on as a demo.',
        body: `We help teams identify where large language models actually move the needle, then ship production-grade integrations rather than one-off prototypes.

## What we deliver

- Retrieval-augmented search and question answering over your own documents and data
- Document extraction pipelines that turn PDFs and scans into structured, validated fields
- Customer support copilots that draft grounded responses for human review
- Internal automation for the repetitive judgment calls that eat your team's week
- Evaluation pipelines, guardrails, and logging shipped with every integration

## How the engagement runs

We start with a two-week feasibility sprint: real samples of your data, a working prototype against them, and honest numbers on accuracy, latency, and cost per request. If the numbers hold, we productionize — evals in CI, confidence thresholds with human-review routing, and a fallback path for every model call that fails or comes back uncertain. If they don't hold, you've spent two weeks learning that, not two quarters.

## What we watch that demos ignore

Cost per request at your real volume, p95 latency under load, drift when the underlying model version changes, and what happens to the user experience when the model is wrong. Every one of those has killed a promising AI feature somewhere; none of them show up in a keynote demo.

## Outcomes you can expect

- A working prototype on your data inside two weeks
- Accuracy and cost numbers you can defend to your board
- AI features with a measured failure mode instead of a surprising one
- A team that can tune prompts and retrieval without calling us back`,
      },
      {
        slug: 'seo-optimization',
        title: 'SEO Optimization',
        icon: 'chart',
        order: 6,
        excerpt: 'Technical and content SEO that turns organic search into a growth channel.',
        body: `We treat organic search as an engineering problem first and a content problem second — and we fix both sides, not just the one that produces slide decks.

## What we deliver

- A full technical audit: site speed, crawlability, indexation, structured data, and Core Web Vitals
- The fixes themselves — rendering strategy, sitemap hygiene, canonical structure — shipped as pull requests
- Schema.org structured data for the page types that earn rich results in your category
- A content plan paired with keyword research and a publishing cadence your team can actually sustain
- Rank, traffic, and conversion tracking in one dashboard, so wins are measured in revenue

## How the engagement runs

The first month is the technical pass: we audit, then fix, in the same sprint — most sites carry two or three structural issues that cap everything else. From month two the work shifts to content and authority: briefs your team can write against, internal-link architecture, and a quarterly roadmap review so the investment compounds instead of plateauing.

## What we refuse to do

Buy links, spin AI content at volume, or chase algorithm loopholes with a shelf life. Rankings built that way are borrowed, not owned, and they come with a penalty attached.

## Outcomes you can expect

- Core Web Vitals in the green on real-user data, not lab runs
- Indexation coverage you can see moving in Search Console within the first month
- Content that ranks because it answers the query better, not because it is longer
- A quarterly report your CFO reads past the first page`,
      },
    ],
  });

  await db.caseStudy.deleteMany();
  await db.caseStudy.createMany({
    data: [
      {
        slug: 'kryzotech',
        title: 'Kryzotech — a Learning Ecosystem for AI & Data Skills',
        category: 'Software',
        order: 1,
        coverGradient: 'linear-gradient(135deg,#0ea5e9,#6366f1)',
        websiteUrl: 'https://www.kryzotechbd.com/',
        previewImage: '/projects/kryzotech-web.webp',
        excerpt:
          'A full education platform for Bangladesh — bootcamps, trainer profiles, local EPS payments, and a real-time admin operation behind it all.',
        body: `Kryzotech is a complete learning ecosystem for AI, data science, and professional-skills training — course marketplace in front, a real-time operations dashboard behind it, live at kryzotechbd.com.

## The challenge

A growing training brand needed to sell cohort-based bootcamps online, not just list them. That meant enrollment with seat limits, secure checkout through EPS — the local payment rail its students actually use — live notifications when seats move or schedules change, and staff tooling for the daily grind of running courses. Off-the-shelf LMS products handled none of the local-payment or operations reality.

## What we built

A TypeScript platform, end to end: a Node.js API over MongoDB, Redux-managed state on the client, and Socket.io pushing live updates to every connected browser.

- Course marketplace with dedicated AI and data-science tracks, cohort schedules, and seat availability
- Enrollment flow with secure EPS checkout — payments complete in-country, no manual reconciliation
- Trainer profiles connecting each cohort to the person actually teaching it
- Real-time updates over Socket.io: seat counts, announcements, and schedule changes land instantly
- A full admin dashboard: overview analytics, expense tracking, course management, blog publishing, and user administration in one place

## The rollout

The marketplace shipped first with a limited course set while payments ran shadow tests against the EPS integration. Admin modules followed one at a time — courses, then blog, then expenses and user management — so staff adopted each tool as it landed instead of relearning everything at once.

## Results

- Live in production at kryzotechbd.com, carrying cohort enrollments end to end
- EPS checkout completes local payments without a manual reconciliation step
- Seat counts and announcements update in real time across every open session
- Daily operations — courses, blog, expenses, users — run from one dashboard with zero engineering involvement`,
      },
      {
        slug: 'smarthrflow',
        title: 'SmartHRFlow — AI Recruitment from Resume to Offer',
        category: 'AI',
        order: 2,
        coverGradient: 'linear-gradient(135deg,#f97316,#ec4899)',
        websiteUrl: 'https://smarthrflow.com/',
        previewImage: '/projects/smarthrflow-web.png',
        excerpt:
          'An AI hiring platform that parses resumes at 98% accuracy, scores every candidate, and runs the whole pipeline from application to offer.',
        body: `SmartHRFlow is an AI-powered recruitment platform that takes the manual grind out of hiring — resumes parsed and scored the moment they arrive, assessments that resist cheating, and a pipeline view that carries every candidate from application to offer. Live at smarthrflow.com.

## The challenge

HR teams were losing their weeks to screening: reading resumes in a dozen formats, re-keying candidate details, chasing applicants over email one at a time, and defending shortlists built on gut feel. The brief was blunt — cut the manual workload dramatically, keep the evaluation fair, and make setting up a new job's hiring flow a minutes-long task rather than a project.

## What we built

A Next.js and TypeScript front end over a NestJS API, with Supabase as the data layer and the OpenAI API doing the reading.

- Resume parsing at 98% accuracy across formats, extracting skills and experience into structured profiles
- Intelligent skill matching with automated ranking and a bias-aware evaluation flow, each candidate scored against the role
- A stage pipeline — applications, shortlist, HR interview, technical interview, offer, hired — with live counts per stage
- Custom skill assessments: multiple question formats, custom scoring, and anti-manipulation safeguards
- Bulk candidate outreach with reusable templates and delivery/engagement tracking
- Drag-and-drop application form builder, mobile-optimized, with a new job's flow live in about five minutes

## The rollout

The platform shipped to production at smarthrflow.com on Vercel, with the assessment and bulk-email modules following the core parsing pipeline. A v2 interface is already in preview, iterating on the recruiter dashboard without interrupting live hiring.

## Results

- Recruitment steps reduced by 60 percent end to end
- 98 percent parsing accuracy across resume formats
- Screening time cut by roughly 60 percent with AI ranking
- A new job's application flow configured in about five minutes`,
      },
      {
        slug: 'better-e-mart',
        title: 'Better Emart — a Multi-Vendor Marketplace for Chittagong',
        category: 'Software',
        order: 3,
        coverGradient: 'linear-gradient(135deg,#a855f7,#f43f5e)',
        websiteUrl: 'https://betteremart.com/',
        previewImage: '/projects/better-e-mart-web.webp',
        excerpt:
          'A full e-commerce platform — storefront, vendor dashboard, and admin operations — carrying 1,400+ products across a dozen categories.',
        body: `Better Emart is a complete e-commerce platform built for Chittagong, Bangladesh: a customer storefront in front, a vendor dashboard for the sellers behind it, and an admin operation running the whole marketplace. Live at betteremart.com.

## The challenge

The brief asked for more than a shop: a modern marketplace that could carry multiple vendors on one platform, keep inventory honest across all of them, take payments securely, and give customers an experience that holds up against the big platforms — search, cart, checkout, and order tracking that just work.

## What we built

A Next.js and TypeScript storefront over an Express.js API with MongoDB, fronted by Cloudflare.

- Product catalog with category and subcategory filtering across 1,400+ listings
- Cart and secure checkout with order tracking from purchase to delivery
- Vendor dashboard: add and manage listings with multiple images, track inventory with automatic low-stock alerts, process orders in real time, and read sales reports with full transaction history
- Admin operation with live counts across the marketplace — products, categories, order states from pending to delivered, purchase orders, stock cost, and shipments
- Multi-vendor structure so each seller runs their own storefront inside one platform

## The rollout

The storefront and catalog shipped first, with vendor tooling following once real inventory was flowing. Order-state tracking — pending, on the way, delivered — landed with the logistics integration, and the admin overview grew a tile for each operational question the team kept asking.

## Results

- Live in production at betteremart.com
- 1,436 products organized across 12 categories and 35 subcategories
- Vendors run their own listings, stock, and orders — no central bottleneck
- Low-stock alerts and order-state tracking replaced manual spreadsheet checks`,
      },
      {
        slug: 'chefnawaz',
        title: 'Chef Nawaz — a Sauce Brand, Storefront, and Kitchen-Office in One',
        category: 'Software',
        order: 4,
        coverGradient: 'linear-gradient(135deg,#b91c1c,#f59e0b)',
        websiteUrl: 'https://chefnawaz.com/',
        previewImage: '/projects/chefnawaz.png',
        excerpt:
          'A commercial sauce formulator with 24+ years behind 50+ restaurants — now selling signature sauces direct, with a custom admin running the store.',
        body: `Chef Nawaz formulates sauces and spice blends for restaurants and food brands. The site gives that expertise a home: a brand storefront selling the signature range, a recipes showcase, and a custom admin that runs the whole operation. Live at chefnawaz.com.

## The challenge

Twenty-four years of formulation work and 50+ restaurant clients lived entirely on reputation and referrals. The brief: one platform that sells the signature sauce range direct to customers, presents the commercial services — formulation, recipe development, batch scaling, menu consulting — to restaurant buyers, and lets the chef's own team run products, orders, and content without calling a developer.

## What we built

A PHP storefront with a product database, user accounts, and a purpose-built admin behind it.

- Storefront with the eight-sauce signature range — burger sauces, mayo variants, and dips — organized by category
- Recipes section with ratings, a best-sellers carousel, and client testimonials
- Service pages covering formulation, batch scaling, and restaurant consulting
- Customer accounts with authentication for ordering
- Custom admin: products, recipes, categories, orders, users, reviews, contact messages, and settings in one panel
- Order pipeline with searchable history and status tracking — processing, delivered, cancelled — per order ID

## The rollout

The brand site and catalog went live first, with checkout and customer accounts following. The admin grew module by module — products and recipes, then orders and users, then reviews and the contact inbox — until the team ran everything in-house.

## Results

- Live in production at chefnawaz.com
- The signature range sells direct, with orders tracked from placement to delivery
- Reviews and customer messages handled inside the admin — no shared inboxes
- The team updates products, recipes, and content with zero developer involvement`,
      },
      {
        slug: 'jobsyo',
        title: 'Jobsyo — AI Job Discovery Across 50+ Platforms',
        category: 'AI',
        order: 5,
        coverGradient: 'linear-gradient(135deg,#0891b2,#4f46e5)',
        websiteUrl: 'https://jobsyo.com/',
        previewImage: '/projects/jobsyo.png',
        excerpt:
          'An AI platform that scans thousands of postings across 50+ job sources and hands candidates a curated feed with 95% match accuracy.',
        body: `Jobsyo turns job hunting from a search problem into a matching problem: its AI scans thousands of postings across LinkedIn, Facebook, and company career pages, scores each one against a candidate's profile, and serves a curated feed instead of a haystack. Live at jobsyo.com.

## The challenge

Job seekers burn weeks paging through boards, and every platform holds a different slice of the market. The brief: scan the postings where they actually live — 50+ platforms — understand each candidate well enough to score fit with real accuracy, and keep applications flowing through the official channels employers trust, not a proxy inbox.

## What we built

A Next.js platform with an AI matching core, structured as a four-step product: profile, discovery, review, apply.

- Profile builder — resume upload or manual entry, salary and location preferences, work options, and career goals feeding the matcher
- Multi-platform discovery scanning 2,000+ daily postings across 50+ sources, from LinkedIn to company career pages
- Compatibility scoring with skills and culture alignment, producing a personalized ranking at 95% match accuracy
- A curated feed with per-job match breakdowns, skills-gap analysis, and salary and market data
- Real-time alerts the moment a matching role is posted
- One-click apply routed through the original platform, with application progress tracking and the official posting preserved
- A resume-score tool that grades a CV before it goes out

## The rollout

Discovery shipped first against a core set of platforms, with the source list growing to 50+ as scanning matured. The match-score breakdowns and resume scoring followed once real feed data proved the ranking, and pricing tiers arrived with the public launch.

## Results

- Live in production at jobsyo.com
- 2,000+ postings scanned daily across 50+ job platforms
- 95% match accuracy on the curated feed, 2.5x faster discovery than manual search
- Candidates set up a profile and see their first matches in under five minutes`,
      },
      {
        slug: 'kryzotech-solutions',
        title: 'Kryzotech Solutions — the Services Arm, Online',
        category: 'Software',
        order: 6,
        coverGradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
        websiteUrl: 'https://solutions.kryzotechbd.com/',
        previewImage: '/projects/kryzotechbd-web.png',
        excerpt:
          'The commercial front for a technology services firm — three practices, a shipped-work portfolio, and a consultation funnel that converts.',
        body: `Kryzotech Solutions is the services arm of the Kryzotech ecosystem: a firm helping businesses put AI, data science, and custom software to work. The site is its commercial front — practices explained, delivery proven, and a consultation funnel at the end. Live at solutions.kryzotechbd.com.

## The challenge

The Kryzotech brand had grown a 1,000-plus community around its education arm, but client-services work needed its own home: a site that presents the three practices clearly, proves delivery with real shipped projects rather than claims, publishes the team's thinking, and turns interest into booked consultations.

## What we built

A services site organized around three practices and the proof behind them.

- Service pillars: Data Science & AI turning raw data into insight and predictive analytics; Web Development for scalable, modern platforms; App Development for cross-platform mobile products
- A portfolio of shipped work — a social platform for padel players on Next.js, TypeScript, and PostgreSQL; an AI-matching recruitment product on React, Python, and FastAPI; and a financial-services platform on Node.js and Next.js
- A blog carrying the team's technical writing
- Consultation booking with a Get Started funnel wired through the site
- Community and education tie-ins connecting the services arm to the Kryzotech Institution

## The rollout

The services site launched on its own subdomain beside the education platform, sharing the brand but splitting the audience — students on one side, clients on the other. The portfolio grew case by case as projects shipped, and the blog and booking funnel followed.

## Results

- Live in production at solutions.kryzotechbd.com
- 30+ completed projects presented as shipped, named work
- A 1,000-plus community feeding the services pipeline
- Consultations booked directly from the site instead of over social inboxes`,
      },
      {
        slug: 'onlineteened',
        title: 'OnlineTeenEd — DMV-Approved Driver Education, Fully Online',
        category: 'Software',
        order: 7,
        coverGradient: 'linear-gradient(135deg,#8b5cf6,#06b6d4)',
        websiteUrl: 'https://onlineteened.com/',
        previewImage: '/projects/onlineteened-web.webp',
        excerpt:
          'A California DMV-approved driver-education platform — 15 self-paced lessons, official completion certificates, and an admin tracking every student.',
        body: `OnlineTeenEd delivers California DMV-approved driver education entirely online, run by Fremont Car Driving School under DMV license #E0628 — teens work toward their permits at their own pace, and the school tracks every student from enrollment to certificate. Live at onlineteened.com.

## The challenge

A licensed driving school needed its classroom on the internet without losing the regulator: the course had to satisfy California DMV standards end to end, serve teens from any device at a flat, honest price, issue the official Certificate of Completion the DMV actually accepts, and give staff one place to see who enrolled, who passed, and with what marks.

## What we built

A self-paced learning platform with a certification flow in front and a school-office admin behind it.

- A 15-lesson curriculum aligned to DMV standards — vehicle systems, traffic laws and the California Vehicle Code, pedestrian safety, alcohol and drug effects, risk perception, and teen driving behaviors
- Self-paced, mobile-friendly lessons with progress saving and unlimited attempts to pass
- Flat $24.95 pricing with a free DMV practice test included
- The official DMV Certificate of Completion flow, mailed to the student for their DMV visit
- Guidance pages for the permit process and the license pathway, plus a bridge to behind-the-wheel training
- Live chat support and access to a course trainer
- Admin panel: students with name, email, phone, and marks; enrollment tracking; passed-student lists; blog, reviews, and contact-request moderation; platform settings behind secure access

## The rollout

The course and certification flow launched first — the part the DMV license depends on — with the admin growing alongside real enrollments: student and passed-student tables, then blog and review moderation, then the contact inbox and settings.

## Results

- Live in production at onlineteened.com under DMV license #E0628
- Students complete the full requirement online and receive the official certificate by mail
- Staff see users, passed students, and enrollments at a glance, with per-student marks
- Ten public student reviews across 2023–2024 backing the program`,
      },
      {
        slug: 'kumira',
        title: 'Kumira Guptachara — Ferry Ticketing from Jetty to Dashboard',
        category: 'Software',
        order: 8,
        coverGradient: 'linear-gradient(135deg,#0e7490,#38bdf8)',
        websiteUrl: 'https://kumiraguptachara.com/',
        previewImage: '/projects/kumira-web.png',
        excerpt:
          'A boat-ticketing platform for the Kumira–Sandwip crossing — online booking, a counter POS at the jetty, and an admin tracking every taka.',
        body: `Kumira Guptachara runs the boat crossing between Kumira and Sandwip, and this platform runs its ticketing: passengers book online, agents sell at the jetty counter with a purpose-built POS, and the operator watches revenue, refunds, and boat utilization from one panel. Live at kumiraguptachara.com.

## The challenge

A working ferry route needed to move off paper: real-time seat availability across boats, secure online payment for passengers, a counter workflow fast enough for a queue at the jetty — including baggage billed by weight and half-fare tickets — and a management view that answers the daily questions: how many passengers, how much money, from which side of the crossing.

## What we built

A Next.js and TypeScript platform over an Express.js API with MongoDB, with payments through a local gateway and a custom POS at the counter.

- Online booking with live seat availability, schedule display, and instant confirmations
- A counter dashboard for agents: boat type with fares and half-tickets, route and departure time, passenger counts, baggage charged per 20 kg, cash handling, and a live total before booking
- Instant boarding passes with a custom POS for ticket printing and barcode scanning — separate scanners for counter and online tickets
- Daily counter and online reports with full transaction history
- An admin panel with day-at-a-glance tiles — bookings, passengers, revenue, refunds — split per route side, with counter and online tickets toggled separately
- Operations modules: check-ins, price list, employees, booking limits, and a weather view for the crossing

## The rollout

The counter POS shipped first — the jetty queue could not wait on the web — followed by online booking with gateway payments, then the scanners tying both channels to boarding. The admin grew a tile for each question the operator kept asking, down to refund amounts per route side.

## Results

- Live in production at kumiraguptachara.com
- A single day at the counter: 67 bookings, 116 passengers, ৳28,200 in revenue — visible on one screen
- Tickets from both channels validated by barcode at boarding
- Refunds, price changes, and booking limits handled by the operator, not a developer`,
      },
    ],
  });

  await db.post.deleteMany();
  await db.post.createMany({
    data: [
      {
        slug: 'why-we-moved-to-event-sourcing',
        title: 'Why We Moved to Event Sourcing for Financial Systems',
        category: 'Engineering',
        publishedAt: new Date('2026-03-10'),
        excerpt: 'A look at why traditional CRUD ledgers break down under financial scale, and what replaced them.',
        body: `Most financial systems start their life as a straightforward CRUD application. A row represents an account balance, a transaction updates that row, and everything works fine until the business needs an audit trail, multi-currency support, or the ability to replay history after a bug. That is roughly the point where teams start looking at event sourcing, and it is exactly where one of our fintech clients found themselves last year.

## The Problem With Mutable State

When you only store the current balance, you have thrown away the story of how you got there. Reconciliation becomes a forensic exercise, because nothing in the database explains why a number is what it is. Every "quick fix" — a manual balance correction, a one-off script to patch a bad migration — quietly erodes trust in the ledger, because there is no record of what actually happened.

Event sourcing flips this around. Instead of storing current state, you store an append-only log of everything that happened, and current state is a projection computed from that log. A balance is never edited directly; it is the sum of all deposit and withdrawal events for that account. This sounds like more work, and it is, but it buys you something CRUD cannot: a complete, tamper-evident history that your compliance team will actually thank you for.

## What We Learned Shipping It

The hardest part was not the write path — appending events is simple. The hard part was building fast, reliable read models, because nobody wants to replay a million events every time they load an account page. We solved this with materialized projections that update asynchronously as events land, backed by a reconciliation job that recomputes projections from scratch on a schedule to catch drift early.

The second hardest part was cultural, not technical. Engineers used to updating a row directly had to unlearn that instinct, and it took a few incident postmortems before the team trusted the new model enough to stop reaching for manual overrides. Six months in, the ledger has processed tens of millions of transactions without a single unexplained balance discrepancy, and every one of those transactions can be traced back to the exact event that produced it.

If you are building anything where "why does this number look like this" is a question your business will eventually ask, it is worth evaluating event sourcing before your CRUD schema calcifies around assumptions you will regret.`,
      },
      {
        slug: 'pricing-your-first-enterprise-contract',
        title: 'Pricing Your First Enterprise Contract Without Guessing',
        category: 'Business',
        publishedAt: new Date('2026-04-18'),
        excerpt: 'How growing software vendors should think about their first six-figure enterprise deal, from packaging to procurement.',
        body: `The first time a prospect asks for an enterprise contract, most founders panic and either massively underprice the deal out of gratitude, or invent a number that has no relationship to the value being delivered. Neither approach ages well, and we have watched both play out with clients who came to us after the fact to help clean up the fallout.

## Start With Value, Not Effort

The instinct is to price based on how much work the engagement will take. Resist it. Enterprise buyers are paying for outcomes — risk reduction, time saved, revenue unlocked — not for your engineering hours. Before you name a number, quantify what the problem is costing the buyer today, whether that is manual labor, lost deals, or compliance exposure. A price that is a fraction of that cost is easy to justify internally on their side, which matters more than you might expect once the deal has to survive procurement.

## Procurement Will Ask for Things You Have Not Built Yet

Security questionnaires, SSO, audit logs, data residency guarantees — enterprise buyers will ask for a checklist of features your product may not have. Decide in advance which of these you are willing to commit to on a timeline versus which are dealbreakers. We have seen deals stall for months because a vendor promised compliance certification "soon" without a concrete date, and then had no good answer when the buyer's security team followed up.

## Structure the Contract to De-risk Both Sides

A staged rollout — a paid pilot with clear success criteria, followed by an annual contract — protects you from a buyer who churns after month two, and protects the buyer from committing a year of budget to something unproven. Tie renewal to measurable outcomes agreed on up front, not vague satisfaction. This structure has closed more of our clients' first enterprise deals than any amount of pricing cleverness, because it removes the biggest objection: fear of committing to the unknown.

Enterprise pricing is less about finding the right number and more about building a structure that lets a risk-averse buyer say yes. Get the structure right, and the number becomes a much smaller conversation.`,
      },
      {
        slug: 'retrieval-augmented-generation-in-production',
        title: 'What Actually Breaks When You Put RAG in Production',
        category: 'AI',
        publishedAt: new Date('2026-05-22'),
        excerpt: 'Retrieval-augmented generation demos are easy. Production RAG systems fail in specific, predictable ways — here is what to watch for.',
        body: `Every retrieval-augmented generation demo looks the same: a clean set of documents, a handful of test questions, and impressively accurate answers. The gap between that demo and a production system serving real users is where most AI integration projects quietly stall, and it is rarely the language model that is the problem.

## Retrieval Quality, Not Model Quality, Is Usually the Bottleneck

Teams tend to blame the language model when answers are wrong, but in our experience the retrieval step is at fault far more often. If the wrong chunk of a document gets retrieved, no model can generate a correct answer from it. Chunking strategy, embedding model choice, and query rewriting deserve far more attention than most teams give them before they start tuning prompts.

## Stale and Duplicate Content Poisons Everything

Real knowledge bases are messy. Outdated pages sit next to their replacements, near-duplicate documents disagree with each other on small details, and nobody has cleaned house in years. A RAG system trained on this mess will confidently retrieve the wrong version of the truth. Before investing further in the retrieval pipeline, it is worth auditing and pruning the underlying corpus — an unglamorous step that pays off more than almost any model upgrade.

## Evaluation Has to Be Continuous, Not a One-Time Check

A model that scores well on your initial test set can degrade silently as your document corpus grows or as user questions drift into territory you never tested. We build evaluation pipelines that sample real production queries on a schedule, score them against retrieval and answer-quality metrics, and flag regressions before users notice. Without this, teams find out their RAG system has quietly gotten worse only when a customer complains.

## Plan for the Model Saying "I Don't Know"

The single highest-leverage change we make in most RAG deployments is training the system to abstain when confidence is low, rather than generating a plausible-sounding wrong answer. This requires explicit confidence scoring and a clear fallback path, whether that is escalating to a human or asking a clarifying question. Users forgive "I'm not sure, let me check" far more readily than they forgive a confident hallucination.

Production RAG is an engineering discipline, not a prompt-engineering trick. Teams that treat it that way — with attention to data quality, retrieval tuning, and ongoing evaluation — are the ones whose AI features are still trusted a year after launch.`,
      },
      {
        slug: 'the-real-cost-of-technical-debt',
        title: 'The Real Cost of Technical Debt (and How to Measure It)',
        category: 'Engineering',
        publishedAt: new Date('2026-06-15'),
        excerpt: 'Technical debt is usually discussed in vague terms. Here is a concrete way to measure it and make the case for paying it down.',
        body: `"We need to address technical debt" is one of the least persuasive sentences an engineering team can say to the rest of the business, mostly because it is rarely backed by a number anyone outside engineering can evaluate. That vagueness is why technical debt conversations lose to feature requests almost every time, even when the debt is actively slowing the team down.

## Debt Is a Rate, Not a Total

The useful question is not "how much debt do we have" but "how much slower are we shipping because of it." We ask engineering teams to track cycle time for comparable features over time, and to log, ticket by ticket, when a task took longer than expected because of a workaround, missing test coverage, or an outdated dependency. Over a quarter, this produces a rough but defensible estimate: debt is costing this team roughly some fixed percentage of its capacity.

## Tie It to Incidents, Not Just Velocity

Slower feature delivery is one cost, but production incidents are a more visceral one. We have clients tag incidents in their postmortem process with a "root cause: technical debt" label when the underlying issue traces back to a known shortcut. Six months of this data usually produces a clear pattern — a handful of debt items are responsible for a disproportionate share of on-call pain, which makes prioritization far easier than a generic backlog of "things that feel messy."

## Present It as a Portfolio, Not a Binary

Not all technical debt deserves to be paid down, and framing the conversation as "should we do features or debt" is a false choice that debt always loses. Instead, present debt items alongside feature work in the same prioritization framework, each with an estimated cost of delay and expected payoff. A debt item that is costing a meaningful share of a team's velocity competes on the same terms as a feature that might grow revenue by a similar amount, and suddenly it is not a special category that gets deprioritized by default.

## Make Progress Visible

Once you start tracking debt quantitatively, keep showing the trend line to stakeholders, not just the initial pitch. A cycle-time chart that shows steady improvement after a debt-reduction sprint is one of the more effective tools we have seen for keeping leadership bought into ongoing investment, because it turns an abstract engineering concern into a business metric that keeps moving in the right direction.

Technical debt conversations succeed when they stop being arguments about code quality and start being arguments about measurable delivery speed. Once you have the numbers, the case usually makes itself.`,
      },
      {
        slug: 'hiring-your-first-in-house-engineer',
        title: 'Hiring Your First In-House Engineer After Working With an Agency',
        category: 'Business',
        publishedAt: new Date('2026-07-09'),
        excerpt: 'Moving from an agency partner to an in-house team is a milestone worth doing carefully. Here is how we help clients make the transition.',
        body: `At some point, a growing company that has been working with an external development partner reaches a milestone: it is time to hire the first in-house engineer. We have guided a number of our clients through this transition, and it goes more smoothly when a few things are planned for in advance rather than discovered the hard way.

## Decide What the First Hire Is Actually For

The first in-house engineer is rarely meant to replace an agency outright — that usually happens gradually over a much longer period. More often, this person is meant to own day-to-day product decisions, be the fast-response point of contact for customers and internal stakeholders, and build the institutional knowledge that an external partner, however good, cannot hold indefinitely. Being explicit about this scope up front avoids setting up the new hire to fail by expecting them to instantly replicate an entire team's output.

## Documentation Debt Becomes Visible Fast

Agencies that work well tend to hold a lot of context in their heads and in chat threads rather than in formal documentation, simply because it is faster in the moment. That works fine when the same few people are always in the room, and becomes a liability the day a new hire needs to get productive without that shared history. Before the transition, we run a documentation pass covering architecture decisions, deployment processes, and the reasoning behind non-obvious technical choices, specifically so the new hire is not starting from zero.

## Plan the Handoff as an Overlap, Not a Cliff

The transitions that go worst are the ones where the agency's involvement ends the same week the new hire starts. We recommend a deliberate overlap period — typically four to eight weeks — where the new engineer pairs directly with the agency team on real work, asking questions in context rather than trying to reconstruct decisions from documentation alone after the fact. This period costs a bit more, but it consistently prevents the multi-month confidence dip that otherwise follows a cold handoff.

## The Agency Relationship Usually Does Not End, It Changes

Most of our clients do not fully sever the relationship once they have an in-house team; the engagement shifts toward specialized work — a major infrastructure project, a security audit, overflow capacity during a busy quarter — while the in-house engineer owns the daily roadmap. Planning for this shift explicitly, rather than treating the first hire as an ending, tends to produce a healthier long-term setup for everyone involved.

Bringing engineering in-house is a sign of a company maturing, not a verdict on the agency relationship that got it there. Treat the transition with the same care you would give any other major hire, and it tends to go well.`,
      },
      {
        slug: 'evaluating-llm-vendors-in-2026',
        title: 'A Practical Framework for Evaluating LLM Vendors',
        category: 'AI',
        publishedAt: new Date('2026-08-05'),
        excerpt: 'With new model providers launching constantly, here is the framework we use with clients to evaluate which LLM vendor actually fits their product.',
        body: `Every few months, a new model claims to beat the incumbents on some benchmark, and clients ask us whether they should switch. The honest answer is almost always "it depends on your workload," which is unsatisfying but true. Benchmark leaderboards rarely reflect the specific mix of tasks a given product actually needs.

## Build an Evaluation Set From Your Own Data, Not a Public Benchmark

The single most useful thing a team can do before comparing vendors is assemble fifty to a hundred real examples from their own product — actual user queries, actual documents, actual edge cases — with a clear definition of what a good answer looks like for each. Public benchmarks measure general capability; your evaluation set measures whether a model is good at your problem, which is a different and much more useful question.

## Cost and Latency Matter as Much as Raw Quality

A model that is marginally more accurate but noticeably more expensive or slower is often the wrong choice once you account for real usage volume. We ask clients to model out cost per request at their expected scale, not just at pilot volume, since pricing that looks trivial at low volume can become a meaningful budget line once usage grows. Latency matters just as much for anything user-facing — a slightly less accurate model that responds in half the time is frequently the better product decision.

## Consider Operational Factors, Not Just the Model Itself

Rate limits, regional availability, data retention policies, and how quickly a provider ships breaking API changes all affect how painful it is to actually run a vendor in production. We have seen teams choose a technically excellent model and then spend weeks fighting rate limits during a traffic spike, or discover late that a provider's data handling terms do not satisfy a customer's procurement requirements. These operational details rarely show up in a marketing comparison but consistently show up in an incident channel.

## Avoid Single-Vendor Lock-In Where It Is Cheap to Do So

Where the abstraction cost is low, we recommend building a thin interface layer that makes swapping providers a configuration change rather than a rewrite. This does not mean chasing every new release, but it means that when a genuinely better or cheaper option appears, or when a provider has an extended outage, switching is a days-long project instead of a months-long one.

Vendor evaluation is ultimately a product decision as much as a technical one. The teams that get the best results are the ones that measure against their own workload and their own constraints, rather than outsourcing the decision to whichever leaderboard is trending that month.`,
      },
    ],
  });

  await db.teamMember.deleteMany();
  await db.teamMember.createMany({
    data: [
      {
        slug: 'amara-osei',
        name: 'Amara Osei',
        role: 'CEO & Co-Founder',
        order: 1,
        linkedinUrl: 'https://www.linkedin.com/in/amara-osei-metaxia',
        bio: "Amara spent seven years leading delivery teams at a mid-sized consultancy before co-founding Metaxia Solutions to build the kind of technology partner she wished she'd had as a client. She focuses on client strategy and long-term partnerships, and still reviews every proposal that leaves the building.",
      },
      {
        slug: 'daniel-voss',
        name: 'Daniel Voss',
        role: 'CTO & Co-Founder',
        order: 2,
        linkedinUrl: 'https://www.linkedin.com/in/daniel-voss-metaxia',
        bio: "Daniel has architected systems for fintech and logistics companies across three continents, with a particular focus on systems that cannot afford downtime. He sets Metaxia's engineering standards and still writes code most weeks, believing a technical leader should stay close to the work.",
      },
      {
        slug: 'priya-nair',
        name: 'Priya Nair',
        role: 'Lead Engineer',
        order: 3,
        linkedinUrl: 'https://www.linkedin.com/in/priya-nair-metaxia',
        bio: 'Priya leads the engineering team\'s most complex client projects, with deep expertise in backend architecture and cloud migrations. She previously built payment infrastructure at a Series C fintech startup before joining Metaxia.',
      },
      {
        slug: 'felix-tanaka',
        name: 'Felix Tanaka',
        role: 'Design Lead',
        order: 4,
        linkedinUrl: 'https://www.linkedin.com/in/felix-tanaka-metaxia',
        bio: 'Felix brings a decade of product design experience across consumer and enterprise software to every engagement. He believes the best design work is invisible, and pushes every project toward simplicity over decoration.',
      },
      {
        slug: 'sofia-marquez',
        name: 'Sofia Marquez',
        role: 'Product Manager',
        order: 5,
        linkedinUrl: 'https://www.linkedin.com/in/sofia-marquez-metaxia',
        bio: 'Sofia translates client goals into shippable roadmaps, and has a reputation for keeping ambitious projects on schedule without sacrificing quality. Before Metaxia, she managed product for a healthtech startup through its Series B.',
      },
      {
        slug: 'ibrahim-diallo',
        name: 'Ibrahim Diallo',
        role: 'DevOps Lead',
        order: 6,
        linkedinUrl: 'https://www.linkedin.com/in/ibrahim-diallo-metaxia',
        bio: 'Ibrahim keeps every client\'s infrastructure running reliably, from CI/CD pipelines to production incident response. He previously worked as a site reliability engineer at a large e-commerce company during multiple record-breaking sales events.',
      },
    ],
  });

  await db.job.deleteMany();
  await db.job.createMany({
    data: [
      {
        slug: 'senior-backend-engineer',
        title: 'Senior Backend Engineer',
        location: 'Remote',
        type: 'Full-time',
        body: "We're looking for a senior backend engineer to join client engagements spanning fintech, logistics, and healthtech. You'll design APIs and data models, review architecture decisions with clients, and mentor engineers earlier in their careers. We work primarily in TypeScript and Node.js, with some clients on Python and Go, so comfort picking up new stacks quickly is valuable. You should have at least five years of experience building production systems and be comfortable talking directly with client stakeholders, not just writing code behind the scenes.",
      },
      {
        slug: 'product-designer',
        title: 'Product Designer',
        location: 'Dhaka, BD',
        type: 'Full-time',
        body: "We're hiring a product designer to work across multiple client engagements, from early-stage discovery workshops through to shipped interfaces. You'll conduct user research, build design systems, and collaborate closely with engineers to make sure what ships matches the intent of the design. We're looking for someone with at least three years of product design experience and a portfolio that shows both visual craft and problem-solving process. This role is based in our Dhaka office, with occasional remote client calls outside standard hours.",
      },
      {
        slug: 'devops-contractor',
        title: 'DevOps Engineer (Contract)',
        location: 'Remote',
        type: 'Contract',
        body: "We need a contract DevOps engineer for an initial three-month engagement, with the possibility of extension, to help a client migrate their infrastructure to a multi-region setup. You'll work with our cloud architecture team to implement infrastructure-as-code, set up monitoring and alerting, and support a phased production cutover. Strong experience with Terraform, Kubernetes, and at least one major cloud provider is required. This is a fully remote, contract-based role with flexible hours across time zones.",
      },
      {
        slug: 'junior-frontend-engineer',
        title: 'Junior Frontend Engineer',
        location: 'Dhaka, BD',
        type: 'Full-time',
        body: "We're looking for a junior frontend engineer eager to grow their career working on real client products from day one. You'll work alongside senior engineers building interfaces in React and Next.js, with structured code review and mentorship built into every sprint. We don't expect deep expertise yet, but we do expect strong fundamentals in JavaScript, curiosity, and a habit of asking good questions. This is an in-office role based in our Dhaka location, ideal for someone early in their engineering career who wants fast growth.",
      },
    ],
  });

  await db.pricingPlan.deleteMany();
  await db.pricingPlan.createMany({
    data: [
      {
        name: 'Starter',
        price: 499,
        period: 'per month',
        order: 1,
        highlighted: false,
        description: 'For small teams that need a reliable technology partner for one focused project at a time.',
        featuresJson: JSON.stringify([
          'Up to 20 hours of engineering per month',
          'Single active project',
          'Async communication via Slack and email',
          'Monthly progress report',
          'Standard support (48-hour response)',
        ]),
      },
      {
        name: 'Growth',
        price: 1499,
        period: 'per month',
        order: 2,
        highlighted: true,
        description: 'For growing companies running multiple concurrent workstreams and needing faster turnaround.',
        featuresJson: JSON.stringify([
          'Up to 80 hours of engineering per month',
          'Up to 3 concurrent projects',
          'Dedicated project manager',
          'Weekly strategy calls',
          'Priority support (24-hour response)',
          'Quarterly architecture review',
        ]),
      },
      {
        name: 'Enterprise',
        price: 4999,
        period: 'per month',
        order: 3,
        highlighted: false,
        description: 'For organizations that need a full embedded team and guaranteed capacity across their roadmap.',
        featuresJson: JSON.stringify([
          'Dedicated cross-functional team',
          'Unlimited concurrent projects',
          '24/7 on-call support',
          'Custom SLAs and reporting',
          'Dedicated security and compliance reviews',
          'Executive quarterly business reviews',
        ]),
      },
    ],
  });

  await db.faqItem.deleteMany();
  await db.faqItem.createMany({
    data: [
      {
        order: 1,
        question: 'What does your project process look like?',
        answer: 'Every engagement starts with a discovery phase where we align on goals, scope, and success metrics, typically over one to two weeks. From there we work in two-week sprints with regular demos, so you see progress continuously rather than waiting for a single big reveal at the end. Each sprint ends with a review where we adjust priorities based on what we\'ve learned.',
      },
      {
        order: 2,
        question: 'How does pricing work?',
        answer: 'We offer both fixed-scope project pricing and monthly retainer plans, depending on what fits your engagement best. Fixed-scope pricing works well for clearly defined projects with a known deliverable, while retainers suit ongoing work across a changing set of priorities. We\'ll recommend the model that fits after understanding your goals in the discovery phase.',
      },
      {
        order: 3,
        question: 'How long do typical projects take?',
        answer: 'Timelines vary by scope, but most standalone projects run between six and sixteen weeks from kickoff to launch. Ongoing retainer engagements have no fixed end date and continue as long as there\'s valuable work to do. We\'ll give you a concrete estimate before any contract is signed, based on a detailed scoping session.',
      },
      {
        order: 4,
        question: 'What kind of support do you offer after launch?',
        answer: 'All engagements include a support window after launch to fix any issues that surface under real usage, typically 30 days for project-based work. Beyond that, we offer ongoing maintenance retainers that cover bug fixes, dependency updates, and monitoring. Growth and Enterprise plan clients receive priority support with faster response times.',
      },
      {
        order: 5,
        question: 'What technology stack do you use?',
        answer: "We primarily build with TypeScript across the stack, using React and Next.js on the frontend and Node.js or NestJS on the backend, though we adapt to a client's existing stack when migration isn't practical. For infrastructure, we work across AWS, GCP, and Azure depending on client preference and existing investment. We choose boring, well-supported technology by default and reach for something more specialized only when there's a clear reason to.",
      },
      {
        order: 6,
        question: 'Who owns the code and IP once the project is finished?',
        answer: "You do. Every contract we sign transfers full ownership of the code, designs, and any custom tooling built during the engagement to you upon final payment. We don't retain licensing rights or require ongoing fees to use what we built. You're free to take the codebase to another team at any time.",
      },
      {
        order: 7,
        question: 'Will you sign an NDA before we share details about our project?',
        answer: "Yes. We're happy to sign a mutual NDA before any detailed discussion of your project, and we treat every client's information as confidential by default, NDA or not. Our team only accesses the systems and data necessary for their specific role on your engagement. We can work with your standard NDA template or provide our own.",
      },
      {
        order: 8,
        question: 'Do you offer ongoing maintenance after a project ships?',
        answer: "Yes, most clients move to a maintenance retainer once their initial project ships, covering security patches, dependency upgrades, and small enhancements. Retainers are scoped in blocks of hours per month and can flex up during busier periods. If priorities shift, you can pause or adjust a maintenance retainer with 30 days' notice.",
      },
    ],
  });

  await db.testimonial.deleteMany();
  await db.testimonial.createMany({
    data: [
      {
        order: 1,
        quote: 'Metaxia rebuilt our checkout flow in under two months and conversion went up 22 percent in the first quarter after launch.',
        author: 'Rachel Kim',
        company: 'Northbound Retail',
      },
      {
        order: 2,
        quote: "They didn't just take our spec and build it — they pushed back on ideas that wouldn't scale and made the product better for it.",
        author: 'Tomas Alvarez',
        company: 'Fenwick Logistics',
      },
      {
        order: 3,
        quote: 'Our AI support copilot has resolved a third of tickets automatically since launch. The Metaxia team understood our support workflow better than some of our own staff did at first.',
        author: 'Grace Mbeki',
        company: 'Loopwave',
      },
      {
        order: 4,
        quote: "The cloud migration was the smoothest infrastructure project I've been part of in fifteen years of engineering leadership. Zero downtime, on budget, ahead of schedule.",
        author: 'Hana Yoshida',
        company: 'Aster Health',
      },
      {
        order: 5,
        quote: 'Working with Metaxia felt like adding a senior team to our roadmap overnight. Communication was clear and we always knew exactly where the project stood.',
        author: 'Marcus Webb',
        company: 'Trellis Finance',
      },
    ],
  });

  const [
    serviceCount,
    caseStudyCount,
    postCount,
    teamMemberCount,
    jobCount,
    pricingPlanCount,
    faqItemCount,
    testimonialCount,
    adminUserCount,
  ] = await Promise.all([
    db.service.count(),
    db.caseStudy.count(),
    db.post.count(),
    db.teamMember.count(),
    db.job.count(),
    db.pricingPlan.count(),
    db.faqItem.count(),
    db.testimonial.count(),
    db.adminUser.count(),
  ]);

  console.log(
    `Seed complete: services=${serviceCount} caseStudies=${caseStudyCount} posts=${postCount} teamMembers=${teamMemberCount} jobs=${jobCount} pricingPlans=${pricingPlanCount} faqItems=${faqItemCount} testimonials=${testimonialCount} adminUsers=${adminUserCount}`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
