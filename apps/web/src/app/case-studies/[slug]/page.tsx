import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCaseStudies } from '@/lib/api';
import { Container } from '@/components/container';
import { Markdown } from '@/components/markdown';
import { ContactCta } from '@/components/home/contact-cta';

export async function generateStaticParams() {
  const caseStudies = await getCaseStudies();
  return caseStudies.map((item) => ({ slug: item.slug }));
}

export const dynamicParams = true;

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const allCaseStudies = (await getCaseStudies()).sort((a, b) => a.order - b.order);
  const index = allCaseStudies.findIndex((item) => item.slug === slug);
  const caseStudy = index >= 0 ? allCaseStudies[index] : undefined;
  if (!caseStudy) notFound();

  const prev = index > 0 ? allCaseStudies[index - 1] : null;
  const next = index >= 0 && index < allCaseStudies.length - 1 ? allCaseStudies[index + 1] : null;

  return (
    <main>
      <section
        className="relative overflow-hidden text-white"
        style={{ background: caseStudy.coverGradient }}
      >
        <Container className="pt-24 pb-20 lg:pt-28 lg:pb-24">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-white backdrop-blur">
            {caseStudy.category}
          </span>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            {caseStudy.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            {caseStudy.excerpt}
          </p>
        </Container>
      </section>

      <section className="bg-surface py-24 lg:py-28">
        <Container>
          <div className="max-w-3xl">
            <Markdown body={caseStudy.body} />
          </div>
        </Container>
      </section>

      {prev || next ? (
        <section className="border-t border-ink/10 bg-surface-alt py-10">
          <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {prev ? (
              <Link
                href={`/case-studies/${prev.slug}`}
                className="group flex items-center gap-3 text-sm font-medium text-ink-soft hover:text-ink"
              >
                <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">
                  ←
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-[0.15em] text-ink-soft/70">
                    Previous
                  </span>
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/case-studies/${next.slug}`}
                className="group flex items-center gap-3 text-right text-sm font-medium text-ink-soft hover:text-ink sm:ml-auto"
              >
                <span>
                  <span className="block text-xs uppercase tracking-[0.15em] text-ink-soft/70">
                    Next
                  </span>
                  {next.title}
                </span>
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            ) : null}
          </Container>
        </section>
      ) : null}

      <ContactCta />
    </main>
  );
}
