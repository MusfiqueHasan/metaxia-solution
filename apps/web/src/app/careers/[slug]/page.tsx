import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getJobs } from '@/lib/api';

export async function generateStaticParams() {
  return [];
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

export default async function JobDetailPage() {
  // Page hidden per business decision — content and API stay intact.
  notFound();
}
