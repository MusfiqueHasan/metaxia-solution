import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const KEY = 'metaxia_admin_token';

export const getToken = () => (typeof window === 'undefined' ? null : localStorage.getItem(KEY));
export const setToken = (t: string) => localStorage.setItem(KEY, t);
export const clearToken = () => localStorage.removeItem(KEY);

export async function adminFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`/api/admin${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  if (res.status === 401) {
    clearToken();
    window.location.href = '/admin';
    throw new Error('unauthorized');
  }
  if (!res.ok) throw new Error(((await res.json()) as { message?: string }).message ?? 'request failed');
  return res.json() as Promise<T>;
}

export interface FieldDef {
  name: string;
  label: string;
  kind: 'text' | 'textarea' | 'number' | 'boolean' | 'list' | 'date' | 'richtext' | 'image';
  optional?: boolean;
  placeholder?: string;
}

export interface ResourceDef {
  key: string;
  apiPath: string;
  publicPath: string;
  label: string;
  columns: string[];
  fields: FieldDef[];
}

export const RESOURCES: ResourceDef[] = [
  {
    key: 'services',
    apiPath: '/admin/services',
    publicPath: '/services',
    label: 'Services',
    columns: ['title', 'slug', 'order'],
    fields: [
      { name: 'title', label: 'Title', kind: 'text', placeholder: 'e.g. Cloud Architecture' },
      { name: 'slug', label: 'Slug', kind: 'text', placeholder: 'kebab-case-url-slug' },
      { name: 'excerpt', label: 'Excerpt', kind: 'textarea', placeholder: 'One or two sentences shown on cards and lists' },
      { name: 'body', label: 'Body (markdown)', kind: 'textarea', placeholder: 'Full body — markdown supported (## headings, - bullets)' },
      { name: 'icon', label: 'Icon key', kind: 'text', placeholder: 'cloud · code · shield · phone · spark · chart' },
      { name: 'order', label: 'Order', kind: 'number', placeholder: '1' },
    ],
  },
  {
    key: 'case-studies',
    apiPath: '/admin/case-studies',
    publicPath: '/case-studies',
    label: 'Case studies',
    columns: ['title', 'slug', 'category', 'order'],
    fields: [
      { name: 'title', label: 'Title', kind: 'text', placeholder: 'e.g. Cloud Architecture' },
      { name: 'slug', label: 'Slug', kind: 'text', placeholder: 'kebab-case-url-slug' },
      { name: 'category', label: 'Category', kind: 'text', placeholder: 'e.g. Software, AI, Design' },
      { name: 'excerpt', label: 'Excerpt', kind: 'textarea', placeholder: 'One or two sentences shown on cards and lists' },
      { name: 'body', label: 'Body (markdown)', kind: 'textarea', placeholder: 'Full body — markdown supported (## headings, - bullets)' },
      { name: 'coverGradient', label: 'Cover gradient', kind: 'text', placeholder: 'linear-gradient(135deg,#0ea5e9,#6366f1)' },
      { name: 'websiteUrl', label: 'Website URL', kind: 'text', optional: true, placeholder: 'https://client-site.com' },
      { name: 'previewImage', label: 'Preview image', kind: 'image', optional: true, placeholder: '/projects/slug-web.webp' },
      { name: 'order', label: 'Order', kind: 'number', placeholder: '1' },
    ],
  },
  {
    key: 'posts',
    apiPath: '/admin/posts',
    publicPath: '/posts',
    label: 'Blog posts',
    columns: ['title', 'slug', 'category', 'publishedAt'],
    fields: [
      { name: 'title', label: 'Title', kind: 'text', placeholder: 'e.g. Cloud Architecture' },
      { name: 'slug', label: 'Slug', kind: 'text', placeholder: 'kebab-case-url-slug' },
      { name: 'category', label: 'Category', kind: 'text', placeholder: 'e.g. Software, AI, Design' },
      { name: 'excerpt', label: 'Excerpt', kind: 'textarea', placeholder: 'One or two sentences shown on cards and lists' },
      { name: 'body', label: 'Body', kind: 'richtext' },
      { name: 'publishedAt', label: 'Published at', kind: 'date', optional: true },
    ],
  },
  {
    key: 'team',
    apiPath: '/admin/team',
    publicPath: '/team',
    label: 'Team',
    columns: ['name', 'slug', 'role', 'order'],
    fields: [
      { name: 'name', label: 'Name', kind: 'text', placeholder: 'Full name' },
      { name: 'slug', label: 'Slug', kind: 'text', placeholder: 'kebab-case-url-slug' },
      { name: 'role', label: 'Role', kind: 'text', placeholder: 'e.g. Co-Founder & CEO' },
      { name: 'bio', label: 'Bio', kind: 'textarea', placeholder: 'Two or three sentences about this person' },
      { name: 'photoUrl', label: 'Photo', kind: 'image', optional: true, placeholder: '/projects/name.jpg' },
      { name: 'linkedinUrl', label: 'LinkedIn URL', kind: 'text', optional: true, placeholder: 'https://linkedin.com/in/…' },
      { name: 'order', label: 'Order', kind: 'number', placeholder: '1' },
    ],
  },
  {
    key: 'jobs',
    apiPath: '/admin/jobs',
    publicPath: '/jobs',
    label: 'Jobs',
    columns: ['title', 'slug', 'location', 'type'],
    fields: [
      { name: 'title', label: 'Title', kind: 'text', placeholder: 'e.g. Cloud Architecture' },
      { name: 'slug', label: 'Slug', kind: 'text', placeholder: 'kebab-case-url-slug' },
      { name: 'location', label: 'Location', kind: 'text', placeholder: 'Remote · Dhaka, BD' },
      { name: 'type', label: 'Type', kind: 'text', placeholder: 'Full-time · Contract' },
      { name: 'body', label: 'Body (markdown)', kind: 'textarea', placeholder: 'Full body — markdown supported (## headings, - bullets)' },
    ],
  },
  {
    key: 'pricing',
    apiPath: '/admin/pricing',
    publicPath: '/pricing',
    label: 'Pricing',
    columns: ['name', 'price', 'period', 'order'],
    fields: [
      { name: 'name', label: 'Name', kind: 'text', placeholder: 'Full name' },
      { name: 'price', label: 'Price', kind: 'number', placeholder: '499' },
      { name: 'period', label: 'Period', kind: 'text', placeholder: 'per month' },
      { name: 'description', label: 'Description', kind: 'textarea', placeholder: 'Short plan description' },
      { name: 'features', label: 'Features (one per line)', kind: 'list', placeholder: 'One feature per line' },
      { name: 'highlighted', label: 'Highlighted', kind: 'boolean' },
      { name: 'order', label: 'Order', kind: 'number', placeholder: '1' },
    ],
  },
  {
    key: 'faq',
    apiPath: '/admin/faq',
    publicPath: '/faq',
    label: 'FAQ',
    columns: ['question', 'order'],
    fields: [
      { name: 'question', label: 'Question', kind: 'text', placeholder: 'The question visitors ask' },
      { name: 'answer', label: 'Answer', kind: 'textarea', placeholder: 'The answer, in a sentence or three' },
      { name: 'order', label: 'Order', kind: 'number', placeholder: '1' },
    ],
  },
  {
    key: 'testimonials',
    apiPath: '/admin/testimonials',
    publicPath: '/testimonials',
    label: 'Testimonials',
    columns: ['author', 'company', 'order'],
    fields: [
      { name: 'quote', label: 'Quote', kind: 'textarea', placeholder: 'What the client said' },
      { name: 'author', label: 'Author', kind: 'text', placeholder: 'Client name' },
      { name: 'company', label: 'Company', kind: 'text', placeholder: 'Client company' },
      { name: 'order', label: 'Order', kind: 'number', placeholder: '1' },
    ],
  },
];

export function getResource(key: string): ResourceDef | undefined {
  return RESOURCES.find((r) => r.key === key);
}

/** Redirects to /admin if there is no stored token. Use in protected client pages. */
export function useRequireAuth() {
  const router = useRouter();
  useEffect(() => {
    if (!getToken()) router.replace('/admin');
  }, [router]);
}
