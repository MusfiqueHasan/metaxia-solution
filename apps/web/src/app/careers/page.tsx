import type { Metadata } from 'next';
import Link from 'next/link';
import { getJobs } from '@/lib/api';
import { PageHero } from '@/components/page-hero';
import { Container } from '@/components/container';

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Open roles at Metaxia Solutions, across engineering, design, and delivery.',
  alternates: { canonical: '/careers' },
  openGraph: {
    title: 'Careers',
    description: 'Open roles at Metaxia Solutions, across engineering, design, and delivery.',
  },
};

export default async function CareersPage() {
  const jobs = await getJobs();

  return (
    <main>
      <PageHero
        eyebrow="Careers"
        title="Build alongside people who ship."
        lede="We're a small team working on real client systems, not internal tools nobody uses. Here's what's currently open."
      />

      <section className="bg-surface py-24 lg:py-28">
        <Container>
          <div className="max-w-2xl">
            <p className="text-base leading-relaxed text-ink-soft">
              Every role here works directly on client engagements from day one. We hire for
              strong fundamentals and clear communication over years of experience alone, and we
              keep the team small enough that everyone's work is visible.
            </p>
          </div>

          {jobs.length > 0 ? (
            <div className="mt-14 divide-y divide-ink/10 border-y border-ink/10">
              {jobs.map((job) => (
                <Link
                  key={job.slug}
                  href={`/careers/${job.slug}`}
                  className="group flex flex-col gap-3 py-7 transition-colors hover:bg-accent-soft sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <div>
                    <h2 className="font-display text-lg font-medium tracking-tight text-ink">
                      {job.title}
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-medium text-ink-soft">
                        {job.location}
                      </span>
                      <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-medium text-ink-soft">
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <span className="flex items-center gap-2 text-sm font-medium text-accent">
                    View role
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-14 text-sm text-ink-soft">
              We don't have any open roles right now — check back soon.
            </p>
          )}
        </Container>
      </section>
    </main>
  );
}
