import { Container } from '@/components/container';

const clients = [
  'Northwind Labs',
  'Helios Bank',
  'Vantage Health',
  'Cascade Freight',
  'Arcline Retail',
  'Ironclad Insurance',
];

export function LogoStrip() {
  return (
    <section className="border-y border-ink/10 bg-surface-alt py-14">
      <Container>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
          Trusted by teams shipping at enterprise scale
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {clients.map((name) => (
            <svg
              key={name}
              viewBox={`0 0 ${16 + name.length * 9} 24`}
              role="img"
              aria-label={name}
              className="h-5 w-auto text-ink/35 grayscale transition-colors duration-150 hover:text-ink"
            >
              <rect x="0" y="8" width="8" height="8" transform="rotate(45 4 12)" fill="currentColor" />
              <text
                x="16"
                y="18"
                fontFamily="var(--font-display)"
                fontSize="16"
                fontWeight="500"
                letterSpacing="0.01em"
                fill="currentColor"
              >
                {name}
              </text>
            </svg>
          ))}
        </div>
      </Container>
    </section>
  );
}
