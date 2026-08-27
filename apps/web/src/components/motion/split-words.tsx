import { Fragment, type ReactNode } from 'react';

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
 *
 * The separating space lives BETWEEN the inline-block masks, never inside
 * them — trailing whitespace inside an inline-block collapses, which welds
 * the words together.
 */
export function SplitWords({ text, step = 0.045, from = 0 }: SplitWordsProps): ReactNode {
  const words = text.split(' ');
  return words.map((word, index) => (
    <Fragment key={`${word}-${index}`}>
      <span className="word-mask">
        <span style={{ ['--reveal-delay' as string]: `${(from + index * step).toFixed(3)}s` }}>
          {word}
        </span>
      </span>
      {index < words.length - 1 ? ' ' : null}
    </Fragment>
  ));
}
