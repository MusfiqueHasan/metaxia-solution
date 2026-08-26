import type { Metadata } from 'next';
import Link from 'next/link';
import { getCaseStudies } from '@/lib/api';
import { PageHero } from '@/components/page-hero';
import { Container } from '@/components/container';

export const metadata: Metadata = {
  title: 'Case Studies',
  description: 'Systems Metaxia has designed, shipped, and scaled for clients across industries.',
  alternates: { canonical: '/case-studies' },
  openGraph: {
    title: 'Case Studies',
    description: 'Systems Metaxia has designed, shipped, and scaled for clients across industries.',
  },
};

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();

  return (
    <main>
      <PageHero
        eyebrow="Case Studies"
        title="Outcomes, not just output."
        lede="A sample of the systems we've shipped for clients across industries — and what changed once they were live."
      />

      <section className="bg-ink py-24 lg:py-28">
        <Container>
          {caseStudies.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2">
              {caseStudies.map((item) => (
                <Link
                  key={item.slug}
                  href={`/case-studies/${item.slug}`}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-ink-raised"
                >
                  <div className="flex h-48 items-end p-6" style={{ background: item.coverGradient }}>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-white backdrop-blur">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-8">
                    <h2 className="font-display text-xl tracking-[-0.01em] text-fg">
                      {item.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-fg-soft">{item.excerpt}</p>
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
          ) : (
            <p className="text-sm text-fg-soft">Case studies are temporarily unavailable.</p>
          )}
        </Container>
      </section>
    </main>
  );
}
