'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Service } from '@metaxia/shared';
import { Container } from '@/components/container';
import { SectionHeading } from '@/components/section-heading';
import { Reveal } from '@/components/motion/reveal';
import { Icon, type IconKey } from '@/components/icon';

const washes = [
  'radial-gradient(120% 120% at 20% 10%, rgba(94,86,245,0.28), transparent 60%)',
  'radial-gradient(120% 120% at 80% 15%, rgba(56,189,248,0.22), transparent 60%)',
  'radial-gradient(120% 120% at 30% 85%, rgba(167,139,250,0.24), transparent 60%)',
  'radial-gradient(120% 120% at 75% 80%, rgba(94,86,245,0.22), transparent 60%)',
  'radial-gradient(120% 120% at 15% 50%, rgba(45,212,191,0.18), transparent 60%)',
  'radial-gradient(120% 120% at 85% 45%, rgba(129,140,248,0.26), transparent 60%)',
];

/**
 * The services section is a switchboard, not a card grid: a list of
 * disciplines on the left, and a preview panel that answers the cursor on
 * the right. On touch/small screens the list carries its own excerpts.
 */
export function ServicesExplorer({ services }: { services: Service[] }) {
  const [active, setActive] = useState(0);
  if (services.length === 0) return null;
  const current = services[Math.min(active, services.length - 1)];

  return (
    <section className="relative border-t border-line bg-ink py-28 lg:py-36">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            index="01" eyebrow="What we do"
            title="Six disciplines. One accountable team."
          />
          <Reveal className="hidden lg:block">
            <p className="reveal-fade font-mono text-[11px] uppercase tracking-[0.25em] text-fg-soft">
              {String(services.length).padStart(2, '0')} services
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
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
                      className="group flex items-baseline gap-5 py-6 transition-colors duration-300 lg:py-7"
                    >
                      <span
                        className={`font-mono text-xs transition-colors duration-300 ${
                          isActive ? 'text-accent' : 'text-fg-soft/60'
                        }`}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1">
                        <span
                          className={`font-display text-2xl tracking-[-0.01em] transition-colors duration-300 sm:text-3xl ${
                            isActive ? 'text-fg' : 'text-fg-soft group-hover:text-fg'
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
                        className={`h-4 w-4 shrink-0 self-center transition-all duration-300 ${
                          isActive
                            ? 'translate-x-0 text-accent opacity-100'
                            : '-translate-x-2 text-fg-soft opacity-0'
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

          {/* The preview panel — answers the cursor */}
          <Reveal className="hidden lg:block">
            <div className="reveal-scale sticky top-28">
              <div className="relative min-h-[26rem] overflow-hidden rounded-3xl border border-line bg-ink-raised">
                {services.map((service, index) => (
                  <div
                    key={service.id}
                    aria-hidden={index !== active}
                    className="absolute inset-0 flex flex-col justify-between p-10 transition-opacity duration-500"
                    style={{
                      opacity: index === active ? 1 : 0,
                      background: washes[index % washes.length],
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-line-strong bg-ink/60 text-accent">
                        <Icon name={service.icon as IconKey} className="h-6 w-6" />
                      </span>
                      <span className="font-mono text-xs text-fg-soft">
                        {String(index + 1).padStart(2, '0')} /{' '}
                        {String(services.length).padStart(2, '0')}
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
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
