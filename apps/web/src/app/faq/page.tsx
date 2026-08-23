import type { Metadata } from 'next';
import { getFaq } from '@/lib/api';
import { PageHero } from '@/components/page-hero';
import { Container } from '@/components/container';
import { JsonLd } from '@/components/json-ld';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Answers to the questions we hear most often from prospective clients.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'FAQ',
    description: 'Answers to the questions we hear most often from prospective clients.',
  },
};

export default async function FaqPage() {
  const faq = (await getFaq()).sort((a, b) => a.order - b.order);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <main>
      <JsonLd data={faqJsonLd} />
      <PageHero
        eyebrow="FAQ"
        title="Questions we hear a lot."
        lede="If your question isn't answered here, the fastest way to get a direct answer is to reach out."
      />

      <section className="bg-surface py-24 lg:py-28">
        <Container>
          {faq.length > 0 ? (
            <div className="max-w-3xl divide-y divide-ink/10 border-y border-ink/10">
              {faq.map((item) => (
                <details key={item.id} className="group py-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-lg font-medium tracking-tight text-ink [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <span
                      aria-hidden="true"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent transition-transform group-open:rotate-45"
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                        <path
                          d="M12 5v14M5 12h14"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-soft">FAQs are temporarily unavailable.</p>
          )}
        </Container>
      </section>
    </main>
  );
}
