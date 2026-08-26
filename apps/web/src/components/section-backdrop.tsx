interface SectionBackdropProps {
  /** Oversized ghost numeral (or glyph) watermarking the section. */
  mark?: string;
  /** Where the ambient copper glow field sits. */
  glow?: 'left' | 'right' | 'center';
}

const glowPosition = {
  left: 'left-[-10%] top-1/3',
  right: 'right-[-10%] top-1/4',
  center: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
} as const;

/**
 * Quiet ambient backdrop for landing sections: a barely-there serif numeral
 * watermark and one soft copper light field. Decorative only — the parent
 * section must be `relative overflow-hidden`.
 */
export function SectionBackdrop({ mark, glow = 'right' }: SectionBackdropProps) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
      <div
        className={`absolute h-[28rem] w-[28rem] rounded-full bg-accent/[0.05] blur-[130px] ${glowPosition[glow]}`}
      />
      {mark ? (
        <span className="absolute -top-8 right-2 font-display text-[14rem] leading-none text-fg/[0.03] lg:-top-14 lg:text-[24rem]">
          {mark}
        </span>
      ) : null}
    </div>
  );
}
