import type { MetadataRoute } from 'next';
import { getServices, getCaseStudies, getPosts, getTeam } from '@/lib/api';
import { site } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, cases, posts, team] = await Promise.all([
    getServices(), getCaseStudies(), getPosts(), getTeam(),
  ]);
  const statics = ['', '/about', '/services', '/case-studies', '/blog', '/team',
    '/faq', '/contact', '/privacy', '/terms']
    .map((p) => ({ url: `${site.url}${p}` }));
  return [
    ...statics,
    ...services.map((s) => ({ url: `${site.url}/services/${s.slug}` })),
    ...cases.map((c) => ({ url: `${site.url}/case-studies/${c.slug}` })),
    ...posts.map((p) => ({ url: `${site.url}/blog/${p.slug}` })),
    ...team.map((t) => ({ url: `${site.url}/team/${t.slug}` })),
  ];
}
