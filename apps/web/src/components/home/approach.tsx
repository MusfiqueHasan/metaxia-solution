'use client';

import { useEffect, useRef } from 'react';
import { Container } from '@/components/container';
import { SectionHeading } from '@/components/section-heading';
import { Reveal } from '@/components/motion/reveal';
import { SectionBackdrop } from '@/components/section-backdrop';

const steps = [
  {
    title: 'Think big',
    body: 'Every engagement starts from the business outcome, not the backlog. We map the system you actually need before anyone opens an editor.',
  },
  {
    title: 'Start small',
    body: 'The first release is deliberately narrow: one workflow, in production, carrying real traffic. Proof beats projection.',
  },
  {
    title: 'Ship fast',
    body: 'Weekly releases with observability wired in from day one. You watch the system grow instead of waiting for a reveal.',
  },
  {
    title: 'Scale smart',
    body: 'Once the system earns its load, we harden it — performance budgets, cost guardrails, and a team that knows every failure mode.',
  },
];

/**
 * Sticky storytelling: the section's thesis holds on the left while the four
 * stages pass on the right. The stage names also live as giant outlined
 * ghost words under the sticky heading, each flipping up in 3D as scroll
 * progress (--sp) crosses its threshold.
 */
export function Approach() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      section.style.setProperty('--sp', '1');
      return;
    }

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = section.getBoundingClientRect();
        const total = rect.height + window.innerHeight;
        const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / total));
        section.style.setProperty('--sp', progress.toFixed(4));
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="grain relative overflow-clip border-t border-line bg-ink py-28 lg:py-36"
    >
      <SectionBackdrop glow="right" variant="ring" side="right" />
      <Container>
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              index="03"
              eyebrow="How we work"
              title="A method that survives contact with production."
              lede="Four stages, in order, every time. The order is the method — each stage earns the next."
            />

            {/* Ghost typography: the four stage names flip up in 3D, one by
                one, as the visitor scrolls the stages on the right. */}
            <div
              aria-hidden="true"
              className="pointer-events-none mt-16 hidden select-none flex-col gap-2 lg:flex"
              style={{ perspective: '700px' }}
            >
              {steps.map((step, index) => {
                const start = 0.12 + index * 0.13;
                const local = `clamp(0, (var(--sp, 0) - ${start}) * 6, 1)`;
                return (
                  <span
                    key={step.title}
                    className={`whitespace-nowrap font-display text-6xl leading-[1.05] tracking-[-0.01em] xl:text-7xl ${
                      index === steps.length - 1 ? 'text-outline--accent' : 'text-outline'
                    }`}
                    style={{
                      opacity: `calc(${local})`,
                      transform: `rotateX(calc((1 - ${local}) * 78deg)) translateY(calc((1 - ${local}) * 2.5rem))`,
                      transformOrigin: 'center bottom',
                      willChange: 'transform, opacity',
                    }}
                  >
                    {step.title}
                  </span>
                );
              })}
            </div>
          </div>

          <ol className="flex flex-col">
            {steps.map((step, index) => (
              <li key={step.title} className="border-b border-line first:border-t">
                <Reveal threshold={0.4}>
                  <div className="grid grid-cols-[auto_1fr] gap-6 py-10 lg:gap-10 lg:py-14">
                    <span className="reveal-fade font-mono text-sm text-accent">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="reveal-rise font-display text-3xl tracking-[-0.01em] text-fg lg:text-4xl">
                        {step.title}
                      </h3>
                      <p
                        className="reveal-rise mt-4 max-w-md text-base leading-relaxed text-fg-soft"
                        style={{ ['--reveal-delay' as string]: '0.1s' }}
                      >
                        {step.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
