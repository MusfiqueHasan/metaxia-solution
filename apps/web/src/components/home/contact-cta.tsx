import { Container } from '@/components/container';
import { Button } from '@/components/button';
import { Reveal } from '@/components/motion/reveal';
import { SplitWords } from '@/components/motion/split-words';

/**
 * The closing move: the beacon's blueprint grid at full strength, an
 * oversized invitation, and one magnetic action.
 */
export function ContactCta() {
  return (
    <section className="blueprint relative overflow-hidden border-t border-line bg-ink py-32 lg:py-44">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[30rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.09] blur-[140px]"
      />
      <Container className="relative">
        <Reveal className="flex flex-col items-start gap-10">
          <p className="reveal-fade font-mono text-[11px] font-medium uppercase tracking-[0.32em] text-accent">
            Next step
          </p>
          <h2 className="max-w-4xl font-display text-[clamp(2.5rem,6.5vw,5.5rem)] font-medium leading-[1.02] tracking-[-0.02em] text-fg">
            <SplitWords text="Tell us what your business needs to run on." />
          </h2>
          <div
            className="reveal-rise flex flex-wrap items-center gap-6"
            style={{ ['--reveal-delay' as string]: '0.35s' }}
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
