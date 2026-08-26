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

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, [count]);

  if (count === 0) return null;

  return (
    <section ref={sectionRef} className="grain relative overflow-clip border-t border-line bg-ink py-28 lg:py-36">
      <SectionBackdrop mark="01" glow="right" variant="ceiling" />
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
          className="mt-16 grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20"
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
          <Reveal className="hidden lg:block">
            <div className="reveal-scale sticky top-28">
              <div className="relative min-h-[26rem] overflow-hidden rounded-3xl border border-line bg-ink-raised">
                {services.map((service, index) => (
                  <div
                    key={service.id}
                    aria-hidden={index !== active}
                    className="absolute inset-0 flex flex-col justify-between p-10 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      opacity: index === active ? 1 : 0,
                      transform: index === active ? 'scale(1)' : 'scale(1.035)',
                      background: washes[index % washes.length],
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-line-strong bg-ink/60 text-accent">
                        <Icon name={service.icon as IconKey} className="h-6 w-6" />
                      </span>
                      <span className="font-mono text-xs text-fg-soft">
                        {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                      </span>
                    </div>
                    <div>
                      <p className="font-display text-2xl tracking-[-0.01em] text-fg">
                        {service.title}
                      </p>
                      <p className="mt-3 max-w-sm text-sm leading-relaxed text-fg-soft">
                        {service.excerpt}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Cycle progress: one tick per service, the active one fills */}
                <div className="absolute inset-x-10 bottom-4 flex gap-1.5" aria-hidden="true">
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
