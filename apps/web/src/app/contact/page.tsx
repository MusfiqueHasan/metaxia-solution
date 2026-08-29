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

const CHANNELS = [
  {
    label: 'Email',
    value: 'hello@metaxia.io',
    note: 'Decks and briefs welcome',
    href: 'mailto:hello@metaxia.io',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="m4 7.5 8 5.5 8-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Base',
    value: 'Dhaka, Bangladesh',
    note: 'Working worldwide, async-friendly',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path
          d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: 'Response time',
    value: 'Within one business day',
    note: 'A person replies, not a form letter',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

const NEXT_STEPS = [
  { title: 'We read it — same day', note: 'Your message lands in a founder inbox, not a queue.' },
  { title: 'A 30-minute scoping call', note: 'We ask the hard questions early: goals, constraints, budget.' },
  { title: 'A written plan, free', note: 'Scope, timeline, and price in writing — yours to keep either way.' },
];

export default function ContactPage() {
  return (
    <main className="page-wide">
      <PageHero
        eyebrow="Contact"
        title="Let's talk about what you're building."
        lede="Tell us where you are and where you're headed. A real person on the team reads every message and replies with next steps, not a form letter."
      />

      <section className="grain relative overflow-clip bg-ink py-24 lg:py-28">
        <SectionBackdrop glow="right" variant="sweep" side="right" />
        <Container>
          <Reveal className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
            <div className="reveal-rise">
              <SectionHeading
                eyebrow="Get In Touch"
                title="Reach us directly"
                lede="Prefer email or want to send a deck ahead of a call? Use the details below — the form works too."
              />

              <p className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-line px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-fg-soft">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Taking new projects
              </p>

              <ul className="mt-8 space-y-3">
                {CHANNELS.map((channel) => {
                  const inner = (
                    <>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-line bg-ink text-accent transition-colors duration-300 group-hover:border-accent/40">
                        {channel.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-fg-soft/70">
                          {channel.label}
                        </span>
                        <span className="mt-1 block truncate font-display text-lg tracking-[-0.01em] text-fg transition-colors duration-300 group-hover:text-accent-strong">
                          {channel.value}
                        </span>
                        <span className="mt-0.5 block text-[13px] text-fg-soft">{channel.note}</span>
                      </span>
                      {channel.href ? (
                        <span
                          aria-hidden="true"
                          className="text-fg-soft/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
                        >
                          →
                        </span>
                      ) : null}
                    </>
                  );
                  const cardClass =
                    'group flex items-center gap-4 rounded-3xl border border-line bg-ink-raised/50 p-5 transition-colors duration-300 hover:border-accent/30';
                  return (
                    <li key={channel.label}>
                      {channel.href ? (
                        <a href={channel.href} className={cardClass}>
                          {inner}
                        </a>
                      ) : (
                        <div className={cardClass}>{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* What happens after you hit send */}
              <div className="mt-12">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.26em] text-accent">
                  What happens next
                </p>
                <ol className="relative mt-6 space-y-7 before:absolute before:bottom-3 before:left-[13px] before:top-3 before:w-px before:bg-line">
                  {NEXT_STEPS.map((step, index) => (
                    <li key={step.title} className="relative pl-12">
                      <span className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full border border-accent/40 bg-ink font-mono text-[10px] text-accent ring-4 ring-ink">
                        {index + 1}
                      </span>
                      <p className="text-sm font-medium text-fg">{step.title}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-fg-soft">{step.note}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="reveal-rise" style={{ ['--reveal-delay' as string]: '0.15s' }}>
              <ContactForm />

              {/* Fills the column under the form and helps people write a
                  brief we can act on in one pass. */}
              <div className="mt-5 rounded-3xl border border-line bg-ink-raised/40 p-7 lg:p-8">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.26em] text-accent">
                  The best briefs mention
                </p>
                <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {[
                    'The goal, in one sentence',
                    'A rough timeline or deadline',
                    'A budget range, even a wide one',
                    'Links to anything that already exists',
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[13px] leading-relaxed text-fg-soft"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[6px] h-1 w-1 shrink-0 rotate-45 bg-accent/60"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-line pt-4 text-[13px] leading-relaxed text-fg-soft/80">
                  Missing half of these? Send it anyway — shaping the brief together is part of
                  the first call.
                </p>
              </div>
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
