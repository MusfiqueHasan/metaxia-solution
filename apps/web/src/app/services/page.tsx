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
              <ul>
                {services.map((service, index) => (
                  <li
                    key={service.slug}
                    className="reveal-rise border-b border-line first:border-t"
                    style={{ ['--reveal-delay' as string]: `${index * 0.06}s` }}
                  >
                    <Link
                      href={`/services/${service.slug}`}
                      className="group grid grid-cols-[auto_1fr] items-start gap-x-6 gap-y-3 py-10 sm:grid-cols-[4rem_3.5rem_1fr_auto] sm:items-center sm:gap-x-8 lg:py-12"
                    >
                      <span className="font-mono text-sm text-fg-soft/60 transition-colors duration-300 group-hover:text-accent">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="hidden h-12 w-12 items-center justify-center rounded-xl border border-line bg-ink-raised text-accent transition-colors duration-300 group-hover:border-accent/40 sm:flex">
                        <Icon name={service.icon as IconKey} className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="font-display text-2xl tracking-[-0.01em] text-fg transition-colors duration-300 group-hover:text-accent-strong sm:text-3xl">
                          {service.title}
                        </span>
                        <span className="mt-2 block max-w-2xl text-sm leading-relaxed text-fg-soft">
                          {service.excerpt}
                        </span>
                      </span>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="hidden h-5 w-5 -translate-x-2 text-fg-soft opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-accent group-hover:opacity-100 sm:block"
                      >
                        <path
                          d="M2 8h11M9 3.5 13.5 8 9 12.5"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                  </li>
                ))}
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
