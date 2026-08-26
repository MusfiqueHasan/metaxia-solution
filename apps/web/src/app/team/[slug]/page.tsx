import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTeam } from '@/lib/api';
import { initials } from '@/lib/format';
import { site } from '@/lib/site';
import { Container } from '@/components/container';
import { ContactCta } from '@/components/home/contact-cta';
import { JsonLd } from '@/components/json-ld';

export async function generateStaticParams() {
  const team = await getTeam();
  return team.map((member) => ({ slug: member.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const team = await getTeam();
  const member = team.find((item) => item.slug === slug);
  if (!member) return { title: 'Not found' };

  return {
    title: member.name,
    description: `${member.name}, ${member.role} at Metaxia Solutions.`,
    alternates: { canonical: `/team/${member.slug}` },
    openGraph: {
      title: member.name,
      description: `${member.name}, ${member.role} at Metaxia Solutions.`,
    },
  };
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

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Team', item: `${site.url}/team` },
      { '@type': 'ListItem', position: 3, name: member.name, item: `${site.url}/team/${member.slug}` },
    ],
  };

  return (
    <main>
      <JsonLd data={breadcrumbJsonLd} />
      <section className="relative overflow-hidden bg-ink text-white">
        <Container className="flex flex-col items-start gap-6 pt-36 pb-20 lg:pt-44 lg:pb-24">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-soft font-display text-2xl text-accent">
            {initials(member.name)}
          </span>
          <div>
            <h1 className="font-display text-4xl leading-[1.1] tracking-[-0.01em] sm:text-5xl">
              {member.name}
            </h1>
            <p className="mt-3 text-lg text-white/60">{member.role}</p>
          </div>
        </Container>
      </section>

      <section className="bg-ink py-24 lg:py-28">
        <Container>
          <div className="max-w-3xl space-y-5">
            {bioParagraphs.map((paragraph, index) => (
              <p key={index} className="text-base leading-relaxed text-fg-soft">
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
