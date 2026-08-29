import { Container } from '@/components/container';
import { Reveal } from '@/components/motion/reveal';
import { SplitWords } from '@/components/motion/split-words';
import { Starfield } from '@/components/motion/starfield';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  lede?: string;
}

/**
 * Inner-page opener: starfield + aurora + dot field behind a word-revealed
 * serif title, with a copper rule drawing in under the lede. Every page that
 * uses PageHero inherits the full ambient treatment.
 */
export function PageHero({ eyebrow, title, lede }: PageHeroProps) {
  return (
    <section className="grain relative overflow-clip border-b border-line bg-ink">
      <Starfield />
      <div aria-hidden="true" className="bg-dots absolute inset-0" />
      <div aria-hidden="true" className="aurora aurora--a" />
      <div
        aria-hidden="true"
        className="absolute -top-32 right-[-12%] h-[26rem] w-[26rem] rounded-full bg-accent/[0.08] blur-[110px]"
      />
      <Container className="relative pb-16 pt-32 lg:pb-24 lg:pt-48">
        <Reveal>
          <p className="reveal-fade flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
            <span className="inline-block h-px w-6 bg-accent" aria-hidden="true" />
            {eyebrow}
          </p>

          <h1 className="mt-7 max-w-4xl font-display text-[clamp(2.1rem,6vw,4.75rem)] leading-[1.02] tracking-[-0.01em] text-fg">
            <SplitWords text={title} from={0.08} />
          </h1>

          {lede ? (
            <p
              className="reveal-rise mt-7 max-w-xl text-lg leading-relaxed text-fg-soft"
              style={{ ['--reveal-delay' as string]: '0.35s' }}
            >
              {lede}
            </p>
          ) : null}

          <span
            aria-hidden="true"
            className="reveal-draw-x mt-10 block h-px w-40 bg-gradient-to-r from-accent to-transparent"
            style={{ ['--reveal-delay' as string]: '0.5s' }}
          />
        </Reveal>
      </Container>
    </section>
  );
}
