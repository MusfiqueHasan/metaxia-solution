'use client';

import { useEffect, useRef } from 'react';
import { Container } from '@/components/container';
import { Button } from '@/components/button';
import { Reveal } from '@/components/motion/reveal';
import { SplitWords } from '@/components/motion/split-words';
import { Starfield } from '@/components/motion/starfield';
import { ParticleOrb } from '@/components/motion/particle-orb';

interface HeroProps {
  stats: { value: number; label: string }[];
}

/**
 * Observatory hero: a twinkling starfield behind, the particle orb rising
 * from the lower edge like a planet, and a centered serif headline in front.
 * Scroll gently fades and lifts the content into the next section.
 */
export function Hero({ stats }: HeroProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const progress = Math.min(window.scrollY / (window.innerHeight * 0.9), 1);
        content.style.opacity = String(1 - progress * 0.85);
        content.style.transform = `translateY(${(progress * 56).toFixed(1)}px)`;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="grain relative flex min-h-svh items-center justify-center overflow-hidden bg-ink">
      <Starfield />

      {/* The orb: rising from below the fold like a planet at the horizon. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[62%] h-[130vmin] w-[130vmin] -translate-x-1/2"
      >
        <div className="absolute inset-0 rounded-full bg-accent/[0.07] blur-[120px]" />
        <ParticleOrb className="h-full w-full" />
      </div>

      <Container className="relative w-full pb-32 pt-40 text-center">
        <div ref={contentRef} style={{ willChange: 'transform, opacity' }}>
          <Reveal>
            <p className="reveal-fade font-mono text-[11px] font-medium uppercase tracking-[0.32em] text-fg-soft">
              Metaxia — software for the AI era · Dhaka&nbsp;→&nbsp;worldwide
            </p>

            <h1 className="mx-auto mt-10 max-w-5xl font-display text-[clamp(3.25rem,9vw,8rem)] leading-[0.98] tracking-[-0.01em] text-fg">
              <SplitWords text="We build the systems" from={0.05} />
              <br />
              <em className="text-accent-strong">
                <SplitWords text="your business runs on." from={0.32} />
              </em>
            </h1>

            <p
              className="reveal-rise mx-auto mt-9 max-w-xl text-lg leading-relaxed text-fg-soft"
              style={{ ['--reveal-delay' as string]: '0.55s' }}
            >
              From cloud infrastructure to the software your customers touch every day —
              designed, shipped, and scaled by one accountable engineering partner.
            </p>

            <div
              className="reveal-rise mt-10 flex flex-wrap items-center justify-center gap-4"
              style={{ ['--reveal-delay' as string]: '0.7s' }}
            >
              <Button href="/contact" size="lg" magnetic>
                Let&rsquo;s Talk
              </Button>
              <Button href="/services" size="lg" variant="ghost">
                Explore services
              </Button>
            </div>

            {stats.length > 0 ? (
              <div
                className="reveal-fade mx-auto mt-20 flex max-w-2xl flex-wrap items-start justify-center gap-x-16 gap-y-6 border-t border-line pt-8"
                style={{ ['--reveal-delay' as string]: '0.9s' }}
              >
                {stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center gap-1">
                    <span className="font-display text-3xl tabular-nums text-fg">
                      {String(stat.value).padStart(2, '0')}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-soft">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </Reveal>
        </div>
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
  );
}
