import type { Metadata } from 'next';
import { getFaq } from '@/lib/api';
import { PageHero } from '@/components/page-hero';
import { Container } from '@/components/container';
import { JsonLd } from '@/components/json-ld';
import { SectionBackdrop } from '@/components/section-backdrop';
import { Reveal } from '@/components/motion/reveal';

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

      <section className="grain relative overflow-clip bg-ink py-24 lg:py-28">
        <SectionBackdrop glow="left" variant="cube" side="right" />
        <Container>
          {faq.length > 0 ? (
            <Reveal className="max-w-3xl divide-y divide-line border-y border-line">
              {faq.map((item, index) => (
                <details
                  key={item.id}
                  className="reveal-rise group py-6"
                  style={{ ['--reveal-delay' as string]: `${index * 0.06}s` }}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-lg tracking-[-0.01em] text-fg [&::-webkit-details-marker]:hidden">
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
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-fg-soft">
                    {item.answer}
                  </p>
                </details>
              ))}
            </Reveal>
          ) : (
            <p className="text-sm text-fg-soft">FAQs are temporarily unavailable.</p>
          )}
        </Container>
      </section>
    </main>
  );
}
