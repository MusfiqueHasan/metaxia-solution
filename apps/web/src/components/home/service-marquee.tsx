import Link from 'next/link';
import { SectionBackdrop } from '@/components/section-backdrop';

/** The working agreement, on loop — how engagements run, not what we sell
 *  (the services already own section 01). */
const PRINCIPLES = [
  'Code you own, always',
  'Ship on green, weekly',
  'Fixed scope, honest quotes',
  'Replies within a day',
  'Zero-downtime launches',
  'Two founders on every call',
  'Docs before handoff',
  'Built in Dhaka, shipped worldwide',
];

/**
 * The ethos strip: an infinite marquee of working principles right under
 * the hero. Two copies of the list scroll -50% for a seamless cycle;
 * hover or keyboard focus pauses the track.
 */
export function EthosMarquee() {
  return (
    <section
      className="relative overflow-clip border-y border-line bg-ink py-10"
      aria-label="How we work"
    >
      <SectionBackdrop glow="center" variant="plain" />
      {/* Small lit sphere sitting quietly at the strip's right side. */}
      <div
        aria-hidden="true"
        className="orb-3d drift-slow pointer-events-none absolute right-[4%] top-1/2 h-24 w-24 -translate-y-1/2 lg:h-32 lg:w-32"
      />
      <p className="mb-8 text-center font-mono text-[11px] uppercase tracking-[0.28em] text-fg-soft/70">
        The working agreement · every engagement
      </p>
      <div className="marquee overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex" aria-hidden={copy === 1}>
              {PRINCIPLES.map((principle) => (
                <Link
                  key={`${copy}-${principle}`}
                  href="/about"
                  tabIndex={copy === 1 ? -1 : 0}
                  className="group flex shrink-0 items-center gap-3 px-7 sm:px-10"
                >
                  <span
                    className="h-1.5 w-1.5 rotate-45 bg-accent/50 transition-colors duration-300 group-hover:bg-accent"
                    aria-hidden="true"
                  />
                  <span className="whitespace-nowrap font-display text-xl tracking-[-0.01em] text-fg-soft/60 transition-colors duration-300 group-hover:text-fg sm:text-2xl">
                    {principle}
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
