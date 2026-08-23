import type {
  Service,
  CaseStudy,
  Post,
  TeamMember,
  Job,
  PricingPlan,
  FaqItem,
  Testimonial,
} from '@metaxia/shared';

const API_URL = process.env.API_URL ?? 'http://localhost:4000';

async function get<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 60 } });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export const getServices = () => get<Service[]>('/services', []);
export const getService = (slug: string) => get<Service | null>(`/services/${slug}`, null);
export const getCaseStudies = () => get<CaseStudy[]>('/case-studies', []);
export const getCaseStudy = (slug: string) => get<CaseStudy | null>(`/case-studies/${slug}`, null);
export const getPosts = () => get<Post[]>('/posts', []);
export const getPost = (slug: string) => get<Post | null>(`/posts/${slug}`, null);
export const getTeam = () => get<TeamMember[]>('/team', []);
export const getTeamMember = (slug: string) => get<TeamMember | null>(`/team/${slug}`, null);
export const getJobs = () => get<Job[]>('/jobs', []);
export const getJob = (slug: string) => get<Job | null>(`/jobs/${slug}`, null);
export const getPricing = () => get<PricingPlan[]>('/pricing', []);
export const getFaq = () => get<FaqItem[]>('/faq', []);
export const getTestimonials = () => get<Testimonial[]>('/testimonials', []);
