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

      {/* Constellation across the section's top: a network of nodes joined
          by hairlines, pulsing in sequence — systems, mapped. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1000 200"
        className="pointer-events-none absolute left-1/2 top-6 hidden w-[68rem] max-w-none -translate-x-1/2 select-none lg:block"
      >
        <g stroke="rgba(242,241,236,0.10)" strokeWidth="1">
          <path d="M120 140 L265 70 L410 118 L560 48 L700 104 L855 62" fill="none" />
          <path d="M265 70 L340 160 L560 48" fill="none" />
          <path d="M560 48 L640 158 L855 62" fill="none" />
        </g>
        {[
          { x: 120, y: 140, r: 3, accent: false, delay: '0s' },
          { x: 265, y: 70, r: 4, accent: true, delay: '0.4s' },
          { x: 340, y: 160, r: 2.5, accent: false, delay: '0.8s' },
          { x: 410, y: 118, r: 3, accent: false, delay: '1.2s' },
          { x: 560, y: 48, r: 4.5, accent: true, delay: '1.6s' },
          { x: 640, y: 158, r: 2.5, accent: false, delay: '2s' },
          { x: 700, y: 104, r: 3, accent: false, delay: '2.4s' },
          { x: 855, y: 62, r: 4, accent: true, delay: '2.8s' },
        ].map((node) => (
          <g key={`${node.x}-${node.y}`}>
            {node.accent ? (
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r * 3.2}
                fill="rgba(229,121,58,0.10)"
                className="viz-blink"
                style={{ animationDelay: node.delay }}
              />
            ) : null}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill={node.accent ? 'rgba(229,121,58,0.85)' : 'rgba(242,241,236,0.45)'}
              className="viz-blink"
              style={{ animationDelay: node.delay }}
            />
          </g>
        ))}
      </svg>

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
          className="reveal-fade strip-scroll mt-12 flex snap-x snap-mandatory gap-8 overflow-x-auto pb-4 pe-6 lg:pe-8"
          // Inline so no class-generation step can drop it: start the rail at
          // exactly the container's left content edge (max-w-6xl + px-8),
          // flooring at the mobile gutter on narrow screens.
          style={{ paddingInlineStart: 'max(1.5rem, calc((100vw - 72rem) / 2 + 2rem))' }}
        >
          {items.map((item, index) => {
            const domain = item.websiteUrl ? new URL(item.websiteUrl).hostname : null;
            const year = YEARS[(index + 1) % YEARS.length];
            return (
              <article key={item.id} className="w-[85vw] shrink-0 snap-start sm:w-[28rem] lg:w-[34rem]">
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
