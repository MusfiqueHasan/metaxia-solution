import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { Container } from '@/components/container';
import { SectionHeading } from '@/components/section-heading';
import { Icon } from '@/components/icon';
import { Approach } from '@/components/home/approach';

export const metadata: Metadata = {
  title: 'About',
  description: 'The team and thinking behind Metaxia Solutions.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About',
    description: 'The team and thinking behind Metaxia Solutions.',
  },
};

const stats = [
  { value: '120+', label: 'Projects shipped' },
  { value: '9', label: 'Years in business' },
  { value: '60+', label: 'Clients served' },
  { value: '35', label: 'People on the team' },
];

const values = [
  {
    icon: 'shield',
    title: 'Trust is the deliverable',
    body: 'Every recommendation is one we would make with our own systems on the line — no upsells disguised as advice.',
  },
  {
    icon: 'code',
    title: 'Craft over noise',
    body: "Clean architecture and readable code outlast whoever's on the project today. We build for the engineer who inherits it.",
  },
  {
    icon: 'chart',
    title: 'Outcomes over output',
    body: 'Velocity only counts if it moves a number that matters to the business. We measure ourselves the same way you do.',
  },
  {
    icon: 'spark',
    title: 'Direct, always',
    body: "If a timeline slips or an idea won't work, you hear it from us first — plainly, and with a plan attached.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="About Metaxia"
        title="A technology partner built to outlast the project."
        lede="We started Metaxia because too many enterprise builds ended at launch. We stay for the decade after."
      />

      <section className="bg-ink py-24 lg:py-28">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
            <SectionHeading eyebrow="Our Story" title="Founded on a simple complaint" />
            <div className="space-y-6 text-base leading-relaxed text-fg-soft">
              <p>
                Metaxia Solutions was founded by engineers who kept watching the same thing
                happen: a vendor would ship an ambitious system, collect the final invoice, and
                disappear before anyone found out whether it actually worked under real load. We
                started this company to be the team that stays — the one still on the call when
                the architecture needs to flex for the business it was built to serve.
              </p>
              <p>
                Today we work end to end: cloud infrastructure, product engineering, security
                posture, and the AI systems enterprises are racing to adopt safely. The thread
                connecting all of it is the same one we started with — build things properly,
                explain the trade-offs honestly, and measure success by what changes for the
                client, not by what we shipped.
              </p>
              <p>
                We&rsquo;re still a team small enough that the people who scope your project are
                the people who build it, and large enough to carry an enterprise engagement from
                first workshop to production and beyond.
              </p>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-10 border-y border-line py-10 sm:grid-cols-4 sm:divide-x sm:divide-line">
            {stats.map((stat) => (
              <div key={stat.label} className="sm:px-8 sm:first:pl-0">
                <span className="font-display text-4xl font-medium tabular-nums text-fg">
                  {stat.value}
                </span>
                <p className="mt-2 text-sm text-fg-soft">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ink-raised py-24 lg:py-28">
        <Container>
          <SectionHeading
            eyebrow="What We Value"
            title="The principles behind every engagement"
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {values.map((value) => (
              <div
                key={value.title}
                className="flex items-start gap-6 rounded-3xl border border-line bg-ink p-8"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Icon name={value.icon} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-medium tracking-tight text-fg">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-fg-soft">{value.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Approach />
    </main>
  );
}
