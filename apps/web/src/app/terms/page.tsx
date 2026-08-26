import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { Container } from '@/components/container';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms that govern use of the Metaxia Solutions website and services.',
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms of Service',
    description: 'The terms that govern use of the Metaxia Solutions website and services.',
  },
};

const sections = [
  {
    heading: 'Acceptance of Terms',
    body: 'By using this website or engaging our services, you agree to these terms. If you do not agree with any part of them, we ask that you not use the site or engage our services until any concerns are resolved with us directly.',
  },
  {
    heading: 'Use of the Website',
    body: 'This website is provided for informational purposes about our company and services. You agree not to misuse the site, attempt to access it in unauthorized ways, or use it to distribute harmful or unlawful content.',
  },
  {
    heading: 'Service Engagements',
    body: 'Specific project work is governed by a separate signed agreement between Metaxia Solutions and the client, which will set out scope, pricing, timelines, and responsibilities in detail. These general terms apply to the website itself and do not replace that agreement.',
  },
  {
    heading: 'Intellectual Property',
    body: "Unless otherwise agreed in writing, the content on this website, including text, graphics, and logos, belongs to Metaxia Solutions or its licensors. You may not reproduce or redistribute this content without our permission.",
  },
  {
    heading: 'Limitation of Liability',
    body: 'This website and its content are provided as-is, without warranties of any kind. To the extent permitted by law, Metaxia Solutions is not liable for indirect or incidental damages arising from use of this site.',
  },
  {
    heading: 'Changes to These Terms',
    body: 'We may revise these terms from time to time. Continued use of the website after changes are posted constitutes acceptance of the updated terms.',
  },
];

export default function TermsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        lede="This is a general, placeholder overview of our terms — it is not a substitute for terms reviewed by counsel."
      />

      <section className="bg-ink py-24 lg:py-28">
        <Container>
          <div className="max-w-3xl space-y-10">
            {sections.map((section) => (
              <div key={section.heading}>
                <h2 className="font-display text-2xl tracking-[-0.01em] text-fg">
                  {section.heading}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-fg-soft">{section.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
