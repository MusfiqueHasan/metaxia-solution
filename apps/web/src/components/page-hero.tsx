import { Container } from '@/components/container';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  lede?: string;
}

export function PageHero({ eyebrow, title, lede }: PageHeroProps) {
  return (
    <section className="grid-signature relative overflow-hidden bg-ink text-white">
      <Container className="pt-24 pb-20 lg:pt-28 lg:pb-24">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          <span className="h-2 w-2 rotate-45 bg-accent" aria-hidden="true" />
          {eyebrow}
        </div>

        <h1 className="mt-6 max-w-3xl font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>

        {lede ? (
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">{lede}</p>
        ) : null}
      </Container>
    </section>
  );
}
