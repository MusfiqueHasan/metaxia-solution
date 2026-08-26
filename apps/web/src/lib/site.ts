export const site = {
  name: 'Metaxia Solutions',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  description: 'Technology and IT solutions partner for ambitious enterprises.',
};

export const navLinks = [
  { label: 'Services', href: '/services' },
  { label: 'Case Study', href: '/case-studies' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
];

export const footerLinks = {
  company: [
    { label: 'About', href: '/about' },
    { label: 'Team', href: '/team' },
    { label: 'FAQ', href: '/faq' },
  ],
  resources: [
    { label: 'Blog', href: '/blog' },
    { label: 'Case Studies', href: '/case-studies' },
    ],
};
