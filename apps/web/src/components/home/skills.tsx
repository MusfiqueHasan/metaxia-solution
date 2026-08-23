import { Container } from '@/components/container';
import { SectionHeading } from '@/components/section-heading';

const skills = [
  { label: 'Web Development', value: 90 },
  { label: 'Cloud', value: 85 },
  { label: 'Security', value: 80 },
  { label: 'AI Integration', value: 75 },
  { label: 'Mobile', value: 70 },
  { label: 'Design', value: 65 },
];

export function Skills() {
  return (
    <section className="bg-surface py-24 lg:py-28">
      <Container>
        <SectionHeading eyebrow="Capabilities" title="Where the team is strongest" />

        <div className="mt-14 grid max-w-3xl gap-8">
          {skills.map((skill) => (
            <div key={skill.label}>
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-ink">{skill.label}</span>
                <span className="font-display text-sm font-medium tabular-nums text-ink-soft">
                  {skill.value}%
                </span>
              </div>
              <div
                role="progressbar"
                aria-label={skill.label}
                aria-valuenow={skill.value}
                aria-valuemin={0}
                aria-valuemax={100}
                className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-accent-soft"
              >
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${skill.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
