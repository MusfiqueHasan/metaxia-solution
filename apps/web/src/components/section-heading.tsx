interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  lede?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ eyebrow, title, lede, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      <div
        className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent ${
          align === 'center' ? 'justify-center' : ''
        }`}
      >
        <span className="h-2 w-2 rotate-45 bg-accent" aria-hidden="true" />
        {eyebrow}
      </div>
      <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {lede ? <p className="mt-4 text-base leading-relaxed text-ink-soft">{lede}</p> : null}
    </div>
  );
}
