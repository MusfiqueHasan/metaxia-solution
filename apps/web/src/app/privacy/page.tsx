import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { Container } from '@/components/container';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Metaxia Solutions collects, uses, and protects information.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy',
    description: 'How Metaxia Solutions collects, uses, and protects information.',
  },
};

const sections = [
  {
    heading: 'Information We Collect',
    body: "We collect information you give us directly, such as your name, email address, and any details you share through a contact form or project inquiry. We also collect limited technical information automatically when you visit our site, including browser type, device information, and general usage patterns, so we can keep the site working correctly.",
  },
  {
    heading: 'How We Use Information',
    body: 'We use the information we collect to respond to inquiries, deliver the services you request, improve our website and communications, and meet our legal and accounting obligations. We do not use the information you share with us for purposes unrelated to why you provided it.',
  },
  {
    heading: 'Sharing and Disclosure',
    body: 'We do not sell personal information. We may share information with service providers who help us operate our business, such as hosting and email delivery providers, under agreements that limit how they may use it. We may also disclose information if required by law or to protect our legal rights.',
  },
  {
    heading: 'Data Retention',
    body: 'We retain information for as long as reasonably necessary to fulfill the purposes described in this policy, satisfy legal obligations, and resolve disputes. When information is no longer needed, we take reasonable steps to delete or anonymize it.',
  },
  {
    heading: 'Your Choices',
    body: 'You can ask us to access, correct, or delete personal information we hold about you by contacting us directly. You can also opt out of non-essential communications, such as our newsletter, at any time using the unsubscribe link included in those messages.',
  },
  {
    heading: 'Changes to This Policy',
    body: 'We may update this policy from time to time to reflect changes in our practices or for legal or operational reasons. We will post the updated policy on this page with a revised effective date.',
  },
];

export default function PrivacyPage() {
  return (
    <main>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        lede="This is a general, placeholder overview of how we approach privacy — it is not a substitute for a policy reviewed by counsel."
      />

      <section className="bg-surface py-24 lg:py-28">
        <Container>
          <div className="max-w-3xl space-y-10">
            {sections.map((section) => (
              <div key={section.heading}>
                <h2 className="font-display text-2xl font-medium tracking-tight text-ink">
                  {section.heading}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-ink-soft">{section.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
