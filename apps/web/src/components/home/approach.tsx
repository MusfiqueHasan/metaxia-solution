import { Container } from '@/components/container';
import { SectionHeading } from '@/components/section-heading';

const principles = [
  {
    title: 'Think Big',
    body: "We start with the outcome that matters in three years, not three sprints. Every recommendation is stress-tested against where your business is headed.",
  },
  {
    title: 'Start Small',
    body: 'The first release is scoped to prove the idea, not showcase every feature. Small, shippable slices reduce risk and surface real feedback fast.',
  },
  {
    title: 'Ship Fast',
    body: 'Momentum compounds, so we favor weekly releases over quarterly milestones. Tight feedback loops mean problems surface in days, not months.',
  },
  {
    title: 'Scale Smart',
    body: "Architecture decisions are made for the load you'll have, not the load you have today. We build the seams in before you need to cut along them.",
  },
];

export function Approach() {
  return (
    <section className="bg-surface-alt py-24 lg:py-28">
      <Container>
        <SectionHeading eyebrow="How We Work" title="A method built for momentum" />

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-ink/10">
          {principles.map((item) => (
            <div key={item.title} className="lg:px-8 lg:first:pl-0">
              <h3 className="font-display text-lg font-medium tracking-tight text-ink">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">{item.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
