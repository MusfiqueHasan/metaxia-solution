import { notFound } from 'next/navigation';
import { getTeam } from '@/lib/api';
import { Container } from '@/components/container';
import { ContactCta } from '@/components/home/contact-cta';

export async function generateStaticParams() {
  const team = await getTeam();
  return team.map((member) => ({ slug: member.slug }));
}

export const dynamicParams = true;

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const team = await getTeam();
  const member = team.find((item) => item.slug === slug);
  if (!member) notFound();

  const bioParagraphs = member.bio.split(/\n\n+/);

  return (
    <main>
      <section className="grid-signature relative overflow-hidden bg-ink text-white">
        <Container className="flex flex-col items-start gap-6 pt-24 pb-20 lg:pt-28 lg:pb-24">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-soft font-display text-2xl font-medium text-accent">
            {initials(member.name)}
          </span>
          <div>
            <h1 className="font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
              {member.name}
            </h1>
            <p className="mt-3 text-lg text-white/60">{member.role}</p>
          </div>
        </Container>
      </section>

      <section className="bg-surface py-24 lg:py-28">
        <Container>
          <div className="max-w-3xl space-y-5">
            {bioParagraphs.map((paragraph, index) => (
              <p key={index} className="text-base leading-relaxed text-ink-soft">
                {paragraph}
              </p>
            ))}

            {member.linkedinUrl ? (
              <a
                href={member.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 pt-2 text-sm font-medium text-accent"
              >
                View LinkedIn profile
                <span aria-hidden="true">→</span>
              </a>
            ) : null}
          </div>
        </Container>
      </section>

      <ContactCta />
    </main>
  );
}
