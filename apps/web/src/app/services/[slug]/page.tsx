import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServices, getService } from '@/lib/api';
import { PageHero } from '@/components/page-hero';
import { Container } from '@/components/container';
import { Markdown } from '@/components/markdown';
import { Icon } from '@/components/icon';
import { ContactCta } from '@/components/home/contact-cta';

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export const dynamicParams = true;

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  const allServices = await getServices();
  const otherServices = allServices.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <main>
      <PageHero eyebrow="Service" title={service.title} lede={service.excerpt} />

      <section className="bg-surface py-24 lg:py-28">
        <Container className="max-w-3xl">
          <Markdown body={service.body} />
        </Container>
      </section>

      {otherServices.length > 0 ? (
        <section className="bg-surface-alt py-24 lg:py-28">
          <Container>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              <span className="h-2 w-2 rotate-45 bg-accent" aria-hidden="true" />
              Other Services
            </div>
            <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Explore the rest of the practice
            </h2>

            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {otherServices.map((item) => (
                <Link
                  key={item.slug}
                  href={`/services/${item.slug}`}
                  className="group flex flex-col gap-6 rounded-3xl border border-ink/10 bg-surface p-8 transition-colors hover:border-accent/30 hover:bg-accent-soft"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Icon name={item.icon} />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-medium tracking-tight text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.excerpt}</p>
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
