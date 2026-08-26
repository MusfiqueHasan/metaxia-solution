import type { Metadata } from 'next';
import { getServices, getCaseStudies, getPosts, getTestimonials } from '@/lib/api';
import { site } from '@/lib/site';
import { Hero } from '@/components/home/hero';
import { ServiceMarquee } from '@/components/home/service-marquee';
import { ServicesExplorer } from '@/components/home/services-explorer';
import { CaseStudyScroller } from '@/components/home/case-study-scroller';
import { Approach } from '@/components/home/approach';
import { Skills } from '@/components/home/skills';
import { BlogPreview } from '@/components/home/blog-preview';
import { Testimonials } from '@/components/home/testimonials';
import { ContactCta } from '@/components/home/contact-cta';

export const metadata: Metadata = {
  description: site.description,
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Metaxia Solutions — Technology & IT Solutions',
    description: site.description,
  },
};

export default async function Home() {
  const [services, caseStudies, posts, testimonials] = await Promise.all([
    getServices(),
    getCaseStudies(),
    getPosts(),
    getTestimonials(),
  ]);

  const stats = [
    { value: services.length, label: 'Core capabilities' },
    { value: caseStudies.length, label: 'Case studies delivered' },
    { value: testimonials.length, label: 'Client voices' },
  ].filter((stat) => stat.value > 0);

  return (
    <main>
      <Hero stats={stats} />
      <ServiceMarquee services={services} />
      <ServicesExplorer services={services} />
      <CaseStudyScroller items={caseStudies} />
      <Approach />
      <Skills />
      <BlogPreview posts={posts.slice(0, 3)} />
      <Testimonials items={testimonials} />
      <ContactCta />
    </main>
  );
}
