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
    <main className="page-wide">
      <JsonLd data={faqJsonLd} />
      <PageHero
        eyebrow="FAQ"
        title="Questions we hear a lot."
        lede="If your question isn't answered here, the fastest way to get a direct answer is to reach out."
      />

      <section className="grain relative overflow-clip bg-ink py-14 md:py-24 lg:py-28">
        <SectionBackdrop glow="left" variant="cube" side="right" />
        <Container>
          <Reveal className="grid gap-14 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
            {/* Sticky rail: the count, the promise, the escape hatch */}
            <div className="reveal-rise">
              <div className="lg:sticky lg:top-28">
                <p className="flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-accent">
                  <span className="inline-block h-px w-6 bg-accent" aria-hidden="true" />
                  The straight answers
                </p>
                <p className="mt-6 font-display text-4xl tabular-nums tracking-[-0.01em] text-fg">
                  {String(faq.length).padStart(2, '0')}
                  <span className="text-fg-soft/40"> questions</span>
                </p>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-soft">
                  Engagement models, timelines, ownership, and how we scope work — answered the
                  way we'd answer them on a call.
                </p>

                <a
                  href="/contact"
                  className="group mt-10 flex items-center gap-4 rounded-3xl border border-line bg-ink-raised/50 p-5 transition-colors duration-300 hover:border-accent/30"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-line bg-ink text-accent transition-colors duration-300 group-hover:border-accent/40">
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                      <path
                        d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.6 0-3.1-.4-4.4-1.2L3 20l1.2-5.1A8.5 8.5 0 1 1 21 11.5z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-fg">
                      Not covered here?
                    </span>
                    <span className="mt-0.5 block text-[13px] text-fg-soft">
                      Ask directly — replies within a day
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-fg-soft/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
                  >
                    →
                  </span>
                </a>
              </div>
            </div>

            {/* The answers, as numbered cards */}
            <div className="reveal-rise" style={{ ['--reveal-delay' as string]: '0.12s' }}>
              {faq.length > 0 ? (
                <div className="space-y-3.5">
                  {faq.map((item, index) => (
                    <details
                      key={item.id}
                      open={index === 0}
                      className="reveal-rise group overflow-clip rounded-3xl border border-line bg-ink-raised/50 transition-colors duration-300 open:border-accent/30 open:bg-ink-raised hover:border-accent/30"
                      style={{ ['--reveal-delay' as string]: `${index * 0.05}s` }}
                    >
                      <summary className="flex cursor-pointer list-none items-center gap-5 p-6 [&::-webkit-details-marker]:hidden sm:p-7">
                        <span className="hidden font-mono text-xs tracking-[0.2em] text-fg-soft/50 transition-colors duration-300 group-open:text-accent sm:block">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="flex-1 font-display text-lg tracking-[-0.01em] text-fg transition-colors duration-300 group-open:text-accent-strong sm:text-xl">
                          {item.question}
                        </span>
                        <span
                          aria-hidden="true"
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-ink text-fg-soft transition-all duration-300 group-open:rotate-45 group-open:border-accent/40 group-open:bg-accent-soft group-open:text-accent"
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
                      <div className="px-6 pb-7 sm:px-7 sm:pl-[4.25rem]">
                        <p className="border-l-2 border-accent/40 pl-5 text-sm leading-relaxed text-fg-soft">
                          {item.answer}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-fg-soft">FAQs are temporarily unavailable.</p>
              )}
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
