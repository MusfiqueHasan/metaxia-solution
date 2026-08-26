import type { ReactNode } from 'react';

interface SplitWordsProps {
  text: string;
  /** Seconds between each word's entrance. */
  step?: number;
  /** Seconds before the first word enters. */
  from?: number;
}

/**
 * Splits a headline into per-word mask spans for the CSS reveal system.
 * Server component — pure markup; a wrapping <Reveal> triggers it.
 */
export function SplitWords({ text, step = 0.045, from = 0 }: SplitWordsProps): ReactNode {
  return text.split(' ').map((word, index) => (
    <span key={`${word}-${index}`} className="word-mask">
      <span style={{ ['--reveal-delay' as string]: `${(from + index * step).toFixed(3)}s` }}>
        {word}
      </span>{' '}
    </span>
  ));
}
