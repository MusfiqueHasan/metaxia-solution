import type { Metadata } from 'next';
import Link from 'next/link';
import { getTeam } from '@/lib/api';
import { initials } from '@/lib/format';
import { PageHero } from '@/components/page-hero';
import { Container } from '@/components/container';
import { SectionBackdrop } from '@/components/section-backdrop';
import { Reveal } from '@/components/motion/reveal';

export const metadata: Metadata = {
  title: 'Team',
  description: 'The people who scope, build, and stand behind every Metaxia engagement.',
  alternates: { canonical: '/team' },
  openGraph: {
    title: 'Team',
    description: 'The people who scope, build, and stand behind every Metaxia engagement.',
  },
};

export default async function TeamPage() {
  const team = (await getTeam()).sort((a, b) => a.order - b.order);

  return (
    <main className="page-wide">
      <PageHero
        eyebrow="Our Team"
        title="The people behind the work."
        lede="A small team of engineers, designers, and strategists who scope, build, and stay accountable for what ships."
      />

      <section className="grain relative overflow-clip bg-ink py-24 lg:py-28">
        <SectionBackdrop glow="center" variant="orbs" />
        <Container>
          {team.length > 0 ? (
            <Reveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((member, index) => (
                <Link
                  key={member.slug}
                  style={{ ['--reveal-delay' as string]: `${index * 0.08}s` }}
                  href={`/team/${member.slug}`}
                  className="reveal-scale group flex flex-col items-start gap-5 rounded-3xl border border-line bg-ink-raised p-8 transition-colors hover:border-accent/30 hover:bg-accent-soft"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft font-display text-lg text-accent">
                    {initials(member.name)}
                  </span>
                  <div>
                    <h2 className="font-display text-lg tracking-[-0.01em] text-fg">
                      {member.name}
                    </h2>
                    <p className="mt-1 text-sm text-fg-soft">{member.role}</p>
                  </div>
                </Link>
              ))}
            </Reveal>
          ) : (
            <p className="text-sm text-fg-soft">Team profiles are temporarily unavailable.</p>
          )}
        </Container>
      </section>
    </main>
  );
}
