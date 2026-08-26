'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { CaseStudy } from '@metaxia/shared';
import { Container } from '@/components/container';
import { Reveal } from '@/components/motion/reveal';
import { SectionBackdrop } from '@/components/section-backdrop';

const YEARS = ['2025', '2026', '2024'];

/**
 * Selected work as a showroom rail: oversized browser-preview plates with
 * the live domain pinned to the frame and a visit action on the image,
 * followed by an editorial caption row. Native scroll-snap does the motion;
 * the edge arrows and the 01/08 counter read and drive scrollLeft.
 */
export function CaseStudyScroller({ items }: { items: CaseStudy[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const card = track.firstElementChild as HTMLElement | null;
        if (!card) return;
        const step = card.offsetWidth + 32; // card + gap
        setCurrent(Math.min(items.length - 1, Math.round(track.scrollLeft / step)));
      });
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      track.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items.length]);

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;
    track.scrollBy({ left: direction * (card.offsetWidth + 32), behavior: 'smooth' });
  };

  if (items.length === 0) return null;

  return (
    <section className="grain relative overflow-clip border-t border-line bg-ink py-28 lg:py-36">
      <SectionBackdrop glow="left" variant="floor" />

      {/* Orbital system cresting the section's top-center */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-44 left-1/2 hidden h-[26rem] w-[26rem] -translate-x-1/2 select-none lg:block"
      >
        <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.18] blur-2xl" />
        <div className="orb-3d absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2" />
        {[
          { inset: 'inset-0', duration: '14s', direction: 'normal', dot: 'h-2 w-2 bg-accent' },
          { inset: 'inset-10', duration: '9s', direction: 'reverse', dot: 'h-1.5 w-1.5 bg-accent-strong' },
          { inset: 'inset-20', duration: '6s', direction: 'normal', dot: 'h-1 w-1 bg-fg/70' },
        ].map((orbit) => (
          <div key={orbit.inset} className={`absolute ${orbit.inset}`}>
            <div className="absolute inset-0 rounded-full border border-line-strong" />
            <div
              className="viz-orbit absolute inset-0"
              style={{ animationDuration: orbit.duration, animationDirection: orbit.direction }}
            >
              <span
                className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_10px_var(--color-accent)] ${orbit.dot}`}
              />
            </div>
          </div>
        ))}
      </div>

      <Container className="relative">
        <Reveal>
          {/* Kicker row */}
          <div className="reveal-fade flex flex-wrap items-baseline justify-between gap-4">
            <p className="flex items-baseline gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-fg-soft">
              <span className="text-accent">(02)</span> Selected work
            </p>
            <p className="hidden font-mono text-[11px] uppercase tracking-[0.28em] text-fg-soft/70 lg:block">
              Systems &amp; software · 2024 to 2026
            </p>
          </div>

          {/* Headline + live counter */}
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
            <h2 className="reveal-rise max-w-3xl font-display text-5xl leading-[1.02] tracking-[-0.01em] text-fg sm:text-6xl lg:text-7xl">
              Systems we&rsquo;ve designed and shipped
            </h2>
            <p className="reveal-fade font-mono text-sm tabular-nums text-fg-soft">
              <span className="text-accent">{String(current + 1).padStart(2, '0')}</span> /{' '}
              {String(items.length).padStart(2, '0')}
            </p>
          </div>
        </Reveal>
      </Container>

      {/* The rail */}
      <Reveal className="relative">
        <div
          ref={trackRef}
          className="reveal-fade strip-scroll mt-12 flex snap-x snap-mandatory gap-8 overflow-x-auto pb-4 pe-6 ps-[calc((100vw-min(72rem,100vw))/2+1.5rem)] lg:pe-8 lg:ps-[calc((100vw-min(72rem,100vw))/2+2rem)]"
        >
          {items.map((item, index) => {
            const domain = item.websiteUrl ? new URL(item.websiteUrl).hostname : null;
            const year = YEARS[(index + 1) % YEARS.length];
            return (
              <article key={item.id} className="w-[88vw] shrink-0 snap-start sm:w-[36rem] lg:w-[44rem]">
                {/* Browser plate */}
                <div className="group relative overflow-hidden rounded-2xl border border-line-strong bg-ink-raised">
                  <Link
                    href={`/case-studies/${item.slug}`}
                    data-cursor="View"
                    aria-label={`${item.title} — case study`}
                    className="block"
                  >
                    <div
                      className="relative aspect-[16/10] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                      style={{ background: item.coverGradient }}
                    >
                      {item.previewImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.previewImage}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : null}
                    </div>
                  </Link>

                  {domain ? (
                    <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-line-strong bg-ink/80 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-fg backdrop-blur">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                      {domain}
                    </span>
                  ) : null}

                  {item.websiteUrl ? (
                    <a
                      href={item.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="Visit"
                      className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-accent-strong"
                    >
                      Visit site <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </div>

                {/* Caption row */}
                <div className="mt-7 flex gap-5">
                  <span className="pt-2 font-mono text-xs text-fg-soft/60">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <Link
                      href={`/case-studies/${item.slug}`}
                      className="font-display text-3xl leading-tight tracking-[-0.01em] text-fg transition-colors duration-300 hover:text-accent-strong sm:text-4xl"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-3 max-w-lg font-display text-lg italic leading-relaxed text-fg-soft">
                      {item.excerpt}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <Link
                        href={`/case-studies/${item.slug}`}
                        className="rounded-full border border-accent/50 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent transition-colors duration-300 hover:bg-accent hover:text-white"
                      >
                        Case study
                      </Link>
                      <span className="rounded-full border border-line px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-soft">
                        {item.category}
                      </span>
                      <span className="px-2 font-mono text-[10px] tracking-[0.18em] text-fg-soft/60">
                        {year}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Edge arrows */}
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Previous case study"
          className="absolute left-4 top-[30%] z-10 hidden h-12 w-12 items-center justify-center rounded-full border border-line-strong bg-ink/80 text-fg backdrop-blur transition-colors duration-300 hover:border-accent hover:text-accent lg:flex"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Next case study"
          className="absolute right-4 top-[30%] z-10 hidden h-12 w-12 items-center justify-center rounded-full border border-line-strong bg-ink/80 text-fg backdrop-blur transition-colors duration-300 hover:border-accent hover:text-accent lg:flex"
        >
          <span aria-hidden="true">→</span>
        </button>
      </Reveal>
    </section>
  );
}
