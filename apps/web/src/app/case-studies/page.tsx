import type { Metadata } from 'next';
import Link from 'next/link';
import type { CaseStudy } from '@metaxia/shared';
import { getCaseStudies } from '@/lib/api';
import { Container } from '@/components/container';
import { Reveal } from '@/components/motion/reveal';
import { SplitWords } from '@/components/motion/split-words';
import { Starfield } from '@/components/motion/starfield';
import { Tilt } from '@/components/motion/tilt';

export const metadata: Metadata = {
  title: 'Case Studies',
  description: 'Systems Metaxia has designed, shipped, and scaled for clients across industries.',
  alternates: { canonical: '/case-studies' },
  openGraph: {
    title: 'Case Studies',
    description: 'Systems Metaxia has designed, shipped, and scaled for clients across industries.',
  },
};

/* Presentational extras the API does not model yet (year, scope, pills are
   dummy but deterministic per case — swap for real fields later). */
const SCOPES: Record<string, string> = {
  Software: 'Architecture · Build · Launch',
  Design: 'Research · Design · Launch',
  Cloud: 'Audit · Migration · Launch',
  AI: 'Feasibility · Build · Launch',
};

const PILLS: Record<string, string[]> = {
  Software: ['Event-driven', 'TypeScript', 'Production'],
  Design: ['Design system', 'UX research', 'Figma + React'],
  Cloud: ['AWS', 'Multi-region', 'FinOps'],
  AI: ['RAG', 'Evals', 'Guardrails'],
};

const extras = (item: CaseStudy, index: number) => ({
  year: String(2024 + ((index + 1) % 3)),
  scope: SCOPES[item.category] ?? 'Design · Build · Launch',
  pills: PILLS[item.category] ?? ['B2B', 'Systems', 'Launch'],
});

/** Split a long title at its midpoint word so it sets on two balanced lines. */
function splitTitle(title: string): [string, string] {
  const words = title.split(' ');
  if (words.length < 4) return [title, ''];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();

  const stats = [
    { n: `${String(caseStudies.length).padStart(2, '0')}+`, l: 'Systems shipped' },
    { n: '6', l: 'Week avg. first release' },
    { n: '99.9%', l: 'Uptime median' },
  ];

  return (
    // One continuous observatory backdrop: the hero's starfield + grain run
    // behind every case row, not just the opening section.
    <main className="grain relative overflow-hidden bg-ink">
      <Starfield />
      {/* Hero — kicker, serif thesis, lead, stat row, scroll cue */}
      <section className="relative border-b border-line">
        <Container className="relative pb-24 pt-40 lg:pb-28 lg:pt-48">
          <Reveal>
            <p className="reveal-fade flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-fg-soft">
              <span className="inline-block h-px w-6 bg-line-strong" aria-hidden="true" />
              Selected work · 2024–2026
            </p>

            <h1 className="mt-8 max-w-4xl font-display text-[clamp(3rem,7.5vw,6.5rem)] leading-[0.98] tracking-[-0.01em] text-fg">
              <SplitWords text="Case studies" from={0.08} />{' '}
              <em className="text-accent-strong">
                <SplitWords text="& results." from={0.3} />
              </em>
            </h1>

            <p
              className="reveal-rise mt-8 max-w-xl text-lg leading-relaxed text-fg-soft"
              style={{ ['--reveal-delay' as string]: '0.4s' }}
            >
              Systems for fintech, logistics, health, and media businesses — scoped against
              production traffic, conversion, and cost, not screenshots. Every case below is
              live today.
            </p>

            <div
              className="reveal-fade mt-16 flex flex-wrap gap-x-16 gap-y-6 border-t border-line pt-8"
              style={{ ['--reveal-delay' as string]: '0.6s' }}
            >
              {stats.map((stat) => (
                <div key={stat.l} className="flex flex-col gap-1">
                  <span className="font-display text-4xl tabular-nums text-fg">{stat.n}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-soft">
                    {stat.l}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>

        <div
          aria-hidden="true"
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg-soft/60">
            scroll
          </span>
          <span className="block h-8 w-px bg-gradient-to-b from-fg-soft/60 to-transparent" />
        </div>
      </section>

      {/* Case index — alternating full-width editorial rows */}
      <section className="relative">
        {caseStudies.length > 0 ? (
          caseStudies.map((item, index) => {
            const { year, scope, pills } = extras(item, index);
            const [lineA, lineB] = splitTitle(item.title);
            const flip = index % 2 === 1;

            return (
              <article key={item.id} className="border-b border-line last:border-b-0">
                <Container className="py-20 lg:py-28">
                  <Reveal>
                    <div
                      className={`grid items-center gap-12 lg:gap-20 ${
                        flip ? 'lg:grid-cols-[1fr_1.05fr]' : 'lg:grid-cols-[1.05fr_1fr]'
                      }`}
                    >
                      {/* Copy column */}
                      <div className={flip ? 'lg:order-2' : ''}>
                        <div className="reveal-fade flex items-baseline justify-between gap-6">
                          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-fg-soft">
                            <span className="text-accent">{String(index + 1).padStart(2, '0')}</span>
                            <span className="mx-3 text-fg-soft/50">·</span>
                            {item.category}
                          </p>
                          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-fg-soft/60">
                            {year}
                          </p>
                        </div>

                        <h2 className="reveal-rise mt-6 font-display text-4xl leading-[1.02] tracking-[-0.01em] text-fg sm:text-5xl lg:text-6xl">
                          {lineA}
                          {lineB ? (
                            <>
                              <br />
                              <em className="text-fg-soft">{lineB}</em>
                            </>
                          ) : null}
                        </h2>

                        <p
                          className="reveal-rise mt-6 max-w-xl text-base leading-relaxed text-fg-soft"
                          style={{ ['--reveal-delay' as string]: '0.1s' }}
                        >
                          {item.excerpt}
                        </p>

                        <p
                          className="reveal-fade mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-soft/70"
                          style={{ ['--reveal-delay' as string]: '0.15s' }}
                        >
                          {scope}
                        </p>

                        <div
                          className="reveal-rise mt-5 flex flex-wrap gap-2"
                          style={{ ['--reveal-delay' as string]: '0.2s' }}
                        >
                          {pills.map((pill) => (
                            <span
                              key={pill}
                              className="rounded-full border border-line px-3 py-1 text-xs text-fg-soft"
                            >
                              {pill}
                            </span>
                          ))}
                        </div>

                        <div
                          className="reveal-rise mt-8 flex flex-wrap items-center gap-x-8 gap-y-3"
                          style={{ ['--reveal-delay' as string]: '0.25s' }}
                        >
                          <Link
                            href={`/case-studies/${item.slug}`}
                            data-cursor="Read"
                            className="group inline-flex items-center gap-2.5 text-sm font-medium text-fg transition-colors hover:text-accent-strong"
                          >
                            Read case study
                            <span
                              aria-hidden="true"
                              className="transition-transform duration-300 group-hover:translate-x-1"
                            >
                              →
                            </span>
                          </Link>
                          {item.websiteUrl ? (
                            <a
                              href={item.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-cursor="Visit"
                              className="group inline-flex items-center gap-2 text-sm text-fg-soft transition-colors hover:text-fg"
                            >
                              Visit website
                              <span
                                aria-hidden="true"
                                className="text-xs transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                              >
                                ↗
                              </span>
                              <span className="font-mono text-[11px] text-fg-soft/60">
                                {new URL(item.websiteUrl).hostname}
                              </span>
                            </a>
                          ) : null}
                        </div>
                      </div>

                      {/* Media plate */}
                      <Tilt className={flip ? 'lg:order-1' : ''} max={2.5}>
                        <Link
                          href={`/case-studies/${item.slug}`}
                          data-cursor="View"
                          aria-label={`${item.title} — case study`}
                          className="group relative block overflow-hidden rounded-3xl border border-line"
                        >
                          <div
                            className="grain relative aspect-[4/3] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                            style={{ background: item.coverGradient }}
                          >
                            {item.previewImage ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.previewImage}
                                alt={`${item.title} — website preview`}
                                className="absolute inset-0 h-full w-full object-cover"
                                loading="lazy"
                              />
                            ) : null}
                            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/45 to-transparent p-7">
                              <span className="rounded-full border border-white/25 bg-black/25 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur">
                                {item.category}
                              </span>
                              {item.websiteUrl ? (
                                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">
                                  {new URL(item.websiteUrl).hostname}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </Link>
                      </Tilt>
                    </div>
                  </Reveal>
                </Container>
              </article>
            );
          })
        ) : (
          <Container className="py-24">
            <p className="text-sm text-fg-soft">Case studies are temporarily unavailable.</p>
          </Container>
        )}
      </section>
    </main>
  );
}
