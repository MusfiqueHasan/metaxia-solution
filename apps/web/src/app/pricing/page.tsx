import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPricing } from '@/lib/api';
import { PageHero } from '@/components/page-hero';
import { Container } from '@/components/container';
import { Button } from '@/components/button';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Straightforward monthly plans for engaging Metaxia Solutions.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Pricing',
    description: 'Straightforward monthly plans for engaging Metaxia Solutions.',
  },
};

export default async function PricingPage() {
  // Page hidden per business decision — content and API stay intact.
  notFound();
  const plans = (await getPricing()).sort((a, b) => a.order - b.order);

  return (
    <main>
      <PageHero
        eyebrow="Pricing"
        title="Plans that scale with the work."
        lede="Every plan includes direct access to the engineers on your project. Pick the level of capacity that matches where you are."
      />

      <section className="bg-ink py-24 lg:py-28">
        <Container>
          {plans.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-3xl bg-ink-raised ${
                    plan.highlighted
                      ? 'border-2 border-accent p-[31px]'
                      : 'border border-line p-8'
                  }`}
                >
                  {plan.highlighted ? (
                    <span className="absolute -top-3 left-8 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-white">
                      Most popular
                    </span>
                  ) : null}

                  <h2 className="font-display text-xl tracking-[-0.01em] text-fg">
                    {plan.name}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-fg-soft">{plan.description}</p>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="font-display text-4xl tabular-nums text-fg">
                      ${plan.price.toLocaleString('en-US')}
                    </span>
                    <span className="text-sm text-fg-soft">{plan.period}</span>
                  </div>

                  <ul className="mt-8 flex flex-1 flex-col gap-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-fg-soft">
                        <span
                          aria-hidden="true"
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent"
                        >
                          <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
                            <path
                              d="M5 12.5 9.5 17 19 7"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <Button
                      href="/contact"
                      variant={plan.highlighted ? 'primary' : 'ghost'}
                     
                      className="w-full"
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-fg-soft">Pricing is temporarily unavailable.</p>
          )}
        </Container>
      </section>
    </main>
  );
}
