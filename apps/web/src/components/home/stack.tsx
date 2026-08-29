import { Container } from '@/components/container';
import { SectionHeading } from '@/components/section-heading';
import { Reveal } from '@/components/motion/reveal';
import { SectionBackdrop } from '@/components/section-backdrop';

const GROUPS = [
  {
    label: 'Interface',
    items: [
      { name: 'Next.js', note: 'App router · ISR' },
      { name: 'React', note: 'Server components' },
      { name: 'TypeScript', note: 'End to end' },
      { name: 'Tailwind CSS', note: 'Design systems' },
      { name: 'Flutter', note: 'iOS · Android' },
    ],
  },
  {
    label: 'Services',
    items: [
      { name: 'NestJS', note: 'Typed APIs' },
      { name: 'Node.js', note: 'Runtime' },
      { name: 'Prisma', note: 'ORM · migrations' },
      { name: 'REST & GraphQL', note: 'Contracts' },
      { name: 'JWT & OAuth', note: 'Auth' },
    ],
  },
  {
    label: 'Data & cloud',
    items: [
      { name: 'PostgreSQL', note: 'System of record' },
      { name: 'Redis', note: 'Cache · queues' },
      { name: 'AWS', note: 'Compute · storage' },
      { name: 'Docker', note: 'Repeatable deploys' },
      { name: 'Firebase', note: 'Realtime · push' },
    ],
  },
  {
    label: 'Delivery',
    items: [
      { name: 'CI/CD', note: 'Ship on green' },
      { name: 'Playwright', note: 'E2E confidence' },
      { name: 'Stripe & SSLCommerz', note: 'Payments' },
      { name: 'Figma', note: 'Design source' },
      { name: 'SEO & analytics', note: 'Measured launches' },
    ],
  },
];

/**
 * The toolbox: the concrete stack behind the case studies above — grouped
 * by layer, read like a manifest. Replaces the old capability meters, which
 * restated the services section as percentages.
 */
export function Stack() {
  return (
    <section className="grain relative overflow-clip border-t border-line bg-ink py-16 md:py-28 lg:py-36">
      <SectionBackdrop glow="left" variant="sweep" side="right" />
      <Container>
        <SectionHeading
          index="04"
          eyebrow="The toolbox"
          title="The stack we actually ship with."
          lede="Chosen per brief, never by default — every tool below is running in production in the work above."
        />

        <Reveal className="mt-16">
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {GROUPS.map((group, groupIndex) => (
              <div
                key={group.label}
                className="reveal-rise"
                style={{ ['--reveal-delay' as string]: `${groupIndex * 0.08}s` }}
              >
                <p className="flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.26em] text-accent">
                  <span className="h-1 w-1 rotate-45 bg-accent" aria-hidden="true" />
                  {group.label}
                </p>

                <ul className="mt-6 border-y border-line">
                  {group.items.map((item) => (
                    <li
                      key={item.name}
                      className="group/tool flex items-baseline justify-between gap-3 border-b border-line py-3.5 last:border-b-0"
                    >
                      <span className="text-[15px] font-medium text-fg transition-colors duration-300 group-hover/tool:text-accent">
                        {item.name}
                      </span>
                      <span className="shrink-0 text-right font-mono text-[10px] uppercase tracking-[0.14em] text-fg-soft/70 transition-colors duration-300 group-hover/tool:text-fg-soft">
                        {item.note}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p
            className="reveal-fade mt-12 max-w-xl font-mono text-[11px] uppercase leading-relaxed tracking-[0.2em] text-fg-soft/70"
            style={{ ['--reveal-delay' as string]: '0.4s' }}
          >
            Twenty instruments, one rule — the brief picks the tool, not the other way around.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
