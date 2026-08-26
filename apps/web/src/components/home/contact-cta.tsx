import { Container } from '@/components/container';
import { Button } from '@/components/button';
import { Reveal } from '@/components/motion/reveal';
import { SplitWords } from '@/components/motion/split-words';
import { Starfield } from '@/components/motion/starfield';

/**
 * The closing move: the starfield returns, an oversized serif invitation
 * sits centered in it, and one magnetic action.
 */
export function ContactCta() {
  return (
    <section className="grain relative overflow-hidden border-t border-line bg-ink py-36 lg:py-48">
      <Starfield />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[30rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.08] blur-[140px]"
      />
      <Container className="relative">
        <Reveal className="flex flex-col items-center gap-10 text-center">
          <p className="reveal-fade font-mono text-[11px] font-medium uppercase tracking-[0.32em] text-fg-soft">
            06 — Next step
          </p>
          <h2 className="max-w-4xl font-display text-[clamp(2.75rem,7vw,6rem)] leading-[1.02] tracking-[-0.01em] text-fg">
            <SplitWords text="Tell us what your business" />
            <br />
            <em className="text-accent-strong">
              <SplitWords text="needs to run on." from={0.25} />
            </em>
          </h2>
          <div
            className="reveal-rise flex flex-wrap items-center justify-center gap-6"
            style={{ ['--reveal-delay' as string]: '0.4s' }}
          >
            <Button href="/contact" size="lg" magnetic>
              Let&rsquo;s Talk
            </Button>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-fg-soft">
              Replies within one business day
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
