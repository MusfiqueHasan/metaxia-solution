import Link from 'next/link';
import type { Service } from '@metaxia/shared';
import { Container } from '@/components/container';
import { SectionHeading } from '@/components/section-heading';
import { Icon } from '@/components/icon';

export function FeaturedServices({ services }: { services: Service[] }) {
  return (
    <section className="bg-surface py-24 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="What We Do"
          title="Capabilities built for scale"
          lede="Six practice areas, one team. Pick where you need momentum."
        />

        {services.length > 0 ? (
          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 sm:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group flex flex-col gap-6 bg-surface-alt p-8 transition-colors hover:bg-accent-soft"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Icon name={service.icon} />
                </span>
                <div>
                  <h3 className="font-display text-xl font-medium tracking-tight text-ink">
                    {service.title}
                  </h3>
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
        ) : null}
      </Container>
    </section>
  );
}
