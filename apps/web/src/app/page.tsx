import type { Metadata } from 'next';
import { getServices, getCaseStudies, getPosts } from '@/lib/api';
import { site } from '@/lib/site';
import { Hero } from '@/components/home/hero';
import { EthosMarquee } from '@/components/home/service-marquee';
import { ServicesExplorer } from '@/components/home/services-explorer';
import { CaseStudyScroller } from '@/components/home/case-study-scroller';
import { Approach } from '@/components/home/approach';
import { Stack } from '@/components/home/stack';
import { BlogPreview } from '@/components/home/blog-preview';
import { ContactCta } from '@/components/home/contact-cta';
import { ScrollTop } from '@/components/motion/scroll-top';

export const metadata: Metadata = {
  description: site.description,
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Metaxia Solutions — Technology & IT Solutions',
    description: site.description,
  },
};

export default async function Home() {
  const [services, caseStudies, posts] = await Promise.all([
    getServices(),
    getCaseStudies(),
    getPosts(),
  ]);

  const stats = [
    { value: services.length, label: 'Core capabilities' },
    { value: caseStudies.length, label: 'Case studies delivered' },
  ].filter((stat) => stat.value > 0);

  return (
    <main>
      <Hero stats={stats} />
      <EthosMarquee />
      <ServicesExplorer services={services} />
      <CaseStudyScroller items={caseStudies} />
      <Approach />
      <Stack />
      <BlogPreview posts={posts.slice(0, 3)} />
      <ContactCta />
      <ScrollTop />
    </main>
  );
}
