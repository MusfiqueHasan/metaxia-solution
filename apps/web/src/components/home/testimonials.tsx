import type { Testimonial } from '@metaxia/shared';
import { Container } from '@/components/container';
import { SectionHeading } from '@/components/section-heading';

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <section className="bg-surface py-24 lg:py-28">
      <Container>
        <SectionHeading eyebrow="Client Voices" title="What partners say" />
      </Container>

      <div className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 lg:px-8">
        {items.map((item) => (
          <figure
            key={`${item.author}-${item.company}`}
            className="flex w-[300px] shrink-0 snap-start flex-col justify-between rounded-3xl border border-ink/10 bg-surface-alt p-8 sm:w-[380px]"
          >
            <span aria-hidden="true" className="font-display text-4xl leading-none text-accent">
              &ldquo;
            </span>
            <blockquote className="mt-4 flex-1 font-display text-lg font-medium leading-snug tracking-tight text-ink">
              {item.quote}
            </blockquote>
            <figcaption className="mt-6 text-sm text-ink-soft">
              <span className="font-medium text-ink">{item.author}</span> &mdash; {item.company}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
