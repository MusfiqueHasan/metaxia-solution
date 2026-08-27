import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServices } from '@/lib/api';
import { site } from '@/lib/site';
import { PageHero } from '@/components/page-hero';
import { Container } from '@/components/container';
import { Button } from '@/components/button';
import { Markdown } from '@/components/markdown';
import { Icon } from '@/components/icon';
import { ContactCta } from '@/components/home/contact-cta';
import { JsonLd } from '@/components/json-ld';
import { SectionBackdrop } from '@/components/section-backdrop';
import { Reveal } from '@/components/motion/reveal';

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
      <PageHero eyebrow="Service" title={service.title} lede={service.excerpt} />

      <section className="grain relative overflow-clip bg-ink py-24 lg:py-28">
        <SectionBackdrop glow="left" variant="orbs" />
        <Container>
          <Reveal className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-20">
            <div className="reveal-rise max-w-3xl">
              <Markdown body={service.body} />
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
                      {String(allServices.findIndex((s) => s.slug === service.slug) + 1).padStart(2, '0')}{' '}
                      / {String(allServices.length).padStart(2, '0')} — {service.title}
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
                <div className="mt-8">
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
