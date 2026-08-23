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
  kind: 'text' | 'textarea' | 'number' | 'boolean' | 'list' | 'date';
  optional?: boolean;
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
      { name: 'title', label: 'Title', kind: 'text' },
      { name: 'slug', label: 'Slug', kind: 'text' },
      { name: 'excerpt', label: 'Excerpt', kind: 'textarea' },
      { name: 'body', label: 'Body (markdown)', kind: 'textarea' },
      { name: 'icon', label: 'Icon key', kind: 'text' },
      { name: 'order', label: 'Order', kind: 'number' },
    ],
  },
  {
    key: 'case-studies',
    apiPath: '/admin/case-studies',
    publicPath: '/case-studies',
    label: 'Case studies',
    columns: ['title', 'slug', 'category', 'order'],
    fields: [
      { name: 'title', label: 'Title', kind: 'text' },
      { name: 'slug', label: 'Slug', kind: 'text' },
      { name: 'category', label: 'Category', kind: 'text' },
      { name: 'excerpt', label: 'Excerpt', kind: 'textarea' },
      { name: 'body', label: 'Body (markdown)', kind: 'textarea' },
      { name: 'coverGradient', label: 'Cover gradient', kind: 'text' },
      { name: 'order', label: 'Order', kind: 'number' },
    ],
  },
  {
    key: 'posts',
    apiPath: '/admin/posts',
    publicPath: '/posts',
    label: 'Blog posts',
    columns: ['title', 'slug', 'category', 'publishedAt'],
    fields: [
      { name: 'title', label: 'Title', kind: 'text' },
      { name: 'slug', label: 'Slug', kind: 'text' },
      { name: 'category', label: 'Category', kind: 'text' },
      { name: 'excerpt', label: 'Excerpt', kind: 'textarea' },
      { name: 'body', label: 'Body (markdown)', kind: 'textarea' },
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
      { name: 'name', label: 'Name', kind: 'text' },
      { name: 'slug', label: 'Slug', kind: 'text' },
      { name: 'role', label: 'Role', kind: 'text' },
      { name: 'bio', label: 'Bio', kind: 'textarea' },
      { name: 'linkedinUrl', label: 'LinkedIn URL', kind: 'text', optional: true },
      { name: 'order', label: 'Order', kind: 'number' },
    ],
  },
  {
    key: 'jobs',
    apiPath: '/admin/jobs',
    publicPath: '/jobs',
    label: 'Jobs',
    columns: ['title', 'slug', 'location', 'type'],
    fields: [
      { name: 'title', label: 'Title', kind: 'text' },
      { name: 'slug', label: 'Slug', kind: 'text' },
      { name: 'location', label: 'Location', kind: 'text' },
      { name: 'type', label: 'Type', kind: 'text' },
      { name: 'body', label: 'Body (markdown)', kind: 'textarea' },
    ],
  },
  {
    key: 'pricing',
    apiPath: '/admin/pricing',
    publicPath: '/pricing',
    label: 'Pricing',
    columns: ['name', 'price', 'period', 'order'],
    fields: [
      { name: 'name', label: 'Name', kind: 'text' },
      { name: 'price', label: 'Price', kind: 'number' },
      { name: 'period', label: 'Period', kind: 'text' },
      { name: 'description', label: 'Description', kind: 'textarea' },
      { name: 'features', label: 'Features (one per line)', kind: 'list' },
      { name: 'highlighted', label: 'Highlighted', kind: 'boolean' },
      { name: 'order', label: 'Order', kind: 'number' },
    ],
  },
  {
    key: 'faq',
    apiPath: '/admin/faq',
    publicPath: '/faq',
    label: 'FAQ',
    columns: ['question', 'order'],
    fields: [
      { name: 'question', label: 'Question', kind: 'text' },
      { name: 'answer', label: 'Answer', kind: 'textarea' },
      { name: 'order', label: 'Order', kind: 'number' },
    ],
  },
  {
    key: 'testimonials',
    apiPath: '/admin/testimonials',
    publicPath: '/testimonials',
    label: 'Testimonials',
    columns: ['author', 'company', 'order'],
    fields: [
      { name: 'quote', label: 'Quote', kind: 'textarea' },
      { name: 'author', label: 'Author', kind: 'text' },
      { name: 'company', label: 'Company', kind: 'text' },
      { name: 'order', label: 'Order', kind: 'number' },
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
