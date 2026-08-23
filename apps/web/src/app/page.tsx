import type { Metadata } from 'next';
import { getServices, getCaseStudies, getPosts, getTestimonials } from '@/lib/api';
import { site } from '@/lib/site';
import { Hero } from '@/components/home/hero';
import { FeaturedServices } from '@/components/home/featured-services';
import { LogoStrip } from '@/components/home/logo-strip';
import { ServiceGroups } from '@/components/home/service-groups';
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
      <FeaturedServices services={services.slice(0, 3)} />
      <LogoStrip />
      <ServiceGroups services={services.slice(3)} />
      <CaseStudyScroller items={caseStudies} />
      <Approach />
      <Skills />
      <BlogPreview posts={posts.slice(0, 3)} />
      <Testimonials items={testimonials} />
      <ContactCta />
    </main>
  );
}
