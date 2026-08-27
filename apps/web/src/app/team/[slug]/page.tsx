import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTeam, getServices } from '@/lib/api';
import { initials } from '@/lib/format';
import { TEAM_PHOTOS, TEAM_PHOTO_FRAME, TEAM_PROFILE, SOCIAL_ICONS } from '@/lib/team-meta';
import { site } from '@/lib/site';
import { Container } from '@/components/container';
import { ContactForm } from '@/components/contact-form';
import { JsonLd } from '@/components/json-ld';
import { Starfield } from '@/components/motion/starfield';
import { SplitWords } from '@/components/motion/split-words';
import { Reveal } from '@/components/motion/reveal';

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

function ProfileSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative border-t border-line">
      <Container className="py-14 lg:py-20">
        <Reveal>
          <div className="mx-auto max-w-3xl">
            <p className="reveal-fade flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-accent">
              <span className="inline-block h-px w-6 bg-accent" aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 className="reveal-rise mt-4 font-display text-3xl tracking-[-0.01em] text-fg sm:text-4xl">
              {title}
            </h2>
            <div className="reveal-rise mt-8" style={{ ['--reveal-delay' as string]: '0.15s' }}>
              {children}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [team, services] = await Promise.all([getTeam(), getServices()]);
  const member = team.find((item) => item.slug === slug);
  if (!member) notFound();

  const profile = TEAM_PROFILE[member.slug];
  const photo = TEAM_PHOTOS[member.slug];
  const frame = TEAM_PHOTO_FRAME[member.slug];
  const bioParagraphs = member.bio.split(/\n\n+/);
  const relatedServices = services.slice(0, 3);

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
    <main className="page-wide grain relative overflow-hidden bg-ink">
      <Starfield />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Header: name + role on the left, the portrait large on the right,
          overlapping the section edge like a badge pinned over the fold. */}
      <section className="relative border-b border-line lg:overflow-visible">
        <Container className="pb-16 pt-36 lg:pb-0 lg:pt-44">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_auto]">
            <Reveal className="text-center lg:text-left">
              <Link
                href="/team"
                className="reveal-fade inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-fg-soft transition-colors hover:text-fg"
              >
                <span aria-hidden="true">←</span> The team
              </Link>
              <h1 className="mt-8 font-display text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02] tracking-[-0.01em] text-fg">
                <SplitWords text={member.name} from={0.1} />
              </h1>
              <p
                className="reveal-rise mt-4 text-lg text-accent"
                style={{ ['--reveal-delay' as string]: '0.3s' }}
              >
                {member.role}
              </p>
            </Reveal>

            <Reveal>
              <div
                className="reveal-scale relative mx-auto w-[16rem] sm:w-[20rem] lg:w-[24rem] lg:translate-y-16"
                style={{ ['--reveal-delay' as string]: '0.25s' }}
              >
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 -right-1 h-16 w-16 rounded-full bg-accent lg:h-20 lg:w-20"
                />
                <span
                  className="relative block aspect-square overflow-hidden rounded-full border border-line"
                  style={frame?.circle}
                >
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo}
                      alt={member.name}
                      className="h-full w-full object-cover"
                      style={frame?.img}
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-accent-soft font-display text-5xl text-accent">
                      {initials(member.name)}
                    </span>
                  )}
                </span>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Biography + experience timeline */}
      <div className="lg:pt-16" />
      <ProfileSection eyebrow="Biography" title={`About ${member.name.split(' ')[0]}`}>
        <div className="space-y-5">
          {bioParagraphs.map((paragraph, index) => (
            <p key={index} className="text-[1.0625rem] leading-[1.85] text-fg-soft">
              {paragraph}
            </p>
          ))}
        </div>
        {profile ? (
          <ol className="mt-10 border-t border-line">
            {profile.experience.map((item) => (
              <li
                key={item.role + item.period}
                className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line py-5"
              >
                <span>
                  <span className="font-display text-xl tracking-[-0.01em] text-fg">{item.role}</span>
                  <span className="ml-3 text-sm text-fg-soft">{item.org}</span>
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-soft/70">
                  {item.period}
                </span>
              </li>
            ))}
          </ol>
        ) : null}
      </ProfileSection>

      {/* Skills */}
      {profile ? (
        <ProfileSection eyebrow="Skills" title="Where the depth is">
          <dl className="space-y-8">
            {profile.skills.map((skill, index) => (
              <div key={skill.label}>
                <dt className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-lg tracking-[-0.01em] text-fg">{skill.label}</span>
                  <span className="font-mono text-sm tabular-nums text-fg-soft">
                    {skill.value}
                    <span className="text-fg-soft/60">/100</span>
                  </span>
                </dt>
                <dd className="mt-3">
                  <div
                    role="progressbar"
                    aria-valuenow={skill.value}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={skill.label}
                    className="h-px w-full bg-line-strong"
                  >
                    <div
                      className="meter-fill h-px bg-accent shadow-[0_0_12px_0_var(--color-accent)]"
                      style={{
                        ['--meter-value' as string]: skill.value / 100,
                        ['--reveal-delay' as string]: `${0.2 + index * 0.1}s`,
                      }}
                    />
                  </div>
                </dd>
              </div>
            ))}
          </dl>
        </ProfileSection>
      ) : null}

      {/* Services this person leads */}
      {relatedServices.length > 0 ? (
        <ProfileSection eyebrow="Practice" title="Services they lead">
          <div className="flex flex-wrap gap-3">
            {relatedServices.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="rounded-full border border-line px-5 py-2.5 text-sm text-fg-soft transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                {service.title}
              </Link>
            ))}
            <Link
              href="/case-studies"
              className="rounded-full border border-accent/50 px-5 py-2.5 text-sm text-accent transition-colors duration-300 hover:bg-accent hover:text-white"
            >
              See the shipped work →
            </Link>
          </div>
        </ProfileSection>
      ) : null}

      {/* In their words + socials */}
      {profile ? (
        <section className="relative border-t border-line">
          <Container className="py-16 text-center lg:py-20">
            <Reveal className="mx-auto max-w-3xl">
              <span aria-hidden="true" className="reveal-fade font-display text-6xl leading-none text-accent">
                &ldquo;
              </span>
              <blockquote className="reveal-rise mt-2 font-display text-2xl leading-snug tracking-[-0.01em] text-fg sm:text-3xl">
                {profile.quote}
              </blockquote>
              <p className="reveal-fade mt-6 font-mono text-[11px] uppercase tracking-[0.24em] text-fg-soft">
                — {member.name}
              </p>

              <div
                className="reveal-rise mt-8 flex items-center justify-center gap-3"
                style={{ ['--reveal-delay' as string]: '0.2s' }}
              >
                {SOCIAL_ICONS.map((social) => (
                  <a
                    key={social.key}
                    href={social.key === 'linkedin' && member.linkedinUrl ? member.linkedinUrl : '#'}
                    aria-label={`${member.name} on ${social.label}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-fg-soft transition-colors duration-300 hover:border-accent hover:text-accent"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </Reveal>
          </Container>
        </section>
      ) : null}

      {/* Direct line: the contact form, on-page like the reference */}
      <section className="relative border-t border-line">
        <Container className="py-16 lg:py-20">
          <Reveal className="mx-auto max-w-3xl">
            <p className="reveal-fade flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-accent">
              <span className="inline-block h-px w-6 bg-accent" aria-hidden="true" />
              Get in touch
            </p>
            <h2 className="reveal-rise mt-4 font-display text-3xl tracking-[-0.01em] text-fg sm:text-4xl">
              Start a conversation with {member.name.split(' ')[0]}
            </h2>
            <div className="reveal-rise mt-8" style={{ ['--reveal-delay' as string]: '0.15s' }}>
              <ContactForm />
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
