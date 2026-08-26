import Link from 'next/link';
import type { Service } from '@metaxia/shared';
import { SectionBackdrop } from '@/components/section-backdrop';

/**
 * The services, on loop: an infinite marquee of the six disciplines right
 * under the hero. Two copies of the list scroll -50% for a seamless cycle;
 * hover or keyboard focus pauses the track.
 */
export function ServiceMarquee({ services }: { services: Service[] }) {
  if (services.length === 0) return null;

  return (
    <section className="relative overflow-clip border-y border-line bg-ink py-10" aria-label="Services">
      <SectionBackdrop glow="center" />
      <p className="mb-8 text-center font-mono text-[11px] uppercase tracking-[0.28em] text-fg-soft/70">
        Six disciplines · one accountable team
      </p>
      <div className="marquee overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex" aria-hidden={copy === 1}>
              {services.map((service) => (
                <Link
                  key={`${copy}-${service.slug}`}
                  href={`/services/${service.slug}`}
                  tabIndex={copy === 1 ? -1 : 0}
                  className="group flex shrink-0 items-center gap-3 px-10"
                >
                  <span
                    className="h-1.5 w-1.5 rotate-45 bg-accent/50 transition-colors duration-300 group-hover:bg-accent"
                    aria-hidden="true"
                  />
                  <span className="whitespace-nowrap font-display text-2xl tracking-[-0.01em] text-fg-soft/60 transition-colors duration-300 group-hover:text-fg">
                    {service.title}
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
