import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServices } from '@/lib/api';
import { site } from '@/lib/site';
import { Container } from '@/components/container';
import { Button } from '@/components/button';
import { Markdown } from '@/components/markdown';
import { Icon } from '@/components/icon';
import { ContactCta } from '@/components/home/contact-cta';
import { JsonLd } from '@/components/json-ld';
import { SectionBackdrop } from '@/components/section-backdrop';
import { Reveal } from '@/components/motion/reveal';
import { SplitWords } from '@/components/motion/split-words';
import { Starfield } from '@/components/motion/starfield';
import { ServiceDiagram } from '@/components/service-diagrams';
import { SERVICE_PROMISES, parseServiceBody } from '@/lib/service-meta';

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const services = await getServices();
  const service = services.find((item) => item.slug === slug);
  if (!service) return { title: 'Not found' };

  return {
    title: service.title,
    description: service.excerpt,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: service.title,
      description: service.excerpt,
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const allServices = await getServices();
  const service = allServices.find((item) => item.slug === slug);
  if (!service) notFound();

  const otherServices = allServices.filter((item) => item.slug !== slug).slice(0, 3);
  const practiceIndex = String(allServices.findIndex((s) => s.slug === service.slug) + 1).padStart(2, '0');
  const { intro, sections } = parseServiceBody(service.body);

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.excerpt,
    provider: {
      '@type': 'Organization',
      name: site.name,
      url: site.url,
    },
    url: `${site.url}/services/${service.slug}`,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${site.url}/services` },
      { '@type': 'ListItem', position: 3, name: service.title, item: `${site.url}/services/${service.slug}` },
    ],
  };

  return (
    <main className="page-wide">
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Hero: the practice on the left, its diagram alive on the right */}
      <section className="grain relative overflow-clip border-b border-line bg-ink">
        <Starfield />
        <div aria-hidden="true" className="bg-dots absolute inset-0" />
        <div aria-hidden="true" className="aurora aurora--a" />
        <div
          aria-hidden="true"
          className="absolute -top-32 right-[-12%] h-[26rem] w-[26rem] rounded-full bg-accent/[0.08] blur-[110px]"
        />
        <Container className="relative pb-20 pt-36 lg:pb-24 lg:pt-44">
          <Reveal className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <div>
              <Link
                href="/services"
                className="reveal-fade inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-fg-soft transition-colors hover:text-fg"
              >
                <span aria-hidden="true">←</span> All services
              </Link>

              <p
                className="reveal-fade mt-10 flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-accent"
                style={{ ['--reveal-delay' as string]: '0.1s' }}
              >
                Practice {practiceIndex} / {String(allServices.length).padStart(2, '0')}
                <span className="inline-block h-px w-6 bg-accent" aria-hidden="true" />
              </p>

              <h1 className="mt-6 font-display text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[1.02] tracking-[-0.01em] text-fg">
                <SplitWords text={service.title} from={0.12} />
              </h1>

              <p
                className="reveal-rise mt-6 max-w-lg text-xl leading-snug text-fg"
                style={{ ['--reveal-delay' as string]: '0.3s' }}
              >
                {SERVICE_PROMISES[service.slug] ?? service.excerpt}
              </p>
              <p
                className="reveal-rise mt-4 max-w-lg text-base leading-relaxed text-fg-soft"
                style={{ ['--reveal-delay' as string]: '0.4s' }}
              >
                {service.excerpt}
              </p>

              <span
                aria-hidden="true"
                className="reveal-draw-x mt-9 block h-px w-40 bg-gradient-to-r from-accent to-transparent"
                style={{ ['--reveal-delay' as string]: '0.5s' }}
              />
            </div>

            <div
              className="reveal-scale relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none"
              style={{ ['--reveal-delay' as string]: '0.25s' }}
            >
              <div className="relative overflow-clip rounded-[2rem] border border-line bg-ink-raised/50 p-6 sm:p-8 xl:p-10">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-[70px]"
                />
                <div className="aspect-[320/290]">
                  <ServiceDiagram slug={service.slug} />
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* The engagement, section by section */}
      <section className="grain relative overflow-clip bg-ink py-14 md:py-24 lg:py-28">
        <SectionBackdrop glow="left" variant="orbs" />
        <Container>
          <Reveal className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-20">
            <div className="reveal-rise max-w-3xl">
              {intro ? (
                <div className="relative border-l-2 border-accent/60 pl-6 sm:pl-8">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.26em] text-accent">
                    Overview
                  </p>
                  <p className="mt-4 font-display text-2xl leading-snug tracking-[-0.01em] text-fg sm:text-[1.7rem]">
                    {intro}
                  </p>
                </div>
              ) : null}

              {sections.length > 0 ? (
                <div
                  className={`relative space-y-16 before:absolute before:bottom-4 before:left-[17px] before:top-4 before:w-px before:bg-line ${
                    intro ? 'mt-16' : ''
                  }`}
                >
                  {sections.map((section, index) => {
                    const lines = section.content.split('\n');
                    const bullets = lines
                      .map((line) => line.match(/^\s*-\s+(.*)/)?.[1]?.replace(/[*_`]/g, '').trim())
                      .filter((line): line is string => Boolean(line));
                    const prose = lines
                      .filter((line) => !/^\s*-\s+/.test(line))
                      .join('\n')
                      .trim();

                    return (
                      <div key={section.heading} className="relative pl-14 sm:pl-16">
                        <span className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-accent/40 bg-ink font-mono text-[11px] text-accent ring-4 ring-ink">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h2 className="pt-1 font-display text-2xl tracking-[-0.01em] text-fg sm:text-3xl">
                          {section.heading}
                        </h2>

                        {prose ? (
                          <div className="mt-5">
                            <Markdown body={prose} />
                          </div>
                        ) : null}

                        {bullets.length > 0 ? (
                          <ul className={`grid gap-3 sm:grid-cols-2 ${prose ? 'mt-6' : 'mt-6'}`}>
                            {bullets.map((bullet) => (
                              <li
                                key={bullet}
                                className="flex items-start gap-3 rounded-2xl border border-line bg-ink-raised/40 p-4 text-[13px] leading-relaxed text-fg-soft transition-colors duration-300 hover:border-accent/30 hover:text-fg"
                              >
                                <span
                                  aria-hidden="true"
                                  className="mt-[6px] h-1 w-1 shrink-0 rotate-45 bg-accent"
                                />
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={intro ? 'mt-14' : ''}>
                  <Markdown body={service.body} />
                </div>
              )}
            </div>

            <aside className="reveal-scale order-first lg:order-none" style={{ ['--reveal-delay' as string]: '0.15s' }}>
              <div className="relative overflow-clip rounded-3xl border border-line bg-ink-raised p-8 lg:sticky lg:top-28">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-accent/10 blur-[60px]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
                />
                <div className="relative flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/30 bg-accent-soft text-accent">
                    <Icon name={service.icon} className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-sm tracking-[0.2em] text-fg-soft/50">
                    {practiceIndex}
                    <span className="text-fg-soft/30"> / {String(allServices.length).padStart(2, '0')}</span>
                  </span>
                </div>
                <h2 className="relative mt-6 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-fg-soft">
                  At a glance
                </h2>
                <dl className="relative mt-2 divide-y divide-line">
                  {[
                    ['Practice', service.title],
                    ['Typical engagement', '6–16 weeks, weekly releases'],
                    ['Team shape', '2–4 engineers + a lead you talk to daily'],
                    ['Starts with', 'A scoping call and a written plan — free'],
                  ].map(([term, detail]) => (
                    <div key={term} className="py-4">
                      <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-soft/70">
                        {term}
                      </dt>
                      <dd className="mt-1.5 text-sm leading-relaxed text-fg">{detail}</dd>
                    </div>
                  ))}
                </dl>
                <div className="relative mt-6">
                  <Button href="/contact" className="w-full">
                    Scope this work
                  </Button>
                </div>
              </div>
            </aside>
          </Reveal>
        </Container>
      </section>

      {otherServices.length > 0 ? (
        <section className="grain relative overflow-clip bg-ink-raised py-14 md:py-24 lg:py-28">
          <SectionBackdrop glow="center" variant="plain" />
          <Container>
            <div className="flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-accent">
              <span className="inline-block h-px w-6 bg-accent" aria-hidden="true" />
              Other Services
            </div>
            <h2 className="mt-4 font-display text-3xl tracking-[-0.01em] text-fg sm:text-4xl">
              Explore the rest of the practice
            </h2>

            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {otherServices.map((item) => (
                <Link
                  key={item.slug}
                  href={`/services/${item.slug}`}
                  className="group flex flex-col gap-6 rounded-3xl border border-line bg-ink p-8 transition-colors hover:border-accent/30 hover:bg-accent-soft"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Icon name={item.icon} />
                  </span>
                  <div>
                    <h3 className="font-display text-lg tracking-[-0.01em] text-fg">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-fg-soft">{item.excerpt}</p>
                  </div>
                  <span className="mt-auto flex items-center gap-2 text-sm font-medium text-accent">
                    Learn more
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <ContactCta />
    </main>
  );
}
