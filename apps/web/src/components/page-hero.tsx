import { Container } from '@/components/container';
import { Reveal } from '@/components/motion/reveal';
import { SplitWords } from '@/components/motion/split-words';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  lede?: string;
}

export function PageHero({ eyebrow, title, lede }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-ink">
      <div
        aria-hidden="true"
        className="absolute -top-32 right-[-12%] h-[26rem] w-[26rem] rounded-full bg-accent/[0.1] blur-[110px]"
      />
      <Container className="relative pb-20 pt-40 lg:pb-24 lg:pt-48">
        <Reveal>
          <p className="reveal-fade flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
            <span className="inline-block h-px w-6 bg-accent" aria-hidden="true" />
            {eyebrow}
          </p>

          <h1 className="mt-7 max-w-4xl font-display text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.02] tracking-[-0.02em] text-fg">
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
        </Reveal>
      </Container>
    </section>
  );
}
