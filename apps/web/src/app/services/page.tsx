import type { Metadata } from 'next';
import Link from 'next/link';
import { getServices } from '@/lib/api';
import { PageHero } from '@/components/page-hero';
import { Container } from '@/components/container';
import { Reveal } from '@/components/motion/reveal';
import { SectionBackdrop } from '@/components/section-backdrop';
import { ServiceDiagram } from '@/components/service-diagrams';
import { SERVICE_PROMISES, deliverables } from '@/lib/service-meta';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Six practice areas tuned for the AI era — LLM integration, cloud, product, security, and mobile engineering.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services',
    description:
      'Six practice areas tuned for the AI era — LLM integration, cloud, product, security, and mobile engineering.',
  },
};

export default async function ServicesPage() {
  const services = await getServices();
  // AI leads — it's the flagship — then the rest in their curated order.
  const ordered = [
    ...services.filter((service) => service.slug === 'ai-integration'),
    ...services.filter((service) => service.slug !== 'ai-integration'),
  ];

  return (
    <main className="page-wide">
      <PageHero
        eyebrow="Services"
        title="Six practices, tuned for the AI era."
        lede="Your users already expect software that thinks. Every engagement below ships with that expectation built in — from the data layer up."
      />

      <section className="grain relative overflow-clip bg-ink py-20 lg:py-24">
        <SectionBackdrop glow="right" variant="ceiling" />
        <Container>
          {ordered.length > 0 ? (
            <div className="space-y-8 lg:space-y-10">
              {ordered.map((service, index) => {
                const points = deliverables(service.body);
                const flagship = service.slug === 'ai-integration';
                const diagramLeft = index % 2 === 0;

                return (
                  <Reveal key={service.slug}>
                    <article
                      className={`reveal-rise relative overflow-clip rounded-[2rem] border bg-ink-raised/50 lg:grid lg:grid-cols-[1fr_1.2fr] ${
                        flagship ? 'border-accent/25' : 'border-line'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute -top-24 h-72 w-72 rounded-full bg-accent/[0.08] blur-[90px] ${
                          diagramLeft ? '-left-24' : '-right-24'
                        }`}
                      />

                      {/* Diagram — top strip on small screens; left on even
                          panels, right on odd from lg up */}
                      <div
                        className={`relative h-52 border-b border-line/60 sm:h-60 lg:h-auto lg:border-b-0 ${
                          diagramLeft ? 'lg:order-1 lg:border-r' : 'lg:order-2 lg:border-l'
                        }`}
                      >
                        <div className="absolute inset-0 p-5 sm:p-6 lg:p-10 xl:p-14">
                          <ServiceDiagram slug={service.slug} />
                        </div>
                      </div>

                      {/* The pitch: name first, promise second, proof third */}
                      <div
                        className={`relative p-8 sm:p-10 lg:p-14 ${diagramLeft ? 'lg:order-2' : 'lg:order-1'}`}
                      >
                        <p className="flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-accent">
                          {flagship ? (
                            <>
                              <span className="relative flex h-2 w-2" aria-hidden="true">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                              </span>
                              The flagship practice
                            </>
                          ) : (
                            <>
                              <span className="text-fg-soft/60">
                                {String(index + 1).padStart(2, '0')}
                              </span>
                              <span
                                className="inline-block h-px w-6 self-center bg-line-strong"
                                aria-hidden="true"
                              />
                              Practice
                            </>
                          )}
                        </p>

                        <h2 className="mt-5 font-display text-4xl leading-[1.05] tracking-[-0.01em] text-fg sm:text-5xl">
                          {service.title}
                        </h2>

                        <p className="mt-4 max-w-lg text-lg leading-snug text-fg">
                          {SERVICE_PROMISES[service.slug] ?? service.excerpt}
                        </p>
                        <p className="mt-3 max-w-lg text-sm leading-relaxed text-fg-soft">
                          {service.excerpt}
                        </p>

                        {points.length > 0 ? (
                          <div className="mt-8 border-t border-line pt-6">
                            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-fg-soft">
                              What you get
                            </p>
                            <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                              {points.map((point) => (
                                <li
                                  key={point}
                                  className="flex items-start gap-3 text-[13px] leading-relaxed text-fg-soft/90"
                                >
                                  <span
                                    aria-hidden="true"
                                    className="mt-[7px] h-1 w-1 shrink-0 rotate-45 bg-accent/60"
                                  />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        <Link
                          href={`/services/${service.slug}`}
                          className={`mt-9 inline-flex items-center gap-2.5 rounded-full px-7 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                            flagship
                              ? 'bg-accent text-white'
                              : 'border border-line-strong text-fg hover:border-accent hover:text-accent'
                          }`}
                        >
                          Explore {service.title}
                          <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-fg-soft">Services are temporarily unavailable.</p>
          )}
        </Container>
      </section>
    </main>
  );
}
