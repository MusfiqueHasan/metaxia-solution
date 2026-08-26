const clients = [
  'Northwind Labs',
  'Helios Bank',
  'Vantage Health',
  'Cascade Freight',
  'Arcline Retail',
  'Ironclad Insurance',
];

function Wordmark({ name }: { name: string }) {
  return (
    <span className="flex shrink-0 items-center gap-3 px-10">
      <span className="h-1.5 w-1.5 rotate-45 bg-fg-soft/40" aria-hidden="true" />
      <span className="whitespace-nowrap font-display text-lg font-medium tracking-tight text-fg-soft/50 transition-colors duration-300 hover:text-fg">
        {name}
      </span>
    </span>
  );
}

export function LogoStrip() {
  return (
    <section className="border-y border-line bg-ink py-10" aria-label="Clients">
      <p className="mb-8 text-center font-mono text-[11px] uppercase tracking-[0.28em] text-fg-soft/70">
        Trusted by teams shipping at enterprise scale
      </p>
      <div className="marquee overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex" aria-hidden={copy === 1}>
              {clients.map((name) => (
                <Wordmark key={`${copy}-${name}`} name={name} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
