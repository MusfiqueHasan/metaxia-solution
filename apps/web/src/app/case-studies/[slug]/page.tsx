import type { Metadata } from 'next';
import { readdirSync } from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { CaseStudy } from '@metaxia/shared';
import { getCaseStudies } from '@/lib/api';
import { site } from '@/lib/site';
import { Container } from '@/components/container';
import { Button } from '@/components/button';
import { Reveal } from '@/components/motion/reveal';
import { SplitWords } from '@/components/motion/split-words';
import { Starfield } from '@/components/motion/starfield';
import { JsonLd } from '@/components/json-ld';

export async function generateStaticParams() {
  const caseStudies = await getCaseStudies();
  return caseStudies.map((item) => ({ slug: item.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseStudies = await getCaseStudies();
  const caseStudy = caseStudies.find((item) => item.slug === slug);
  if (!caseStudy) return { title: 'Not found' };

  return {
    title: caseStudy.title,
    description: caseStudy.excerpt,
    alternates: { canonical: `/case-studies/${caseStudy.slug}` },
    openGraph: {
      title: caseStudy.title,
      description: caseStudy.excerpt,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Body parsing: the seeded markdown follows intro / ## The challenge  */
/* / ## What we built / ## The rollout / ## Results. We split it into  */
/* those sections so each can get its own numbered layout.             */
/* ------------------------------------------------------------------ */

interface Sections {
  intro: string;
  challenge: string[];
  built: string[];
  rollout: string[];
  results: string[];
}

function parseBody(body: string): Sections {
  const sections: Sections = { intro: '', challenge: [], built: [], rollout: [], results: [] };
  let current: keyof Sections | null = null;

  for (const block of body.split(/\n\n+/)) {
    if (block.startsWith('## ')) {
      const heading = block.slice(3).toLowerCase();
      if (heading.includes('challenge')) current = 'challenge';
      else if (heading.includes('built')) current = 'built';
      else if (heading.includes('rollout')) current = 'rollout';
      else if (heading.includes('result')) current = 'results';
      else current = null;
      continue;
    }
    if (current === null) {
      sections.intro = sections.intro ? `${sections.intro}\n\n${block}` : block;
    } else {
      sections[current].push(block);
    }
  }
  return sections;
}

const bullets = (blocks: string[]) =>
  blocks.flatMap((block) =>
    block
      .split('\n')
      .filter((line) => line.startsWith('- '))
      .map((line) => line.slice(2)),
  );

const prose = (blocks: string[]) => blocks.filter((block) => !block.startsWith('- '));

/** Screenshots dropped into public/projects as `<slug>-*.png|jpg|webp`. */
function galleryImages(slug: string): { src: string; label: string }[] {
  try {
    return readdirSync(path.join(process.cwd(), 'public', 'projects'))
      .filter((f) => f.startsWith(`${slug}-`) && /\.(png|jpe?g|webp)$/i.test(f))
      .sort()
      .map((f) => ({
        src: `/projects/${f}`,
        label: f
          .replace(`${slug}-`, '')
          .replace(/\.(png|jpe?g|webp)$/i, '')
          .replace(/[-_]/g, ' '),
      }));
  } catch {
    return [];
  }
}

/* Per-project stack pills; falls back to the category defaults below. */
const SLUG_STACKS: Record<string, string[]> = {
  kryzotech: ['TypeScript', 'Node.js', 'MongoDB', 'Redux', 'Socket.io', 'EPS payments'],
  smarthrflow: ['Next.js', 'TypeScript', 'NestJS', 'Supabase', 'OpenAI API', 'Vercel'],
};

/* Curated gallery per slug: choose the shots and pair them with copy.
   Slugs without an entry fall back to every <slug>-* file in
   public/projects, captioned from the filename. */
interface GalleryEntry {
  src: string;
  label: string;
  text?: string;
  points?: string[];
}

const SLUG_GALLERY: Record<string, GalleryEntry[]> = {
  kryzotech: [
    {
      src: '/projects/kryzotech-admin.webp',
      label: 'admin workspace',
      text: 'The whole learning platform runs from one workspace: the overview lands on live counts for active courses, workshops, blog posts, and enrollments, with quick actions into every module.',
      points: [
        'Overview — snapshot of courses, workshops, blog, and enrollments',
        'Analytics & Expenses — sales, costs, and per-course P&L',
        'Courses, Categories & Workshops — build and organize the catalog',
        'Blog & Posts — tutorials, announcements, and the student feed',
        'Users, Enrollments & Management — students, payments, controls',
        'Website content — trainers, reviews, and partners on the public site',
      ],
    },
  ],
  smarthrflow: [
    {
      src: '/projects/smarthrflow-hire.webp',
      label: 'hiring pipeline',
      text: 'Every role gets a live pipeline: candidates arrive parsed and scored, then move through named stages with counts at a glance — no spreadsheet shadowing the process.',
      points: [
        'Stages from application to hired — shortlist, HR and technical interviews, offer',
        'Per-candidate AI score against the role, recalculable on demand',
        'Top-candidate surfacing above the applicant pool',
        'Search, filter, sort, and stage controls inline',
        'Credit-based posting with add-candidate and share actions',
      ],
    },
  ],
};

/* Presentational dummy facts, deterministic per category (no schema change). */
const TIMELINES = ['8 weeks', '12 weeks', '6 weeks', '10 weeks'];
const STACKS: Record<string, string[]> = {
  Software: ['TypeScript', 'Event sourcing', 'Postgres', 'CI/CD', 'Observability'],
  Design: ['Design tokens', 'Figma + React', 'Storybook', 'Usability testing'],
  Cloud: ['AWS', 'Terraform', 'Multi-region', 'Load testing', 'FinOps'],
  AI: ['RAG pipeline', 'Eval harness', 'Confidence gating', 'Dashboards'],
};

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const allCaseStudies = (await getCaseStudies()).sort((a, b) => a.order - b.order);
  const index = allCaseStudies.findIndex((item) => item.slug === slug);
  const caseStudy: CaseStudy | undefined = index >= 0 ? allCaseStudies[index] : undefined;
  if (!caseStudy) notFound();

  const next = index < allCaseStudies.length - 1 ? allCaseStudies[index + 1] : allCaseStudies[0];
  const sections = parseBody(caseStudy.body);
  const builtBullets = bullets(sections.built);
  const resultBullets = bullets(sections.results);
  const timeline = TIMELINES[index % TIMELINES.length];
  const stack =
    SLUG_STACKS[caseStudy.slug] ?? STACKS[caseStudy.category] ?? ['TypeScript', 'Postgres', 'CI/CD'];
  const gallery: GalleryEntry[] = SLUG_GALLERY[caseStudy.slug] ?? galleryImages(caseStudy.slug);
  let sectionNo = 0;
  const nextNo = () => String(++sectionNo).padStart(2, '0');
  const year = String(2024 + ((index + 1) % 3));

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Case Studies', item: `${site.url}/case-studies` },
      { '@type': 'ListItem', position: 3, name: caseStudy.title, item: `${site.url}/case-studies/${caseStudy.slug}` },
    ],
  };

  const domain = caseStudy.websiteUrl ? new URL(caseStudy.websiteUrl).hostname : null;

  const facts = [
    { k: 'Client', v: 'Confidential · reference on request' },
    { k: 'Sector', v: caseStudy.category },
    { k: 'Timeline', v: timeline },
    domain
      ? { k: 'Live', v: domain, href: caseStudy.websiteUrl as string }
      : { k: 'Status', v: 'In production' },
  ] as { k: string; v: string; href?: string }[];

  return (
    <main className="grain relative overflow-hidden bg-ink">
      <Starfield />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Hero: back link, kicker + meta, serif title, lead, facts grid */}
      <section className="relative border-b border-line">
        <Container className="relative pb-16 pt-36 lg:pb-20 lg:pt-44">
          <Reveal>
            <Link
              href="/case-studies"
              className="reveal-fade inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-fg-soft transition-colors hover:text-fg"
            >
              <span aria-hidden="true">←</span> All case studies
            </Link>

            <p className="reveal-fade mt-10 flex flex-wrap items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.26em] text-fg-soft">
              <span className="text-accent">Case study</span>
              <span className="text-fg-soft/50">·</span>
              {year} · {caseStudy.category}
            </p>

            <h1 className="mt-7 max-w-4xl font-display text-[clamp(2.5rem,6vw,5rem)] leading-[1.02] tracking-[-0.01em] text-fg">
              <SplitWords text={caseStudy.title} from={0.08} />
            </h1>

            <p
              className="reveal-rise mt-7 max-w-2xl text-lg leading-relaxed text-fg-soft"
              style={{ ['--reveal-delay' as string]: '0.35s' }}
            >
              {caseStudy.excerpt}
            </p>

            {/* The case's gradient survives as its identity stripe. */}
            <div
              aria-hidden="true"
              className="reveal-scale mt-10 h-1.5 w-40 rounded-full"
              style={{ background: caseStudy.coverGradient, ['--reveal-delay' as string]: '0.45s' }}
            />

            <dl
              className="reveal-fade mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-8 sm:grid-cols-4"
              style={{ ['--reveal-delay' as string]: '0.5s' }}
            >
              {facts.map((fact) => (
                <div key={fact.k}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-soft/70">
                    {fact.k}
                  </dt>
                  <dd className="mt-2 text-sm text-fg">
                    {fact.href ? (
                      <a
                        href={fact.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-rule transition-colors hover:text-accent-strong"
                      >
                        {fact.v} <span aria-hidden="true">↗</span>
                      </a>
                    ) : (
                      fact.v
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            {caseStudy.websiteUrl ? (
              <div className="reveal-rise mt-10" style={{ ['--reveal-delay' as string]: '0.6s' }}>
                <a
                  href={caseStudy.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="Visit"
                  className="group inline-flex items-center gap-2.5 rounded-full border border-line-strong px-6 py-3 text-sm font-medium text-fg transition-colors duration-300 hover:border-fg/40 hover:bg-fg/5"
                >
                  Visit website
                  <span
                    aria-hidden="true"
                    className="text-xs transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                  {domain ? (
                    <span className="font-mono text-[11px] text-fg-soft">{domain}</span>
                  ) : null}
                </a>
              </div>
            ) : null}
          </Reveal>
        </Container>
      </section>

      {/* Website preview — the live site's hero, framed */}
      {caseStudy.previewImage ? (
        <section className="relative">
          <Container className="py-10 lg:py-14">
            <Reveal>
              <a
                href={caseStudy.websiteUrl ?? `/case-studies/${caseStudy.slug}`}
                target={caseStudy.websiteUrl ? '_blank' : undefined}
                rel={caseStudy.websiteUrl ? 'noopener noreferrer' : undefined}
                data-cursor={caseStudy.websiteUrl ? 'Visit' : undefined}
                className="reveal-scale group block overflow-hidden rounded-3xl border border-line"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={caseStudy.previewImage}
                  alt={`${caseStudy.title} — website hero preview`}
                  className="w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.015]"
                  loading="lazy"
                />
              </a>
              {domain ? (
                <p className="reveal-fade mt-4 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-fg-soft/70">
                  {domain} — live hero
                </p>
              ) : null}
            </Reveal>
          </Container>
        </section>
      ) : null}

      {/* (01) The challenge */}
      <CaseSection n={nextNo()} title="The challenge">
        {sections.intro ? (
          <p className="font-display text-2xl leading-snug tracking-[-0.01em] text-fg sm:text-3xl">
            {sections.intro}
          </p>
        ) : null}
        {prose(sections.challenge).map((block, i) => (
          <p key={i} className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.85] text-fg-soft">
            {block}
          </p>
        ))}
      </CaseSection>

      {/* (02) What Metaxia built */}
      <CaseSection n={nextNo()} title="What Metaxia built">
        {prose(sections.built).map((block, i) => (
          <p key={i} className="max-w-2xl text-[1.0625rem] leading-[1.85] text-fg-soft">
            {block}
          </p>
        ))}
        {builtBullets.length > 0 ? (
          <ul className="mt-8 space-y-4">
            {builtBullets.map((item, i) => (
              <li key={i} className="flex items-start gap-4 text-[1.0625rem] leading-[1.7] text-fg-soft">
                <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        ) : null}
      </CaseSection>

      {/* Product gallery — screenshots from public/projects, when present */}
      {gallery.length > 0 ? (
        <CaseSection n={nextNo()} title="Inside the product">
          <div className={`grid gap-6 ${gallery.length > 1 ? 'lg:grid-cols-2' : ''}`}>
            {gallery.map((image, i) => (
              <div key={image.src} className={image.text ? 'flex flex-col gap-10' : ''}>
                {image.text ? (
                  <div className="reveal-rise" style={{ ['--reveal-delay' as string]: '0.1s' }}>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                      {image.label}
                    </p>
                    <p className="mt-4 max-w-2xl text-base leading-[1.75] text-fg-soft">{image.text}</p>
                    {image.points ? (
                      <ul className="mt-5 grid gap-x-10 gap-y-2.5 sm:grid-cols-2">
                        {image.points.map((point) => (
                          <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-fg-soft">
                            <span
                              aria-hidden="true"
                              className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rotate-45 bg-accent"
                            />
                            {point}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : null}
                <figure
                  className="reveal-scale group overflow-hidden rounded-2xl border border-line-strong bg-ink-raised"
                  style={{ ['--reveal-delay' as string]: `${0.25 + i * 0.12}s` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.src}
                    alt={`${caseStudy.title} — ${image.label}`}
                    loading="lazy"
                    className="w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                  />
                  <figcaption className="border-t border-line px-5 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-soft">
                    {image.label}
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </CaseSection>
      ) : null}

      {/* (03) Delivery */}
      <CaseSection n={nextNo()} title="Delivery">
        {prose(sections.rollout).map((block, i) => (
          <p key={i} className="max-w-2xl text-[1.0625rem] leading-[1.85] text-fg-soft">
            {block}
          </p>
        ))}
        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-soft/70">
          Timeline: {timeline} · one accountable team
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {stack.map((item) => (
            <span key={item} className="rounded-full border border-line px-3 py-1 text-xs text-fg-soft">
              {item}
            </span>
          ))}
        </div>
      </CaseSection>

      {/* (04) What changed — results as stat cards */}
      {resultBullets.length > 0 ? (
        <CaseSection n={nextNo()} title="What changed">
          <div className="grid gap-5 sm:grid-cols-2">
            {resultBullets.map((item, i) => (
              <div
                key={i}
                className="reveal-rise rounded-3xl border border-line bg-ink-raised/70 p-7 backdrop-blur-sm"
                style={{ ['--reveal-delay' as string]: `${i * 0.08}s` }}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                  Result {String(i + 1).padStart(2, '0')}
                </span>
                <p className="mt-3 font-display text-xl leading-snug tracking-[-0.01em] text-fg">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </CaseSection>
      ) : null}

      {/* Closing: build-something-similar band + next case */}
      <section className="relative border-t border-line">
        <Container className="py-20 text-center lg:py-24">
          <Reveal className="flex flex-col items-center gap-8">
            <p className="reveal-fade font-mono text-[11px] uppercase tracking-[0.3em] text-fg-soft">
              Building something similar?
            </p>
            <h2 className="max-w-3xl font-display text-4xl leading-[1.05] tracking-[-0.01em] text-fg sm:text-5xl">
              <SplitWords text="Scoped plan and a" />{' '}
              <em className="text-accent-strong">
                <SplitWords text="fixed quote," from={0.2} />
              </em>{' '}
              <SplitWords text="before you commit." from={0.3} />
            </h2>
            <div
              className="reveal-rise flex flex-wrap items-center justify-center gap-4"
              style={{ ['--reveal-delay' as string]: '0.4s' }}
            >
              <Button href="/contact" size="lg" magnetic>
                Start a project
              </Button>
              <Link
                href={`/case-studies/${next.slug}`}
                data-cursor="Next"
                className="group inline-flex items-center gap-2.5 px-4 text-sm font-medium text-fg-soft transition-colors hover:text-fg"
              >
                Next case: {next.title.length > 38 ? `${next.title.slice(0, 38)}…` : next.title}
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}

function CaseSection({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="relative">
      <Container className="py-10 lg:py-14">
        <Reveal threshold={0.3}>
          {/* Rule that draws itself across as the section arrives */}
          <span aria-hidden="true" className="reveal-draw-x mb-10 block h-px w-full bg-line-strong" />

          <div className="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
            <div className="relative lg:pl-6">
              {/* Ink line tracing down the marker column */}
              <span
                aria-hidden="true"
                className="reveal-draw-y absolute left-0 top-1 hidden h-full w-px bg-gradient-to-b from-accent via-line-strong to-transparent lg:block"
                style={{ ['--reveal-delay' as string]: '0.15s' }}
              />
              <p
                className="reveal-rise font-mono text-sm text-accent"
                style={{ ['--reveal-delay' as string]: '0.1s' }}
              >
                ({n})
              </p>
              <h2 className="mt-2 font-display text-2xl tracking-[-0.01em] text-fg">
                <SplitWords text={title} from={0.2} step={0.07} />
              </h2>
            </div>
            <div className="reveal-rise" style={{ ['--reveal-delay' as string]: '0.3s' }}>
              {children}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
