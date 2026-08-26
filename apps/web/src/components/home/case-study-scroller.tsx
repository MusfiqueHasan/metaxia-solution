import Link from 'next/link';
import type { CaseStudy } from '@metaxia/shared';
import { Container } from '@/components/container';
import { SectionHeading } from '@/components/section-heading';
import { Reveal } from '@/components/motion/reveal';
import { Tilt } from '@/components/motion/tilt';
import { SectionBackdrop } from '@/components/section-backdrop';

/**
 * Selected work as an edge-bleeding horizontal strip of gradient plates.
 * Each plate answers the cursor with a small tilt; the strip itself is
 * native CSS scroll-snap — no carousel library.
 */
export function CaseStudyScroller({ items }: { items: CaseStudy[] }) {
  if (items.length === 0) return null;

  return (
    <section className="grain relative overflow-clip border-t border-line bg-ink py-28 lg:py-36">
      <SectionBackdrop glow="left" variant="floor" />
      <Container className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          index="02" eyebrow="Selected work"
          title="Systems in production, not slideware."
        />
        <Reveal className="hidden lg:block">
          <p className="reveal-fade font-mono text-[11px] uppercase tracking-[0.25em] text-fg-soft">
            drag / scroll →
          </p>
        </Reveal>
      </Container>

      <Reveal>
        <div className="reveal-fade strip-scroll mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 lg:px-[max(2rem,calc((100vw-72rem)/2+2rem))]">
          {items.map((item, index) => (
            <Tilt
              key={item.id}
              className="w-[82vw] shrink-0 snap-start sm:w-[26rem]"
              max={2.5}
            >
              <Link
                href={`/case-studies/${item.slug}`}
                data-cursor="View"
                className="group flex h-[30rem] flex-col justify-between overflow-hidden rounded-3xl border border-line p-8"
                style={{ background: item.coverGradient }}
              >
                <div className="flex items-start justify-between">
                  <span className="rounded-full border border-white/25 bg-black/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur">
                    {item.category}
                  </span>
                  <span className="font-mono text-xs text-white/70">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="translate-y-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                  <h3 className="font-display text-3xl leading-tight tracking-[-0.01em] text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 max-w-xs text-sm leading-relaxed text-white/75">
                    {item.excerpt}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    Read the case
                    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="h-3 w-3">
                      <path
                        d="M2 8h11M9 3.5 13.5 8 9 12.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            </Tilt>
          ))}

          <Link
            href="/case-studies"
            className="flex h-[30rem] w-[60vw] shrink-0 snap-start items-center justify-center rounded-3xl border border-line-strong text-center transition-colors duration-300 hover:border-accent hover:bg-accent/5 sm:w-[18rem]"
          >
            <span className="font-display text-xl tracking-[-0.01em] text-fg">
              All case studies
              <span aria-hidden="true" className="mt-2 block font-mono text-xs text-fg-soft">
                ({String(items.length).padStart(2, '0')})
              </span>
            </span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
