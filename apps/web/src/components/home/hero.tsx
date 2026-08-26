'use client';

import { useEffect, useRef } from 'react';
import { Container } from '@/components/container';
import { Button } from '@/components/button';
import { Reveal } from '@/components/motion/reveal';
import { SplitWords } from '@/components/motion/split-words';

interface HeroProps {
  stats: { value: number; label: string }[];
}

/**
 * Full-viewport hero. Three layers of depth:
 *  - the blueprint grid (revealed by the cursor beacon),
 *  - two drifting light fields + floating telemetry chips (cursor parallax),
 *  - the headline block (scroll-linked scale/fade into the next section).
 * All motion is transform/opacity in rAF; fine-pointer and reduced-motion gated.
 */
export function Hero({ stats }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const layers = Array.from(section.querySelectorAll<HTMLElement>('[data-depth]'));
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let scrollProgress = 0;

    const apply = () => {
      frame = 0;
      for (const layer of layers) {
        const depth = Number(layer.dataset.depth ?? 0);
        const px = pointerX * depth * 26;
        const py = pointerY * depth * 26 + scrollProgress * depth * 160;
        layer.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0)`;
      }
      content.style.opacity = String(1 - scrollProgress * 0.8);
      content.style.transform = `translateY(${(scrollProgress * 48).toFixed(1)}px) scale(${(
        1 - scrollProgress * 0.05
      ).toFixed(4)})`;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const onPointer = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
      schedule();
    };
    const onScroll = () => {
      scrollProgress = Math.min(window.scrollY / (window.innerHeight * 0.9), 1);
      schedule();
    };

    if (finePointer) window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      if (finePointer) window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="blueprint relative flex min-h-svh items-center overflow-hidden bg-ink"
    >
      {/* Depth layer: light fields */}
      <div
        data-depth="-0.4"
        aria-hidden="true"
        className="drift-slow absolute -top-40 right-[-10%] h-[34rem] w-[34rem] rounded-full bg-accent/[0.13] blur-[120px]"
      />
      <div
        data-depth="-0.2"
        aria-hidden="true"
        className="drift absolute bottom-[-20%] left-[-8%] h-[28rem] w-[28rem] rounded-full bg-accent/[0.07] blur-[100px]"
      />

      {/* Depth layer: floating telemetry chips (desktop only) */}
      <div
        data-depth="0.55"
        aria-hidden="true"
        className="drift absolute right-[8%] top-[24%] hidden lg:block"
      >
        <TelemetryChip label="uptime" value="99.98%" trend="▲" />
      </div>
      <div
        data-depth="0.85"
        aria-hidden="true"
        className="drift-slow absolute right-[22%] top-[58%] hidden xl:block"
      >
        <TelemetryChip label="p95 latency" value="42ms" trend="▼" />
      </div>
      <div
        data-depth="0.35"
        aria-hidden="true"
        className="drift absolute right-[16%] top-[76%] hidden lg:block [animation-delay:-4s]"
      >
        <TelemetryChip label="deploy" value="✓ 3m 12s" />
      </div>

      <Container className="relative w-full pb-24 pt-40 lg:pb-28">
        <div ref={contentRef} style={{ willChange: 'transform, opacity' }}>
          <Reveal>
            <p className="reveal-fade font-mono text-[11px] font-medium uppercase tracking-[0.32em] text-accent">
              Metaxia — systems &amp; software
            </p>

            <h1 className="mt-8 max-w-5xl font-display text-[clamp(3rem,8.5vw,7.5rem)] font-medium leading-[0.98] tracking-[-0.03em] text-fg">
              <SplitWords text="We build the systems" from={0.05} />
              <br />
              <span className="text-fg-soft">
                <SplitWords text="your business runs on." from={0.3} />
              </span>
            </h1>

            <div
              className="reveal-rise mt-10 flex max-w-xl flex-col gap-10"
              style={{ ['--reveal-delay' as string]: '0.55s' }}
            >
              <p className="text-lg leading-relaxed text-fg-soft">
                From cloud infrastructure to the software your customers touch every day —
                designed, shipped, and scaled by one accountable engineering partner.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button href="/contact" size="lg" magnetic>
                  Let&rsquo;s Talk
                </Button>
                <Button href="/services" size="lg" variant="ghost">
                  Explore services
                </Button>
              </div>
            </div>

            {stats.length > 0 ? (
              <div
                className="reveal-fade mt-20 flex flex-wrap gap-x-14 gap-y-6 border-t border-line pt-8"
                style={{ ['--reveal-delay' as string]: '0.8s' }}
              >
                {stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-1">
                    <span className="font-display text-3xl font-medium tabular-nums text-fg">
                      {String(stat.value).padStart(2, '0')}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-soft">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </Reveal>
        </div>
      </Container>

      {/* Scroll cue */}
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

function TelemetryChip({ label, value, trend }: { label: string; value: string; trend?: string }) {
  return (
    <div className="rounded-xl border border-line-strong bg-ink-raised/80 px-4 py-3 backdrop-blur">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-soft">{label}</p>
      <p className="mt-1 font-mono text-sm text-fg">
        {value} {trend ? <span className="text-accent">{trend}</span> : null}
      </p>
    </div>
  );
}
