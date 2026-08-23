import Link from 'next/link';
import type { CaseStudy } from '@metaxia/shared';
import { Container } from '@/components/container';
import { SectionHeading } from '@/components/section-heading';

export function CaseStudyScroller({ items }: { items: CaseStudy[] }) {
  if (items.length === 0) return null;

  return (
    <section className="bg-surface py-24 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Selected Work"
          title="Outcomes, not just output"
          lede="A sample of the systems we've shipped for clients across industries."
        />
      </Container>

      <div className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 lg:px-8">
        {items.map((item) => (
            <Link
              key={item.slug}
              href={`/case-studies/${item.slug}`}
              className="group flex w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-ink/10 bg-surface-alt sm:w-[380px]"
            >
              <div
                className="flex h-44 items-end p-6"
                style={{ background: item.coverGradient }}
              >
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-white backdrop-blur">
                  {item.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-medium tracking-tight text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.excerpt}</p>
                <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-medium text-accent">
                  Read the case study
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
        ))}
      </div>
    </section>
  );
}
