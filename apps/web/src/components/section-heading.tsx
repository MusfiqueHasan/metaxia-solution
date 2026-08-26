import { Reveal } from '@/components/motion/reveal';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  lede?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ eyebrow, title, lede, align = 'left' }: SectionHeadingProps) {
  return (
    <Reveal className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      <div
        className={`reveal-fade flex items-baseline gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-accent ${
          align === 'center' ? 'justify-center' : ''
        }`}
      >
        <span className="inline-block h-px w-6 self-center bg-accent" aria-hidden="true" />
        {eyebrow}
      </div>
      <h2 className="reveal-rise mt-5 font-display text-4xl font-medium leading-[1.04] tracking-tight text-fg sm:text-5xl">
        {title}
      </h2>
      {lede ? (
        <p
          className="reveal-rise mt-5 text-base leading-relaxed text-fg-soft"
          style={{ ['--reveal-delay' as string]: '0.12s' }}
        >
          {lede}
        </p>
      ) : null}
    </Reveal>
  );
}
