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
 * stages of an engagement pass on the right. Numbering is real sequence here —
 * this is how a project actually unfolds.
 */
export function Approach() {
  return (
    <section className="grain relative overflow-clip border-t border-line bg-ink py-28 lg:py-36">
      <SectionBackdrop mark="03" glow="right" variant="orbs" />
      <Container>
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              index="03" eyebrow="How we work"
              title="A method that survives contact with production."
              lede="Four stages, in order, every time. The order is the method — each stage earns the next."
            />
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
