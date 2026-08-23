import { Container } from '@/components/container';
import { Button } from '@/components/button';

interface HeroProps {
  stats: { value: number; label: string }[];
}

export function Hero({ stats }: HeroProps) {
  return (
    <section className="grid-signature relative overflow-hidden bg-ink text-white">
      <Container className="pt-40 pb-24 lg:pt-48 lg:pb-32">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          <span className="h-2 w-2 rotate-45 bg-accent" aria-hidden="true" />
          The Next Gen
        </div>

        <h1 className="mt-6 max-w-4xl font-display text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          We build technology that
          <br />
          moves enterprises forward.
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/60">
          Metaxia partners with ambitious teams to design, ship, and scale the systems their
          business runs on — from cloud infrastructure to the software their customers touch
          every day.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button href="/contact" variant="primary">
            Let&rsquo;s Talk
          </Button>
          <Button href="/services" variant="ghost">
            Our services
          </Button>
        </div>

        {stats.length > 0 ? (
          <div className="mt-20 flex flex-wrap gap-x-12 gap-y-6 border-t border-white/10 pt-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="flex items-center gap-3">
                {index > 0 ? <span className="h-1 w-1 rotate-45 bg-white/20" aria-hidden="true" /> : null}
                <span className="font-display text-2xl font-medium tabular-nums text-white">
                  {String(stat.value).padStart(2, '0')}
                </span>
                <span className="text-sm text-white/50">{stat.label}</span>
              </div>
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
