interface SectionBackdropProps {
  /** Where the ambient copper glow field sits. */
  glow?: 'left' | 'right' | 'center';
  /** The section's 3D object. Full-bleed, decorative, pointer-events-none. */
  variant?: 'floor' | 'ceiling' | 'cube' | 'ring' | 'sweep' | 'orbs' | 'plain';
  /** Which side the 3D object leans toward (cube/ring/sweep). */
  side?: 'left' | 'right';
}

const glowPosition = {
  left: 'left-[-10%] top-1/3',
  right: 'right-[-10%] top-1/4',
  center: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
} as const;

const CUBE_FACES = [
  'rotateY(0deg) translateZ(4.5rem)',
  'rotateY(90deg) translateZ(4.5rem)',
  'rotateY(180deg) translateZ(4.5rem)',
  'rotateY(270deg) translateZ(4.5rem)',
  'rotateX(90deg) translateZ(4.5rem)',
  'rotateX(-90deg) translateZ(4.5rem)',
];

/**
 * Full-bleed ambient backdrop for landing sections: a dot field over the
 * whole background, one copper light, and one slowly-moving 3D object per
 * section (grid plane, wireframe cube, ringed planet, radar sweep, or lit
 * spheres). Purely decorative — never intercepts pointers, never couples to
 * content animation. Parent must be `relative overflow-clip` (clip, not
 * hidden, so sticky children keep working).
 */
export function SectionBackdrop({ glow = 'right', variant = 'orbs', side = 'right' }: SectionBackdropProps) {
  const sideClass = side === 'right' ? 'right-[6%]' : 'left-[5%]';

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
      {/* Whole-section dot field */}
      <div className="bg-dots absolute inset-0" />

      {/* Aurora — two light fields traversing the entire section, so the
          full background moves, not just one corner. The 'plain' variant
          (marquee) keeps its original quiet dots + glow look. */}
      {variant !== 'plain' ? (
        <>
          <div className="aurora aurora--a" />
          <div className="aurora aurora--b" />
        </>
      ) : null}

      {/* Ambient light */}
      <div
        className={`absolute h-[28rem] w-[28rem] rounded-full bg-accent/[0.06] blur-[130px] ${glowPosition[glow]}`}
      />

      {/* 3D object */}
      {variant === 'floor' ? <div className="plane-grid plane-grid--floor" /> : null}
      {variant === 'ceiling' ? <div className="plane-grid plane-grid--ceiling" /> : null}

      {variant === 'cube' ? (
        <div className={`cube-scene drift-slow absolute top-[16%] hidden h-36 w-36 lg:block ${sideClass}`}>
          <div className="cube">
            {CUBE_FACES.map((transform) => (
              <div key={transform} className="cube-face" style={{ transform }} />
            ))}
          </div>
        </div>
      ) : null}

      {variant === 'ring' ? (
        <div className={`drift-slow absolute top-[18%] hidden h-40 w-40 lg:block ${sideClass}`}>
          <div className="orb-3d absolute inset-0" />
          <div className="planet-ring" />
        </div>
      ) : null}

      {variant === 'sweep' ? (
        <div
          className={`radar-sweep absolute top-1/2 hidden h-[36rem] w-[36rem] -translate-y-1/2 lg:block ${
            side === 'right' ? 'right-[-8%]' : 'left-[-8%]'
          }`}
        />
      ) : null}

      {variant === 'orbs' ? (
        <>
          <div className="orb-3d drift-slow absolute right-[6%] top-[14%] h-40 w-40 lg:h-56 lg:w-56" />
          <div className="orb-3d drift absolute bottom-[10%] left-[4%] h-24 w-24 opacity-70 lg:h-36 lg:w-36 [animation-delay:-5s]" />
        </>
      ) : null}
    </div>
  );
}
