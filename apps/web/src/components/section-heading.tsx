import { Reveal } from '@/components/motion/reveal';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  lede?: string;
  align?: 'left' | 'center';
  /** Section number for the landing narrative, e.g. "02". */
  index?: string;
}

export function SectionHeading({ eyebrow, title, lede, align = 'left', index }: SectionHeadingProps) {
  return (
    <Reveal className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      <div
        className={`reveal-fade flex items-baseline gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-fg-soft ${
          align === 'center' ? 'justify-center' : ''
        }`}
      >
        {index ? <span className="text-accent">{index}</span> : null}
        <span className="inline-block h-px w-6 self-center bg-line-strong" aria-hidden="true" />
        {eyebrow}
      </div>
      <h2 className="reveal-rise mt-5 font-display text-4xl leading-[1.05] tracking-[-0.01em] text-fg sm:text-5xl">
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
