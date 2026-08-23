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
        body: 'We assess your current infrastructure, design a target architecture on AWS, GCP, or Azure, and run the migration with zero-downtime cutover strategies. Our engagements cover landing zones, IaC baselines, and FinOps guardrails so your platform stays fast and affordable as it grows.',
      },
      {
        slug: 'web-development',
        title: 'Web Development',
        icon: 'code',
        order: 2,
        excerpt: 'Product-grade web applications built with modern frameworks.',
        body: 'Our engineering teams build fast, accessible web applications using React, Next.js, and Node.js, backed by strong typing and automated test coverage. We favor component-driven design systems that let your product team ship new screens without waiting on engineering for every layout change. Performance budgets, Core Web Vitals monitoring, and progressive enhancement are baked into every sprint rather than bolted on at the end. From marketing sites to complex internal tools, we deliver codebases that new engineers can understand within a day of joining.',
      },
      {
        slug: 'data-security',
        title: 'Data Security',
        icon: 'shield',
        order: 3,
        excerpt: 'Security assessments and hardening for applications, infrastructure, and data pipelines.',
        body: 'We run threat modeling workshops, penetration tests, and infrastructure audits to find gaps before attackers do. Our team implements encryption at rest and in transit, secrets management, and least-privilege access controls across your cloud accounts. We help you reach compliance milestones such as SOC 2 and ISO 27001 without freezing your roadmap. Ongoing monitoring and incident-response runbooks keep your team prepared long after the initial engagement ends.',
      },
      {
        slug: 'mobile-apps',
        title: 'Mobile Apps',
        icon: 'smartphone',
        order: 4,
        excerpt: 'Native and cross-platform mobile apps built for reliability at scale.',
        body: 'We design and build iOS and Android applications using React Native and native Swift or Kotlin when performance demands it. Every release goes through device-lab testing across a range of screen sizes, OS versions, and network conditions before it reaches your users. We set up crash reporting, analytics, and phased rollouts so issues surface early and rollbacks are painless. Our mobile practice also covers offline-first data sync and push notification infrastructure for apps that need to work anywhere.',
      },
      {
        slug: 'ai-integration',
        title: 'AI Integration',
        icon: 'sparkles',
        order: 5,
        excerpt: 'Practical AI features woven into your existing product, not bolted on as a demo.',
        body: "We help teams identify where large language models and machine learning actually move the needle, then ship production-grade integrations rather than one-off prototypes. Our work spans retrieval-augmented search, document extraction, customer support copilots, and internal automation tools. We pay close attention to cost per request, latency, and evaluation pipelines so your AI features stay reliable as usage grows. Every integration ships with guardrails, logging, and a clear fallback path for when a model call fails or returns low-confidence output.",
      },
      {
        slug: 'seo-optimization',
        title: 'SEO Optimization',
        icon: 'trending-up',
        order: 6,
        excerpt: 'Technical and content SEO that turns organic search into a growth channel.',
        body: 'We start with a full technical audit covering site speed, crawlability, structured data, and Core Web Vitals, then fix the issues holding your rankings back. Our content strategy pairs keyword research with a realistic publishing cadence your team can actually sustain. We track rankings, organic traffic, and conversion rate together, not vanity metrics in isolation. Most engagements include a quarterly roadmap review so your SEO investment keeps compounding instead of plateauing after the first few wins.',
      },
    ],
  });

  await db.caseStudy.deleteMany();
  await db.caseStudy.createMany({
    data: [
      {
        slug: 'fintech-ledger-modernization',
        title: 'Modernizing a Multi-Currency Ledger for a Fintech Scale-up',
        category: 'Software',
        order: 1,
        coverGradient: 'linear-gradient(135deg,#0ea5e9,#6366f1)',
        excerpt: 'We replaced a decade-old batch ledger with an event-sourced platform that now settles transactions in real time.',
        body: "The client's ledger ran nightly batch jobs that delayed reconciliation by up to 18 hours and made multi-currency support brittle. We re-architected the system around event sourcing and CQRS, giving finance teams a real-time view of balances across 12 currencies. The migration ran in parallel with the legacy system for six weeks, with automated reconciliation checks catching every discrepancy before cutover. Post-launch, transaction processing time dropped from minutes to under 200 milliseconds, and the finance team closed month-end books three days faster. The new architecture has since scaled to 40 million transactions a month without a single unplanned outage.",
      },
      {
        slug: 'logistics-marketplace-rebuild',
        title: 'Rebuilding a Logistics Marketplace on a Modern Stack',
        category: 'Software',
        order: 2,
        coverGradient: 'linear-gradient(135deg,#f97316,#ec4899)',
        excerpt: 'A legacy PHP monolith was replaced with a modular TypeScript platform, cutting page load times by 70 percent.',
        body: "The client's freight-matching marketplace had grown past what its original PHP monolith could support, with deploys taking hours and outages spiking during peak shipping season. We split the platform into a set of well-bounded services behind a GraphQL gateway, migrating features incrementally so the business never paused operations. Automated end-to-end tests replaced a manual QA process that previously took two days per release. Average page load time fell from 4.2 seconds to 1.1 seconds, and the engineering team went from monthly releases to shipping several times a week. Carrier onboarding, previously a two-week manual process, is now largely self-serve.",
      },
      {
        slug: 'design-system-unification',
        title: 'Unifying a Fragmented Design System Across Five Products',
        category: 'Design',
        order: 3,
        coverGradient: 'linear-gradient(135deg,#a855f7,#f43f5e)',
        excerpt: 'We consolidated five inconsistent product UIs into a single token-based design system used by every squad.',
        body: 'Five product teams had each built their own component libraries over the years, leading to visual drift and duplicated engineering effort. We audited every screen across the suite, extracted a shared set of design tokens, and rebuilt the core component library in Figma and React side by side. Rollout was staged product by product, with a compatibility layer so teams could adopt new components without a big-bang rewrite. Within four months, all five products shared one visual language, and new-component development time dropped by roughly half. Design and engineering now review changes from a single source of truth instead of five diverging ones.',
      },
      {
        slug: 'healthtech-onboarding-redesign',
        title: 'Redesigning Patient Onboarding for a Telehealth App',
        category: 'Design',
        order: 4,
        coverGradient: 'linear-gradient(135deg,#22c55e,#0ea5e9)',
        excerpt: 'A confusing five-step signup flow was redesigned around patient needs, lifting completion rates by 34 percent.',
        body: "New patients were abandoning the telehealth app's onboarding flow at a rate that alarmed the clinical operations team. We ran contextual interviews with recent drop-offs, mapped every friction point, and redesigned the flow around the three pieces of information patients actually needed to provide up front. Insurance verification and medical history collection were moved later in the journey and handled asynchronously instead of blocking access to care. We validated the new flow with a series of usability tests before a phased rollout to production. Completion rates rose by 34 percent within the first month, and support tickets related to signup fell by more than half.",
      },
      {
        slug: 'ecommerce-multi-region-migration',
        title: 'Multi-Region Cloud Migration for a Growing E-commerce Brand',
        category: 'Cloud',
        order: 5,
        coverGradient: 'linear-gradient(135deg,#0891b2,#4f46e5)',
        excerpt: "We moved a single-region deployment onto a multi-region architecture to survive Black Friday traffic without downtime.",
        body: "The client's single-region infrastructure had come dangerously close to falling over during the previous two Black Friday sales. We designed a multi-region active-active architecture on AWS, with database replication and a global load balancer routing traffic to the healthiest region. Load testing simulated ten times the client's historical peak traffic before we scheduled the cutover during a low-traffic maintenance window. The following Black Friday, the platform handled a new traffic record with zero downtime and page response times under 300 milliseconds throughout the day. The client's infrastructure spend also dropped 18 percent thanks to better instance right-sizing and reserved capacity planning.",
      },
      {
        slug: 'streaming-cost-optimization',
        title: 'Cutting Cloud Costs 42 Percent for a Media Streaming Startup',
        category: 'Cloud',
        order: 6,
        coverGradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
        excerpt: 'A detailed infrastructure audit uncovered idle resources and inefficient storage tiers, cutting monthly cloud spend nearly in half.',
        body: "The client's cloud bill had tripled in a year without a corresponding increase in usage, and no one on the team had bandwidth to investigate why. We audited every service, compute instance, and storage bucket, and found significant waste in over-provisioned transcoding servers and infrequently accessed video stored on premium-tier disks. We introduced auto-scaling for transcoding workloads tied to actual upload volume and moved cold content to lower-cost archival storage with lifecycle policies. A tagging and budgeting system now gives engineering leads visibility into spend by feature team. Monthly cloud costs dropped 42 percent within the first quarter, freeing up budget the client redirected into hiring.",
      },
      {
        slug: 'b2b-support-copilot',
        title: 'Building an AI Support Copilot for a B2B SaaS Platform',
        category: 'AI',
        order: 7,
        coverGradient: 'linear-gradient(135deg,#8b5cf6,#06b6d4)',
        excerpt: 'A retrieval-augmented assistant now resolves a third of support tickets before they reach a human agent.',
        body: "The client's support team was buried under repetitive tickets that mostly required searching the same handful of documentation pages. We built a retrieval-augmented copilot that indexes the knowledge base, past resolved tickets, and product changelog, then drafts responses grounded in that material for agent review. Confidence scoring routes uncertain answers straight to a human rather than risking an incorrect response reaching a customer. We instrumented the system with detailed evaluation dashboards so the support team could tune prompts and retrieval settings without engineering involvement. Within two months, the copilot was fully resolving 31 percent of incoming tickets and cutting average handling time on the rest by nearly a third.",
      },
      {
        slug: 'insurance-document-intelligence',
        title: 'Automating Document Intelligence for an Insurance Provider',
        category: 'AI',
        order: 8,
        coverGradient: 'linear-gradient(135deg,#ec4899,#f97316)',
        excerpt: 'An AI-powered extraction pipeline now processes claims documents that used to take adjusters hours to review manually.',
        body: 'Claims adjusters were spending the bulk of each day manually reading scanned PDFs to pull out policy numbers, damage estimates, and dates. We built a document intelligence pipeline combining OCR, layout-aware extraction models, and a validation layer that flags low-confidence fields for human review instead of guessing. The system integrates directly with the client\'s existing claims management software, so adjusters see extracted data pre-filled the moment a document arrives. We ran the pipeline in shadow mode against six months of historical claims to validate accuracy before go-live. Average document review time fell from 22 minutes to under 3 minutes, letting the adjuster team handle a 40 percent higher claims volume without adding headcount.',
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
