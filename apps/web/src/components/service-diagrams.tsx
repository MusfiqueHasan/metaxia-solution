/**
 * Animated line-art diagrams, one per service practice. Pure SVG + SMIL —
 * they run without JavaScript and inherit the theme via CSS variables.
 * Shared vocabulary: accent strokes on ink, breathing nodes, signals in
 * flight, one idea per picture.
 */

const STROKE = 'var(--color-accent)';
const INK = 'var(--color-ink)';

/** A friendly machine face: scanning brow, breathing eyes, talking mouth. */
function AiFace() {
  const bars = [0, 1, 2, 3, 4, 5, 6];
  return (
    <svg viewBox="0 0 320 290" className="h-full w-full" role="img" aria-label="AI assistant face">
      {/* antenna */}
      <line x1="160" y1="18" x2="160" y2="44" stroke={STROKE} strokeOpacity="0.5" strokeWidth="1.5" />
      <circle cx="160" cy="14" r="4" fill={STROKE}>
        <animate attributeName="fill-opacity" values="0.4;1;0.4" dur="2.4s" repeatCount="indefinite" />
      </circle>

      {/* side circuits */}
      {[
        { d: 'M70 130 H36 V96', cx: 36, cy: 96 },
        { d: 'M70 170 H24 V214', cx: 24, cy: 214 },
        { d: 'M250 130 H284 V96', cx: 284, cy: 96 },
        { d: 'M250 170 H296 V214', cx: 296, cy: 214 },
      ].map((trace, index) => (
        <g key={index}>
          <path d={trace.d} fill="none" stroke={STROKE} strokeOpacity="0.25" strokeWidth="1.2" />
          <circle cx={trace.cx} cy={trace.cy} r="3" fill={STROKE} fillOpacity="0.7">
            <animate
              attributeName="fill-opacity"
              values="0.25;0.9;0.25"
              dur="2.8s"
              begin={`${index * 0.6}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}

      {/* head */}
      <rect x="70" y="44" width="180" height="200" rx="44" fill={INK} stroke={STROKE} strokeOpacity="0.55" strokeWidth="1.5" />
      <rect x="84" y="58" width="152" height="172" rx="34" fill="none" stroke={STROKE} strokeOpacity="0.14" strokeWidth="1" />

      {/* scanning brow */}
      <rect x="96" y="86" width="34" height="2.5" rx="1.25" fill={STROKE} fillOpacity="0.7">
        <animate attributeName="x" values="96;190;96" dur="4.5s" repeatCount="indefinite" />
      </rect>

      {/* eyes */}
      {[118, 202].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="136" r="17" fill="none" stroke={STROKE} strokeOpacity="0.4" strokeWidth="1.2" />
          <circle cx={cx} cy="136" r="8" fill={STROKE} fillOpacity="0.85">
            <animate attributeName="r" values="8;9.5;8" dur="3.6s" repeatCount="indefinite" />
            <animate attributeName="fill-opacity" values="0.6;1;0.6" dur="3.6s" repeatCount="indefinite" />
          </circle>
          {/* blink */}
          <rect x={cx - 18} y="118" width="36" height="0" fill={INK}>
            <animate
              attributeName="height"
              values="0;0;36;0;0"
              keyTimes="0;0.46;0.5;0.54;1"
              dur="5.2s"
              repeatCount="indefinite"
            />
          </rect>
        </g>
      ))}

      {/* voice: equalizer mouth */}
      <g>
        {bars.map((bar) => {
          const x = 118 + bar * 13;
          const heights = ['6;18;9;22;6', '14;6;20;8;14', '9;22;7;16;9'][bar % 3];
          return (
            <rect key={bar} x={x} y="192" width="5" rx="2.5" height="10" fill={STROKE} fillOpacity="0.8">
              <animate attributeName="height" values={heights} dur="1.6s" begin={`${bar * 0.12}s`} repeatCount="indefinite" />
              <animate
                attributeName="y"
                values={heights
                  .split(';')
                  .map((h) => 200 - Number(h) / 2)
                  .join(';')}
                dur="1.6s"
                begin={`${bar * 0.12}s`}
                repeatCount="indefinite"
              />
            </rect>
          );
        })}
      </g>
    </svg>
  );
}

/** Cloud with three services beneath it, traffic flowing both ways. */
function CloudDiagram() {
  return (
    <svg viewBox="0 0 320 290" className="h-full w-full" role="img" aria-label="Cloud architecture diagram">
      <path
        d="M96 118a38 38 0 0 1 37-46 44 44 0 0 1 84 10 32 32 0 0 1-6 63H108a30 30 0 0 1-12-27z"
        fill={INK}
        stroke={STROKE}
        strokeOpacity="0.55"
        strokeWidth="1.5"
      />
      <circle cx="160" cy="104" r="3.5" fill={STROKE}>
        <animate attributeName="fill-opacity" values="0.4;1;0.4" dur="2.6s" repeatCount="indefinite" />
      </circle>

      {[70, 160, 250].map((x, index) => (
        <g key={x}>
          <path d={`M160 148 L${x} 196`} fill="none" stroke={STROKE} strokeOpacity="0.25" strokeWidth="1.2" strokeDasharray="3 5" />
          <circle r="2.6" fill={STROKE}>
            <animateMotion dur={`${2.2 + index * 0.5}s`} begin={`${index * 0.5}s`} repeatCount="indefinite" path={`M160 148 L${x} 196`} />
            <animate attributeName="opacity" values="0;1;0" dur={`${2.2 + index * 0.5}s`} begin={`${index * 0.5}s`} repeatCount="indefinite" />
          </circle>
          <rect x={x - 26} y="196" width="52" height="44" rx="10" fill={INK} stroke={STROKE} strokeOpacity="0.4" strokeWidth="1.2" />
          {[210, 220, 230].map((y) => (
            <line key={y} x1={x - 14} y1={y} x2={x + 14} y2={y} stroke={STROKE} strokeOpacity="0.3" strokeWidth="1.5" />
          ))}
          <circle cx={x + 16} cy="206" r="2" fill={STROKE}>
            <animate attributeName="fill-opacity" values="0.2;1;0.2" dur="1.8s" begin={`${index * 0.4}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </svg>
  );
}

/** Browser window with interface blocks assembling and a typing caret. */
function WebDiagram() {
  return (
    <svg viewBox="0 0 320 290" className="h-full w-full" role="img" aria-label="Web application diagram">
      <rect x="36" y="48" width="248" height="194" rx="16" fill={INK} stroke={STROKE} strokeOpacity="0.55" strokeWidth="1.5" />
      <line x1="36" y1="82" x2="284" y2="82" stroke={STROKE} strokeOpacity="0.25" strokeWidth="1" />
      {[56, 72, 88].map((cx, index) => (
        <circle key={cx} cx={cx} cy="65" r="4" fill={STROKE} fillOpacity="0.5">
          <animate attributeName="fill-opacity" values="0.3;0.9;0.3" dur="2.4s" begin={`${index * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <rect x="120" y="58" width="140" height="14" rx="7" fill="none" stroke={STROKE} strokeOpacity="0.3" strokeWidth="1" />

      {/* hero block */}
      <rect x="56" y="100" width="130" height="16" rx="4" fill={STROKE} fillOpacity="0.5">
        <animate attributeName="fill-opacity" values="0.3;0.6;0.3" dur="3.4s" repeatCount="indefinite" />
      </rect>
      <rect x="56" y="126" width="90" height="8" rx="4" fill={STROKE} fillOpacity="0.25" />
      {/* typing caret */}
      <rect x="152" y="124" width="2.5" height="12" fill={STROKE}>
        <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
      </rect>

      {/* cards */}
      {[0, 1, 2].map((card) => (
        <rect
          key={card}
          x={56 + card * 74}
          y="152"
          width="60"
          height="44"
          rx="8"
          fill="none"
          stroke={STROKE}
          strokeOpacity="0.35"
          strokeWidth="1.2"
        >
          <animate
            attributeName="stroke-opacity"
            values="0.2;0.7;0.2"
            dur="2.8s"
            begin={`${card * 0.45}s`}
            repeatCount="indefinite"
          />
        </rect>
      ))}

      {/* footer bars */}
      <rect x="56" y="212" width="170" height="7" rx="3.5" fill={STROKE} fillOpacity="0.2" />
      <rect x="56" y="212" width="70" height="7" rx="3.5" fill={STROKE} fillOpacity="0.6">
        <animate attributeName="width" values="30;170;30" dur="4.4s" repeatCount="indefinite" />
      </rect>
    </svg>
  );
}

/** Shield with a lock, sweep ring scanning outward. */
function SecurityDiagram() {
  return (
    <svg viewBox="0 0 320 290" className="h-full w-full" role="img" aria-label="Security diagram">
      {[0, 1].map((ring) => (
        <circle key={ring} cx="160" cy="145" r="60" fill="none" stroke={STROKE} strokeWidth="1">
          <animate attributeName="r" values="60;118" dur="3.4s" begin={`${ring * 1.7}s`} repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.35;0" dur="3.4s" begin={`${ring * 1.7}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {Array.from({ length: 12 }, (_, tick) => {
        const angle = (tick / 12) * Math.PI * 2;
        const x1 = 160 + Math.cos(angle) * 124;
        const y1 = 145 + Math.sin(angle) * 124;
        const x2 = 160 + Math.cos(angle) * 132;
        const y2 = 145 + Math.sin(angle) * 132;
        return <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} stroke={STROKE} strokeOpacity="0.25" strokeWidth="1.2" />;
      })}

      <path
        d="M160 66l62 24v52c0 44-26 74-62 88-36-14-62-44-62-88V90z"
        fill={INK}
        stroke={STROKE}
        strokeOpacity="0.6"
        strokeWidth="1.5"
      />
      <rect x="138" y="138" width="44" height="36" rx="8" fill="none" stroke={STROKE} strokeOpacity="0.7" strokeWidth="1.5" />
      <path d="M146 138v-12a14 14 0 0 1 28 0v12" fill="none" stroke={STROKE} strokeOpacity="0.7" strokeWidth="1.5" />
      <circle cx="160" cy="154" r="4" fill={STROKE}>
        <animate attributeName="fill-opacity" values="0.5;1;0.5" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <line x1="160" y1="158" x2="160" y2="166" stroke={STROKE} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" />
    </svg>
  );
}

/** A phone whose app tiles light up one by one. */
function MobileDiagram() {
  return (
    <svg viewBox="0 0 320 290" className="h-full w-full" role="img" aria-label="Mobile app diagram">
      <rect x="106" y="34" width="108" height="222" rx="24" fill={INK} stroke={STROKE} strokeOpacity="0.55" strokeWidth="1.5" />
      <rect x="138" y="46" width="44" height="8" rx="4" fill={STROKE} fillOpacity="0.3" />
      {Array.from({ length: 9 }, (_, tile) => {
        const col = tile % 3;
        const row = Math.floor(tile / 3);
        return (
          <rect
            key={tile}
            x={122 + col * 28}
            y={72 + row * 28}
            width="20"
            height="20"
            rx="6"
            fill={STROKE}
            fillOpacity="0.15"
            stroke={STROKE}
            strokeOpacity="0.3"
            strokeWidth="1"
          >
            <animate
              attributeName="fill-opacity"
              values="0.1;0.65;0.1"
              dur="3.6s"
              begin={`${tile * 0.28}s`}
              repeatCount="indefinite"
            />
          </rect>
        );
      })}
      {/* content sheet */}
      <rect x="122" y="164" width="76" height="52" rx="8" fill="none" stroke={STROKE} strokeOpacity="0.35" strokeWidth="1.2" />
      <rect x="130" y="174" width="44" height="6" rx="3" fill={STROKE} fillOpacity="0.4" />
      <rect x="130" y="186" width="60" height="5" rx="2.5" fill={STROKE} fillOpacity="0.2" />
      <rect x="130" y="196" width="52" height="5" rx="2.5" fill={STROKE} fillOpacity="0.2" />
      <rect x="146" y="238" width="28" height="4" rx="2" fill={STROKE} fillOpacity="0.5" />

      {/* signal waves */}
      {[0, 1].map((wave) => (
        <path
          key={wave}
          d={`M226 ${96 - wave * 4} a ${26 + wave * 14} ${26 + wave * 14} 0 0 1 0 ${52 + wave * 8}`}
          fill="none"
          stroke={STROKE}
          strokeWidth="1.4"
        >
          <animate attributeName="stroke-opacity" values="0.1;0.6;0.1" dur="2.6s" begin={`${wave * 0.5}s`} repeatCount="indefinite" />
        </path>
      ))}
    </svg>
  );
}

/** Search lens over a chart that keeps climbing. */
function SeoDiagram() {
  return (
    <svg viewBox="0 0 320 290" className="h-full w-full" role="img" aria-label="Search growth diagram">
      <line x1="52" y1="232" x2="272" y2="232" stroke={STROKE} strokeOpacity="0.3" strokeWidth="1.2" />
      {[
        { x: 70, h: 46 },
        { x: 118, h: 78 },
        { x: 166, h: 112 },
        { x: 214, h: 152 },
      ].map((bar, index) => (
        <rect key={bar.x} x={bar.x} width="30" rx="6" fill={STROKE} height={bar.h} y={232 - bar.h} fillOpacity="0.28">
          <animate
            attributeName="fill-opacity"
            values="0.18;0.55;0.18"
            dur="3s"
            begin={`${index * 0.35}s`}
            repeatCount="indefinite"
          />
        </rect>
      ))}
      <path d="M70 196 L133 164 L181 128 L229 88" fill="none" stroke={STROKE} strokeOpacity="0.7" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M229 88l-14 2m14-2-2 14" stroke={STROKE} strokeOpacity="0.7" strokeWidth="1.8" strokeLinecap="round" />
      <circle r="3.5" fill={STROKE}>
        <animateMotion dur="3.6s" repeatCount="indefinite" path="M70 196 L133 164 L181 128 L229 88" />
      </circle>

      {/* lens */}
      <g>
        <circle cx="112" cy="96" r="34" fill={INK} fillOpacity="0.7" stroke={STROKE} strokeOpacity="0.65" strokeWidth="1.5" />
        <line x1="136" y1="122" x2="158" y2="146" stroke={STROKE} strokeOpacity="0.65" strokeWidth="4" strokeLinecap="round" />
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 26 18; 0 0"
          dur="5.5s"
          repeatCount="indefinite"
        />
      </g>
    </svg>
  );
}

export function ServiceDiagram({ slug }: { slug: string }) {
  switch (slug) {
    case 'ai-integration':
      return <AiFace />;
    case 'cloud-architecture':
      return <CloudDiagram />;
    case 'web-development':
      return <WebDiagram />;
    case 'data-security':
      return <SecurityDiagram />;
    case 'mobile-apps':
      return <MobileDiagram />;
    case 'seo-optimization':
      return <SeoDiagram />;
    default:
      return <WebDiagram />;
  }
}
