import type { Testimonial } from '@metaxia/shared';
import { Container } from '@/components/container';
import { SectionHeading } from '@/components/section-heading';
import { Reveal } from '@/components/motion/reveal';

/**
 * One voice at a time, at reading-lectern scale. Native scroll-snap turns
 * the quotes into slides without a carousel library.
 */
export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <section className="overflow-hidden border-t border-line bg-ink py-28 lg:py-36">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading index="06" eyebrow="Client voices" title="What it's like to work with us." />
          <Reveal className="hidden lg:block">
            <p className="reveal-fade font-mono text-[11px] uppercase tracking-[0.25em] text-fg-soft">
              {String(items.length).padStart(2, '0')} voices · scroll →
            </p>
          </Reveal>
        </div>
      </Container>

      <Reveal>
        <div className="reveal-fade strip-scroll mt-14 flex snap-x snap-mandatory gap-8 overflow-x-auto px-6 lg:px-[max(2rem,calc((100vw-72rem)/2+2rem))]">
          {items.map((item, index) => (
            <figure
              key={item.id}
              className="w-[85vw] shrink-0 snap-center rounded-3xl border border-line bg-ink-raised p-10 sm:w-[38rem] lg:p-14"
            >
              <span aria-hidden="true" className="font-display text-6xl leading-none text-accent">
                &ldquo;
              </span>
              <blockquote className="mt-4 font-display text-2xl leading-snug tracking-[-0.01em] text-fg lg:text-3xl">
                {item.quote}
              </blockquote>
              <figcaption className="mt-8 flex items-baseline justify-between gap-4">
                <span>
                  <span className="block text-sm font-medium text-fg">{item.author}</span>
                  <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.18em] text-fg-soft">
                    {item.company}
                  </span>
                </span>
                <span className="font-mono text-xs text-fg-soft/60">
                  {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
