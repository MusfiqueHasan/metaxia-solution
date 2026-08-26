import { Container } from '@/components/container';
import { SectionHeading } from '@/components/section-heading';
import { Reveal } from '@/components/motion/reveal';
import { SectionBackdrop } from '@/components/section-backdrop';

const capabilities = [
  { label: 'Web Development', value: 90 },
  { label: 'Cloud', value: 85 },
  { label: 'Security', value: 80 },
  { label: 'AI Integration', value: 75 },
  { label: 'Mobile', value: 70 },
  { label: 'Design', value: 65 },
];

/**
 * The capability index: an instrument readout, not a chart. Each meter fills
 * once on reveal; the value reads in mono like telemetry.
 */
export function Skills() {
  return (
    <section className="grain relative overflow-clip border-t border-line bg-ink py-28 lg:py-36">
      <SectionBackdrop mark="04" glow="left" variant="floor" />
      <Container>
        <SectionHeading
          index="04" eyebrow="Capability index"
          title="Where our depth actually is."
          lede="Self-assessed, argued over quarterly, and honest — a partner should tell you what they're best at."
        />

        <Reveal className="mt-16">
          <dl className="grid gap-x-16 gap-y-10 lg:grid-cols-2">
            {capabilities.map((capability, index) => (
              <div
                key={capability.label}
                className="reveal-rise"
                style={{ ['--reveal-delay' as string]: `${index * 0.07}s` }}
              >
                <dt className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-xl tracking-[-0.01em] text-fg">
                    {capability.label}
                  </span>
                  <span className="font-mono text-sm tabular-nums text-fg-soft">
                    {capability.value}
                    <span className="text-fg-soft/60">/100</span>
                  </span>
                </dt>
                <dd className="mt-4">
                  <div
                    role="progressbar"
                    aria-valuenow={capability.value}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${capability.label} capability`}
                    className="h-px w-full bg-line-strong"
                  >
                    <div
                      className="meter-fill h-px bg-accent shadow-[0_0_12px_0_var(--color-accent)]"
                      style={{
                        ['--meter-value' as string]: capability.value / 100,
                        ['--reveal-delay' as string]: `${0.2 + index * 0.07}s`,
                      }}
                    />
                  </div>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
