import type { Metadata } from 'next';
import Link from 'next/link';
import { getServices } from '@/lib/api';
import { PageHero } from '@/components/page-hero';
import { Container } from '@/components/container';
import { Reveal } from '@/components/motion/reveal';
import { Icon, type IconKey } from '@/components/icon';
import { SectionBackdrop } from '@/components/section-backdrop';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Six practice areas covering cloud, product, security, and AI engineering.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services',
    description: 'Six practice areas covering cloud, product, security, and AI engineering.',
  },
};

/** First bullets under "## What we deliver", trimmed for the card. */
function deliverables(body: string, limit = 3): string[] {
  const section = body.split(/##\s*What we deliver/i)[1];
  if (!section) return [];
  const items: string[] = [];
  for (const line of section.split('\n')) {
    const match = line.match(/^\s*-\s+(.*)/);
    if (match) {
      const text = match[1].replace(/[*_`]/g, '').trim();
      items.push(text.length > 72 ? `${text.slice(0, 72).replace(/\s+\S*$/, '')}…` : text);
      if (items.length === limit) break;
    } else if (items.length > 0 && /^##/.test(line)) {
      break;
    }
  }
  return items;
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <main className="page-wide">
      <PageHero
        eyebrow="Services"
        title="Six practice areas, one accountable team."
        lede="Engage us for a single capability or the whole system — every practice is staffed by people who ship, not just advise."
      />

      <section className="grain relative overflow-clip bg-ink py-24 lg:py-32">
        <SectionBackdrop glow="right" variant="ceiling" />
        <Container>
          {services.length > 0 ? (
            <Reveal>
              <ul className="grid gap-5 sm:grid-cols-2">
                {services.map((service, index) => {
                  const points = deliverables(service.body);
                  return (
                    <li
                      key={service.slug}
                      className="reveal-rise"
                      style={{ ['--reveal-delay' as string]: `${index * 0.07}s` }}
                    >
                      <Link
                        href={`/services/${service.slug}`}
                        className="group relative flex h-full flex-col overflow-clip rounded-3xl border border-line bg-ink-raised/50 p-8 transition-[border-color,background-color,transform] duration-500 hover:-translate-y-1 hover:border-accent/40 hover:bg-ink-raised lg:p-10"
                      >
                        {/* Ember that wakes on hover */}
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-accent/10 opacity-0 blur-[70px] transition-opacity duration-700 group-hover:opacity-100"
                        />

                        <span className="relative flex items-center justify-between">
                          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-ink text-accent transition-colors duration-300 group-hover:border-accent/40">
                            <Icon name={service.icon as IconKey} className="h-5 w-5" />
                          </span>
                          <span className="font-mono text-sm tracking-[0.2em] text-fg-soft/50 transition-colors duration-300 group-hover:text-accent">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </span>

                        <span className="relative mt-8 font-display text-2xl tracking-[-0.01em] text-fg transition-colors duration-300 group-hover:text-accent-strong sm:text-3xl">
                          {service.title}
                        </span>
                        <span className="relative mt-3 block text-sm leading-relaxed text-fg-soft">
                          {service.excerpt}
                        </span>

                        {points.length > 0 ? (
                          <span className="relative mt-7 block space-y-2.5 border-t border-line pt-6">
                            {points.map((point) => (
                              <span key={point} className="flex items-start gap-3 text-[13px] leading-relaxed text-fg-soft/90">
                                <span
                                  aria-hidden="true"
                                  className="mt-[7px] h-1 w-1 shrink-0 rotate-45 bg-accent/60"
                                />
                                {point}
                              </span>
                            ))}
                          </span>
                        ) : null}

                        <span className="relative mt-auto flex items-center gap-2 pt-8 font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-fg-soft transition-colors duration-300 group-hover:text-accent">
                          Explore practice
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                          >
                            <path
                              d="M2 8h11M9 3.5 13.5 8 9 12.5"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          ) : (
            <p className="text-sm text-fg-soft">Services are temporarily unavailable.</p>
          )}
        </Container>
      </section>
    </main>
  );
}
