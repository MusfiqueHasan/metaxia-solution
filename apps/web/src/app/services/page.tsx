import type { Metadata } from 'next';
import Link from 'next/link';
import { getServices } from '@/lib/api';
import { PageHero } from '@/components/page-hero';
import { Container } from '@/components/container';
import { Icon } from '@/components/icon';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Six practice areas covering cloud, product, security, and AI engineering.',
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <main>
      <PageHero
        eyebrow="Services"
        title="Six practice areas, one accountable team."
        lede="Engage us for a single capability or the whole system — every practice is staffed by people who ship, not just advise."
      />

      <section className="bg-surface py-24 lg:py-28">
        <Container>
          {services.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group flex flex-col gap-6 rounded-3xl border border-ink/10 bg-surface-alt p-8 transition-colors hover:border-accent/30 hover:bg-accent-soft"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Icon name={service.icon} />
                  </span>
                  <div>
                    <h2 className="font-display text-xl font-medium tracking-tight text-ink">
                      {service.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">{service.excerpt}</p>
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
          ) : (
            <p className="text-sm text-ink-soft">Services are temporarily unavailable.</p>
          )}
        </Container>
      </section>
    </main>
  );
}
