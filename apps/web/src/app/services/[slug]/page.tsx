import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServices } from '@/lib/api';
import { site } from '@/lib/site';
import { PageHero } from '@/components/page-hero';
import { Container } from '@/components/container';
import { Markdown } from '@/components/markdown';
import { Icon } from '@/components/icon';
import { ContactCta } from '@/components/home/contact-cta';
import { JsonLd } from '@/components/json-ld';

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
    <main>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <PageHero eyebrow="Service" title={service.title} lede={service.excerpt} />

      <section className="bg-ink py-24 lg:py-28">
        <Container>
          <div className="max-w-3xl">
            <Markdown body={service.body} />
          </div>
        </Container>
      </section>

      {otherServices.length > 0 ? (
        <section className="bg-ink-raised py-24 lg:py-28">
          <Container>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              <span className="h-2 w-2 rotate-45 bg-accent" aria-hidden="true" />
              Other Services
            </div>
            <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-fg sm:text-4xl">
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
                    <h3 className="font-display text-lg font-medium tracking-tight text-fg">
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
