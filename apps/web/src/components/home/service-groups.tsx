import Link from 'next/link';
import type { Service } from '@metaxia/shared';
import { Container } from '@/components/container';
import { SectionHeading } from '@/components/section-heading';
import { Icon } from '@/components/icon';

export function ServiceGroups({ services }: { services: Service[] }) {
  if (services.length === 0) return null;

  return (
    <section className="bg-surface-alt py-24 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Deeper Capabilities"
          title="The rest of the stack"
          lede="From security posture to AI integration, here's what rounds out the practice."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {services.map((service, index) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className={`group flex items-start gap-6 rounded-3xl border border-ink/10 p-8 transition-colors hover:border-accent/30 hover:bg-accent-soft ${
                index === services.length - 1 && services.length % 2 === 1 ? 'sm:col-span-2' : ''
              }`}
            >
              <span className="font-display text-sm font-medium tabular-nums text-accent">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Icon name={service.icon} />
              </span>
              <div className="flex-1">
                <h3 className="font-display text-xl font-medium tracking-tight text-ink">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{service.excerpt}</p>
              </div>
              <span
                aria-hidden="true"
                className="mt-1 shrink-0 text-ink-soft transition-transform group-hover:translate-x-1 group-hover:text-accent"
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
