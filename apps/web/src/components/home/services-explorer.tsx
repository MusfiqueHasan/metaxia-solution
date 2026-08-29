'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Service } from '@metaxia/shared';
import { Container } from '@/components/container';
import { SectionHeading } from '@/components/section-heading';
import { Reveal } from '@/components/motion/reveal';
import { Icon, type IconKey } from '@/components/icon';
import { SectionBackdrop } from '@/components/section-backdrop';

const washes = [
  'radial-gradient(120% 120% at 20% 10%, rgba(229,121,58,0.30), transparent 60%)',
  'radial-gradient(120% 120% at 80% 15%, rgba(242,160,107,0.22), transparent 60%)',
  'radial-gradient(120% 120% at 30% 85%, rgba(212,120,90,0.26), transparent 60%)',
  'radial-gradient(120% 120% at 75% 80%, rgba(229,121,58,0.22), transparent 60%)',
  'radial-gradient(120% 120% at 15% 50%, rgba(196,142,72,0.22), transparent 60%)',
  'radial-gradient(120% 120% at 85% 45%, rgba(240,140,90,0.26), transparent 60%)',
];

const CYCLE_MS = 1800;

/**
 * A small living diagram per discipline, filling the preview panel's middle.
 * Pure CSS keyframes; `animate` gates the loops so only the visible slide
 * spends GPU time.
 */
function ServiceVisual({ kind, animate }: { kind: IconKey; animate: boolean }) {
  const play = animate ? '' : '[animation-play-state:paused]';

  if (kind === 'cloud') {
    // Server racks reporting status beneath an arc of coverage.
    return (
      <div className="flex w-56 flex-col gap-3">
        {[0, 1, 2].map((row) => (
          <div
            key={row}
            className="flex items-center gap-3 rounded-lg border border-line-strong bg-ink/50 px-4 py-2.5"
          >
            <span
              className={`viz-blink h-1.5 w-1.5 rounded-full bg-accent ${play}`}
              style={{ animationDelay: `${row * 0.5}s` }}
            />
            <span className="h-1 flex-1 rounded bg-fg/10" />
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-fg-soft/70">
              {['eu-west', 'us-east', 'ap-south'][row]}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (kind === 'code') {
    // Lines of code typing themselves in a loop.
    const widths = ['62%', '84%', '48%', '72%', '38%'];
    return (
      <div className="w-56 rounded-xl border border-line-strong bg-ink/50 p-5">
        <div className="mb-3 flex gap-1.5">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="h-1.5 w-1.5 rounded-full bg-fg/15" />
          ))}
        </div>
        <div className="flex flex-col gap-2.5">
          {widths.map((width, line) => (
            <span
              key={line}
              className={`viz-type h-1.5 rounded ${line % 3 === 0 ? 'bg-accent/60' : 'bg-fg/15'} ${play}`}
              style={{ width, animationDelay: `${line * 0.35}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (kind === 'shield') {
    // Pulses radiating from a guarded core.
    return (
      <div className="relative flex h-40 w-40 items-center justify-center">
        {[0, 1, 2].map((ring) => (
          <span
            key={ring}
            className={`viz-pulse absolute inset-0 rounded-full border border-accent/40 ${play}`}
            style={{ animationDelay: `${ring * 0.8}s` }}
          />
        ))}
        <span className="relative h-3 w-3 rotate-45 bg-accent" />
      </div>
    );
  }

  if (kind === 'phone') {
    // A device receiving notifications.
    return (
      <div className="relative h-40 w-24 rounded-2xl border border-line-strong bg-ink/50 p-3">
        <span className="absolute left-1/2 top-1.5 h-1 w-8 -translate-x-1/2 rounded bg-fg/15" />
        <div className="mt-4 flex flex-col gap-2">
          {[0, 1, 2].map((notification) => (
            <span
              key={notification}
              className={`viz-type h-6 rounded-lg border border-line bg-fg/[0.06] ${play}`}
              style={{ animationDelay: `${notification * 0.6}s` }}
            />
          ))}
        </div>
        <span
          className={`viz-blink absolute bottom-3 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent ${play}`}
        />
      </div>
    );
  }

  if (kind === 'spark') {
    // A node constellation thinking: orbiting satellites around a core.
    return (
      <div className="relative flex h-40 w-40 items-center justify-center">
        <span className="absolute inset-6 rounded-full border border-line-strong" />
        <span className="absolute inset-0 rounded-full border border-line" />
        <div className={`viz-orbit absolute inset-0 ${play}`}>
          <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-accent" />
        </div>
        <div className={`viz-orbit absolute inset-6 ${play}`} style={{ animationDirection: 'reverse', animationDuration: '7s' }}>
          <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent-strong" />
        </div>
        <span className={`viz-blink h-3 w-3 rounded-full bg-accent ${play}`} />
      </div>
    );
  }

  // chart — bars climbing in a loop.
  return (
    <div className="flex h-36 w-56 items-end justify-center gap-3">
      {[40, 62, 50, 78, 96].map((height, bar) => (
        <span
          key={bar}
          className={`viz-grow w-6 rounded-t ${bar === 4 ? 'bg-accent/70' : 'bg-fg/12'} ${play}`}
          style={{ height: `${height}%`, animationDelay: `${bar * 0.25}s` }}
        />
      ))}
    </div>
  );
}

/**
 * The services section is a switchboard: a list of disciplines on the left,
 * a preview panel on the right. The panel cycles through the services on its
 * own while the section is on screen; hovering (or focusing) the list takes
 * manual control and pauses the loop until the pointer leaves.
 */
export function ServicesExplorer({ services }: { services: Service[] }) {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const pausedRef = useRef(false);
  const count = services.length;

  useEffect(() => {
    if (count < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const section = sectionRef.current;
    let visible = false;
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0.25 },
    );
    if (section) observer.observe(section);

    const interval = setInterval(() => {
      if (visible && !pausedRef.current) {
        setActive((value) => (value + 1) % count);
      }
    }, CYCLE_MS);

    // Scroll progress (0..1 across the section's pass through the viewport)
    // feeds the --sp CSS variable; backdrop layers derive their transforms
    // from it, so the background rotates/parallaxes with scroll while the
    // content animations stay untouched.
    let frame = 0;
    const onScroll = () => {
      if (frame || !section) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = section.getBoundingClientRect();
        const total = rect.height + window.innerHeight;
        const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / total));
        section.style.setProperty('--sp', progress.toFixed(4));
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      clearInterval(interval);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [count]);

  if (count === 0) return null;

  return (
    <section ref={sectionRef} className="grain relative overflow-clip border-t border-line bg-ink py-16 md:py-28 lg:py-36">
      <SectionBackdrop glow="right" variant="ceiling" />

      {/* Scroll-driven 3D layer: everything below derives its transform from
          --sp (0..1 scroll progress set on the section), so the background
          tumbles and parallaxes as the visitor scrolls through. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
        {/* Wireframe cube tumbling with scroll */}
        <div
          className="absolute right-[8%] top-[30%] hidden h-28 w-28 lg:block"
          style={{ perspective: '800px' }}
        >
          <div
            className="relative h-full w-full"
            style={{
              transformStyle: 'preserve-3d',
              transform:
                'translateY(calc(var(--sp, 0) * -9rem)) rotateX(calc(var(--sp, 0) * 220deg)) rotateY(calc(var(--sp, 0) * 300deg))',
            }}
          >
            {[
              'rotateY(0deg) translateZ(3.5rem)',
              'rotateY(90deg) translateZ(3.5rem)',
              'rotateY(180deg) translateZ(3.5rem)',
              'rotateY(270deg) translateZ(3.5rem)',
              'rotateX(90deg) translateZ(3.5rem)',
              'rotateX(-90deg) translateZ(3.5rem)',
            ].map((transform) => (
              <div key={transform} className="cube-face" style={{ transform }} />
            ))}
          </div>
        </div>

        {/* Orbit ring drifting the other way */}
        <div
          className="absolute bottom-[12%] left-[3%] hidden h-36 w-36 lg:block"
          style={{
            transform:
              'translateY(calc(var(--sp, 0) * 7rem)) rotateX(calc(64deg + var(--sp, 0) * 30deg)) rotateZ(calc(var(--sp, 0) * 160deg))',
          }}
        >
          <div className="h-full w-full rounded-full border border-accent/30" />
        </div>

        {/* Concentric rings expanding behind the preview panel */}
        <div className="absolute right-[10%] top-1/2 hidden -translate-y-1/2 lg:block">
          {[22, 32, 42].map((size, i) => (
            <div
              key={size}
              className="absolute left-1/2 top-1/2 rounded-full border border-fg/[0.05]"
              style={{
                width: `${size}rem`,
                height: `${size}rem`,
                transform: `translate(-50%, -50%) scale(calc(0.75 + var(--sp, 0) * ${0.5 + i * 0.18}))`,
              }}
            />
          ))}
        </div>
      </div>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            index="01"
            eyebrow="What we do"
            title="Six disciplines. One accountable team."
          />
          <Reveal className="hidden lg:block">
            <p className="reveal-fade font-mono text-[11px] uppercase tracking-[0.25em] text-fg-soft">
              {String(count).padStart(2, '0')} services
            </p>
          </Reveal>
        </div>

        <div
          className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[1.15fr_1fr] lg:gap-20"
          onPointerEnter={() => {
            pausedRef.current = true;
          }}
          onPointerLeave={() => {
            pausedRef.current = false;
          }}
          onFocusCapture={() => {
            pausedRef.current = true;
          }}
          onBlurCapture={() => {
            pausedRef.current = false;
          }}
        >
          {/* The switchboard */}
          <Reveal>
            <ul>
              {services.map((service, index) => {
                const isActive = index === active;
                return (
                  <li
                    key={service.id}
                    className="reveal-rise border-b border-line first:border-t"
                    style={{ ['--reveal-delay' as string]: `${index * 0.06}s` }}
                  >
                    <Link
                      href={`/services/${service.slug}`}
                      data-cursor="Open"
                      onPointerEnter={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      className={`group flex items-baseline gap-5 py-6 will-change-transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:py-7 ${
                        isActive ? 'translate-x-4 lg:translate-x-7' : 'translate-x-0'
                      }`}
                    >
                      <span
                        className={`font-mono text-xs transition-colors duration-500 ${
                          isActive ? 'text-accent' : 'text-fg-soft/60'
                        }`}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1">
                        <span
                          className={`font-display text-2xl tracking-[-0.01em] transition-colors duration-500 sm:text-3xl ${
                            isActive ? 'text-accent-strong' : 'text-fg-soft group-hover:text-fg'
                          }`}
                        >
                          {service.title}
                        </span>
                        <span className="mt-2 block max-w-md text-sm leading-relaxed text-fg-soft lg:hidden">
                          {service.excerpt}
                        </span>
                      </span>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        fill="none"
                        className={`h-4 w-4 shrink-0 self-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isActive
                            ? 'translate-x-0 text-accent opacity-100'
                            : '-translate-x-3 text-fg-soft opacity-0'
                        }`}
                      >
                        <path
                          d="M2 8h11M9 3.5 13.5 8 9 12.5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          {/* The preview panel — cycles on its own, answers the cursor when hovered */}
          <Reveal>
            <div className="reveal-scale lg:sticky lg:top-28">
              <div className="relative min-h-[21rem] overflow-hidden rounded-3xl border border-line bg-ink-raised sm:min-h-[24rem] lg:min-h-[26rem]">
                {services.map((service, index) => {
                  const on = index === active;
                  // Entering elements stagger up; exiting ones vanish instantly
                  // (no delay, short duration) so slides never ghost over each
                  // other mid-crossfade.
                  const step = (order: number) =>
                    ({
                      opacity: on ? 1 : 0,
                      transform: on ? 'translateY(0)' : 'translateY(0.8rem)',
                      transitionProperty: 'opacity, transform',
                      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                      transitionDuration: on ? '600ms' : '180ms',
                      transitionDelay: on ? `${120 + order * 90}ms` : '0ms',
                    }) as const;

                  return (
                    <div
                      key={service.id}
                      aria-hidden={!on}
                      className="absolute inset-0 flex flex-col justify-between p-6 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:p-8 lg:p-10"
                      style={{
                        opacity: on ? 1 : 0,
                        background: washes[index % washes.length],
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <span
                          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-line-strong bg-ink/60 text-accent"
                          style={{
                            ...step(0),
                            transform: on ? 'scale(1) translateY(0)' : 'scale(0.75) translateY(0.4rem)',
                          }}
                        >
                          <Icon name={service.icon as IconKey} className="h-6 w-6" />
                        </span>
                        <span className="font-mono text-xs text-fg-soft" style={step(1)}>
                          {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                        </span>
                      </div>
                      {/* Living diagram filling the panel's middle */}
                      <div className="flex flex-1 items-center justify-center py-4" style={step(2)}>
                        <ServiceVisual kind={service.icon as IconKey} animate={on} />
                      </div>

                      <div>
                        <p className="font-display text-2xl tracking-[-0.01em] text-fg" style={step(3)}>
                          {service.title}
                        </p>
                        <p
                          className="mt-3 max-w-sm text-sm leading-relaxed text-fg-soft"
                          style={step(4)}
                        >
                          {service.excerpt}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Cycle progress: one tick per service, the active one fills */}
                <div className="absolute inset-x-6 bottom-4 flex gap-1.5 sm:inset-x-8 lg:inset-x-10" aria-hidden="true">
                  {services.map((service, index) => (
                    <span
                      key={service.id}
                      className={`h-px flex-1 transition-colors duration-500 ${
                        index === active ? 'bg-accent' : 'bg-line-strong'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
