import type { Metadata } from 'next';
import Link from 'next/link';
import { getTeam } from '@/lib/api';
import { TEAM_PHOTOS, TEAM_PHOTO_FRAME } from '@/lib/team-meta';
import { initials } from '@/lib/format';
import { PageHero } from '@/components/page-hero';
import { Container } from '@/components/container';
import { SectionBackdrop } from '@/components/section-backdrop';
import { Reveal } from '@/components/motion/reveal';

export const metadata: Metadata = {
  title: 'Team',
  description: 'The founders behind Metaxia Solutions.',
  alternates: { canonical: '/team' },
  openGraph: {
    title: 'Team',
    description: 'The founders behind Metaxia Solutions.',
  },
};

const SOCIALS = [
  {
    key: 'x',
    label: 'X',
    path: 'M4 4l7.2 9.3L4.4 20h2.1l5.6-5.6L16.8 20H20l-7.5-9.7L18.9 4h-2.1l-5.1 5.1L7.2 4H4z',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    path: 'M13.5 20v-6.5H16l.5-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.7V20h2.8z',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    path: 'M6.5 8.8H3.7V20h2.8V8.8zM5.1 7.6a1.66 1.66 0 1 0 0-3.3 1.66 1.66 0 0 0 0 3.3zM20.3 13.9c0-3.1-1.7-4.6-3.9-4.6-1.8 0-2.6 1-3 1.7V8.8h-2.8V20h2.8v-5.9c0-1.6.8-2.5 2-2.5s1.9.9 1.9 2.5V20h3v-6.1z',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    path: 'M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6zm0 6.2a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8zM16.4 4H7.6A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4zm2.2 12.4a2.2 2.2 0 0 1-2.2 2.2H7.6a2.2 2.2 0 0 1-2.2-2.2V7.6a2.2 2.2 0 0 1 2.2-2.2h8.8a2.2 2.2 0 0 1 2.2 2.2v8.8zM17 6.6a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8z',
  },
];

export default async function TeamPage() {
  const team = await getTeam();
  const founders = team.filter((member) => /founder/i.test(member.role));
  const crew = team.filter((member) => !/founder/i.test(member.role));

  return (
    <main className="page-wide">
      <PageHero
        eyebrow="Team"
        title="The people behind every engagement."
        lede="Metaxia stays deliberately small: the founders who scope your project are the ones who build and run it — with a tight crew behind them."
      />

      <section className="grain relative overflow-clip bg-ink py-14 md:py-24 lg:py-28">
        <SectionBackdrop glow="center" variant="orbs" />
        <Container>
          {team.length > 0 ? (
            <Reveal className="mx-auto grid max-w-4xl gap-16 sm:grid-cols-2 lg:gap-24">
              {founders.map((member, index) => {
                const photo = member.photoUrl ?? TEAM_PHOTOS[member.slug];
                const frame = TEAM_PHOTO_FRAME[member.slug];
                return (
                  <div
                    key={member.slug}
                    className="reveal-rise group flex flex-col items-center text-center"
                    style={{ ['--reveal-delay' as string]: `${index * 0.12}s` }}
                  >
                    {/* Portrait: grayscale at rest; hover brings color and the
                        ornaments — dot grids and a copper disc — like a
                        spotlight landing on the person. */}
                    <Link
                      href={`/team/${member.slug}`}
                      data-cursor="Meet"
                      className="relative block w-full max-w-[22rem]"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute -right-4 top-6 h-14 w-24 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        style={{
                          backgroundImage:
                            'radial-gradient(rgba(242,241,236,0.5) 1.5px, transparent 2px)',
                          backgroundSize: '14px 14px',
                        }}
                      />
                      <span
                        aria-hidden="true"
                        className="absolute -left-5 bottom-12 h-16 w-14 opacity-0 transition-opacity duration-500 [transition-delay:80ms] group-hover:opacity-100"
                        style={{
                          backgroundImage:
                            'radial-gradient(rgba(242,241,236,0.4) 1.5px, transparent 2px)',
                          backgroundSize: '14px 14px',
                        }}
                      />
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-1 -right-1 h-20 w-20 scale-50 rounded-full bg-accent opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100 lg:h-24 lg:w-24"
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
                            className="h-full w-full object-cover grayscale transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grayscale-0"
                            style={frame?.img}
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center bg-accent-soft font-display text-5xl text-accent">
                            {initials(member.name)}
                          </span>
                        )}
                      </span>
                    </Link>

                    <h2 className="mt-8 font-display text-3xl tracking-[-0.01em] text-fg">
                      <Link
                        href={`/team/${member.slug}`}
                        className="transition-colors hover:text-accent-strong"
                      >
                        {member.name}
                      </Link>
                    </h2>
                    <p className="mt-2 text-sm text-fg-soft">{member.role}</p>

                    <div className="mt-5 flex items-center gap-3">
                      {SOCIALS.map((social) => (
                        <a
                          key={social.key}
                          href={
                            social.key === 'linkedin' && member.linkedinUrl
                              ? member.linkedinUrl
                              : '#'
                          }
                          aria-label={`${member.name} on ${social.label}`}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-fg-soft transition-colors duration-300 hover:border-accent hover:text-accent"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d={social.path} />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
            </Reveal>
          ) : (
            <p className="text-sm text-fg-soft">Team profiles are temporarily unavailable.</p>
          )}

          {/* The crew: smaller portraits so the founders keep the spotlight */}
          {crew.length > 0 ? (
            <Reveal className="mt-14 lg:mt-16">
              <p className="reveal-fade flex items-center justify-center gap-3 text-center font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-fg-soft">
                <span className="inline-block h-px w-6 self-center bg-line-strong" aria-hidden="true" />
                And the crew behind them
                <span className="inline-block h-px w-6 self-center bg-line-strong" aria-hidden="true" />
              </p>

              <div className="mx-auto mt-12 grid max-w-4xl gap-12 sm:grid-cols-3 lg:gap-16">
                {crew.map((member, index) => {
                  const photo = member.photoUrl ?? TEAM_PHOTOS[member.slug];
                  const frame = TEAM_PHOTO_FRAME[member.slug];
                  return (
                    <div
                      key={member.slug}
                      className="reveal-rise group flex flex-col items-center text-center"
                      style={{ ['--reveal-delay' as string]: `${0.1 + index * 0.1}s` }}
                    >
                      <span className="relative block w-full max-w-[17rem]">
                        <span
                          aria-hidden="true"
                          className="absolute -right-3 top-4 h-10 w-16 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                          style={{
                            backgroundImage:
                              'radial-gradient(rgba(242,241,236,0.5) 1.5px, transparent 2px)',
                            backgroundSize: '14px 14px',
                          }}
                        />
                        <span
                          aria-hidden="true"
                          className="absolute -left-4 bottom-8 h-12 w-10 opacity-0 transition-opacity duration-500 [transition-delay:80ms] group-hover:opacity-100"
                          style={{
                            backgroundImage:
                              'radial-gradient(rgba(242,241,236,0.4) 1.5px, transparent 2px)',
                            backgroundSize: '14px 14px',
                          }}
                        />
                        <span
                          aria-hidden="true"
                          className="absolute -bottom-1 -right-1 h-14 w-14 scale-50 rounded-full bg-accent opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100"
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
                              className="h-full w-full object-cover grayscale transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grayscale-0"
                              style={frame?.img}
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center bg-accent-soft text-accent">
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="h-14 w-14"
                                aria-hidden="true"
                              >
                                <circle cx="12" cy="9" r="3.6" stroke="currentColor" strokeWidth="1.4" />
                                <path
                                  d="M5 20c1.2-3.4 3.8-5 7-5s5.8 1.6 7 5"
                                  stroke="currentColor"
                                  strokeWidth="1.4"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </span>
                          )}
                        </span>
                      </span>

                      <h3 className="mt-6 font-display text-xl tracking-[-0.01em] text-fg">
                        {member.name}
                      </h3>
                      <p className="mt-1.5 text-[13px] text-fg-soft">{member.role}</p>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          ) : null}
        </Container>
      </section>
    </main>
  );
}
