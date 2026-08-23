import type { Metadata } from 'next';
import Link from 'next/link';
import { getTeam } from '@/lib/api';
import { initials } from '@/lib/format';
import { PageHero } from '@/components/page-hero';
import { Container } from '@/components/container';

export const metadata: Metadata = {
  title: 'Team',
  description: 'The people who scope, build, and stand behind every Metaxia engagement.',
};

export default async function TeamPage() {
  const team = (await getTeam()).sort((a, b) => a.order - b.order);

  return (
    <main>
      <PageHero
        eyebrow="Our Team"
        title="The people behind the work."
        lede="A small team of engineers, designers, and strategists who scope, build, and stay accountable for what ships."
      />

      <section className="bg-surface py-24 lg:py-28">
        <Container>
          {team.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((member) => (
                <Link
                  key={member.slug}
                  href={`/team/${member.slug}`}
                  className="group flex flex-col items-start gap-5 rounded-3xl border border-ink/10 bg-surface-alt p-8 transition-colors hover:border-accent/30 hover:bg-accent-soft"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft font-display text-lg font-medium text-accent">
                    {initials(member.name)}
                  </span>
                  <div>
                    <h2 className="font-display text-lg font-medium tracking-tight text-ink">
                      {member.name}
                    </h2>
                    <p className="mt-1 text-sm text-ink-soft">{member.role}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-soft">Team profiles are temporarily unavailable.</p>
          )}
        </Container>
      </section>
    </main>
  );
}
