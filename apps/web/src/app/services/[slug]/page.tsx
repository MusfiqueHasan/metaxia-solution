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
                className="reveal-fade group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-fg-soft transition-colors hover:border-accent hover:text-accent"
              >
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-x-0.5"
                >
                  ←
                </span>
                All services
              </Link>

              <p
                className="reveal-fade mt-8 flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-accent"
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
              className="reveal-scale relative hidden lg:block"
              style={{ ['--reveal-delay' as string]: '0.25s' }}
            >
              <div className="relative overflow-clip rounded-[2rem] border border-line bg-ink-raised/50 p-8 xl:p-10">
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
      <section className="grain relative overflow-clip bg-ink py-24 lg:py-28">
        <SectionBackdrop glow="left" variant="orbs" />
        <Container>
          <Reveal className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-20">
            <div className="reveal-rise max-w-3xl">
              {intro ? (
                <p className="font-display text-2xl leading-snug tracking-[-0.01em] text-fg sm:text-[1.7rem]">
                  {intro}
                </p>
              ) : null}

              <div className={intro ? 'mt-14 space-y-14' : 'space-y-14'}>
                {sections.length > 0 ? (
                  sections.map((section, index) => (
                    <div key={section.heading} className="border-t border-line pt-10">
                      <div className="flex items-baseline gap-4">
                        <span className="font-mono text-sm text-accent">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h2 className="font-display text-2xl tracking-[-0.01em] text-fg sm:text-3xl">
                          {section.heading}
                        </h2>
                      </div>
                      <div className="mt-6 pl-0 sm:pl-10">
                        <Markdown body={section.content} />
                      </div>
                    </div>
                  ))
                ) : (
                  <Markdown body={service.body} />
                )}
              </div>
            </div>

            <aside className="reveal-scale order-first lg:order-none" style={{ ['--reveal-delay' as string]: '0.15s' }}>
              <div className="rounded-3xl border border-line bg-ink-raised p-8 lg:sticky lg:top-28">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-ink text-accent">
                  <Icon name={service.icon} className="h-5 w-5" />
                </span>
                <h2 className="mt-6 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-fg-soft">
                  At a glance
                </h2>
                <dl className="mt-5 space-y-5">
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-soft/70">
                      Practice
                    </dt>
                    <dd className="mt-1 text-sm text-fg">
                      {practiceIndex} / {String(allServices.length).padStart(2, '0')} — {service.title}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-soft/70">
                      Typical engagement
                    </dt>
                    <dd className="mt-1 text-sm text-fg">6–16 weeks, weekly releases</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-soft/70">
                      Team shape
                    </dt>
                    <dd className="mt-1 text-sm text-fg">2–4 engineers + a lead you talk to daily</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-soft/70">
                      Starts with
                    </dt>
                    <dd className="mt-1 text-sm text-fg">A scoping call and a written plan — free</dd>
                  </div>
                </dl>
                <div className="mt-8 space-y-3">
                  <Button href="/contact" className="w-full">
                    Scope this work
                  </Button>
                  <Link
                    href="/services"
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-fg-soft transition-colors hover:border-accent hover:text-accent"
                  >
                    ← All services
                  </Link>
                </div>
              </div>
            </aside>
          </Reveal>
        </Container>
      </section>

      {otherServices.length > 0 ? (
        <section className="grain relative overflow-clip bg-ink-raised py-24 lg:py-28">
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
