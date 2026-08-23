import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getJobs } from '@/lib/api';
import { site } from '@/lib/site';
import { Container } from '@/components/container';
import { Markdown } from '@/components/markdown';
import { Button } from '@/components/button';
import { JsonLd } from '@/components/json-ld';

export async function generateStaticParams() {
  const jobs = await getJobs();
  return jobs.map((job) => ({ slug: job.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const jobs = await getJobs();
  const job = jobs.find((item) => item.slug === slug);
  if (!job) return { title: 'Not found' };

  return {
    title: job.title,
    description: `${job.title} — ${job.location}, ${job.type} at Metaxia Solutions.`,
    alternates: { canonical: `/careers/${job.slug}` },
    openGraph: {
      title: job.title,
      description: `${job.title} — ${job.location}, ${job.type} at Metaxia Solutions.`,
    },
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const jobs = await getJobs();
  const job = jobs.find((item) => item.slug === slug);
  if (!job) notFound();

  const jobPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.body,
    datePosted: job.createdAt,
    employmentType: job.type,
    hiringOrganization: {
      '@type': 'Organization',
      name: site.name,
    },
    ...(job.location === 'Remote'
      ? { jobLocationType: 'TELECOMMUTE' }
      : {
          jobLocation: {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              addressLocality: job.location,
            },
          },
        }),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Careers', item: `${site.url}/careers` },
      { '@type': 'ListItem', position: 3, name: job.title, item: `${site.url}/careers/${job.slug}` },
    ],
  };

  return (
    <main>
      <JsonLd data={jobPostingJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <section className="grid-signature relative overflow-hidden bg-ink text-white">
        <Container className="pt-24 pb-20 lg:pt-28 lg:pb-24">
          <h1 className="max-w-3xl font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            {job.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
              {job.location}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
              {job.type}
            </span>
          </div>
        </Container>
      </section>

      <section className="bg-surface py-24 lg:py-28">
        <Container>
          <div className="max-w-3xl">
            <Markdown body={job.body} />

            <div className="mt-10">
              <Button href="/contact" variant="primary">
                Apply for This Role
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
