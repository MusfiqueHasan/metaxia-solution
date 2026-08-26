interface SectionBackdropProps {
  /** Oversized ghost numeral (or glyph) watermarking the section. */
  mark?: string;
  /** Where the ambient copper glow field sits. */
  glow?: 'left' | 'right' | 'center';
  /**
   * 3D layer: a perspective grid plane at the floor or ceiling, or floating
   * lit spheres. All are full-bleed, decorative, pointer-events-none.
   */
  variant?: 'floor' | 'ceiling' | 'orbs';
}

const glowPosition = {
  left: 'left-[-10%] top-1/3',
  right: 'right-[-10%] top-1/4',
  center: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
} as const;

/**
 * Full-bleed ambient backdrop for landing sections: a dot field covering the
 * whole background, one copper light, a perspective 3D layer, and a ghost
 * serif numeral. Purely decorative — it never intercepts pointers and adds
 * no scroll/animation coupling. Parent must be `relative overflow-clip`
 * (clip, not hidden, so sticky children keep working).
 */
export function SectionBackdrop({ mark, glow = 'right', variant = 'orbs' }: SectionBackdropProps) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
      {/* Whole-section dot field */}
      <div className="bg-dots absolute inset-0" />

      {/* Ambient light */}
      <div
        className={`absolute h-[28rem] w-[28rem] rounded-full bg-accent/[0.06] blur-[130px] ${glowPosition[glow]}`}
      />

      {/* 3D layer */}
      {variant === 'floor' ? <div className="plane-grid plane-grid--floor" /> : null}
      {variant === 'ceiling' ? <div className="plane-grid plane-grid--ceiling" /> : null}
      {variant === 'orbs' ? (
        <>
          <div className="orb-3d drift-slow absolute right-[6%] top-[14%] h-40 w-40 lg:h-56 lg:w-56" />
          <div className="orb-3d drift absolute bottom-[10%] left-[4%] h-24 w-24 opacity-70 lg:h-36 lg:w-36 [animation-delay:-5s]" />
        </>
      ) : null}

      {/* Ghost numeral */}
      {mark ? (
        <span className="absolute -top-8 right-2 font-display text-[14rem] leading-none text-fg/[0.03] lg:-top-14 lg:text-[24rem]">
          {mark}
        </span>
      ) : null}
    </div>
  );
}
