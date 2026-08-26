import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { Container } from '@/components/container';
import { SectionHeading } from '@/components/section-heading';
import { Button } from '@/components/button';
import { ContactForm } from '@/components/contact-form';
import { SectionBackdrop } from '@/components/section-backdrop';
import { Reveal } from '@/components/motion/reveal';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Metaxia Solutions to talk about your next project.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact',
    description: 'Get in touch with Metaxia Solutions to talk about your next project.',
  },
};

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about what you're building."
        lede="Tell us where you are and where you're headed. A real person on the team reads every message and replies with next steps, not a form letter."
      />

      <section className="grain relative overflow-clip bg-ink py-24 lg:py-28">
        <SectionBackdrop glow="right" variant="sweep" side="right" />
        <Container>
          <Reveal className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <div className="reveal-rise">
            <div>
              <SectionHeading
                eyebrow="Get In Touch"
                title="Reach us directly"
                lede="Prefer email or want to send a deck ahead of a call? Use the details below — the form works too."
              />

              <dl className="mt-10 space-y-8 border-t border-line pt-8">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-fg-soft">
                    Email
                  </dt>
                  <dd className="mt-2">
                    <a
                      href="mailto:hello@metaxia.io"
                      className="font-display text-xl tracking-[-0.01em] text-fg transition-colors hover:text-accent"
                    >
                      hello@metaxia.io
                    </a>
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-fg-soft">
                    Headquarters
                  </dt>
                  <dd className="mt-2 text-base leading-relaxed text-fg-soft">
                    480 Folsom Street, Suite 700
                    <br />
                    San Francisco, CA 94105
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-fg-soft">
                    Response Time
                  </dt>
                  <dd className="mt-2 text-base leading-relaxed text-fg-soft">
                    We reply to every message within one business day, Monday through Friday.
                  </dd>
                </div>
              </dl>
            </div>

            </div>
            <div className="reveal-rise" style={{ ['--reveal-delay' as string]: '0.15s' }}>
              <ContactForm />
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="grain relative overflow-clip border-t border-line bg-ink-raised py-20 lg:py-24">
        <SectionBackdrop glow="center" variant="plain" />
        <Container className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-2xl tracking-[-0.01em] text-fg sm:text-3xl">
              Have a quick question first?
            </h2>
            <p className="mt-3 max-w-md text-base leading-relaxed text-fg-soft">
              Check the FAQ — it covers engagement models, timelines, and how we scope work before
              anything else.
            </p>
          </div>
          <Button href="/faq" variant="ghost" className="shrink-0">
            Read the FAQ
          </Button>
        </Container>
      </section>
    </main>
  );
}
