'use client';

import { useEffect, useState } from 'react';

/** Mount flag: charts transition from their zero state one frame after mount. */
function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  return mounted;
}

export interface AreaSeries {
  label: string;
  color: string;
  values: number[];
}

/** Smooth path through points via Catmull-Rom → cubic bezier. */
function smoothPath(points: Array<[number, number]>): string {
  if (points.length < 2) return '';
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

/**
 * Dependency-free area chart: dashed grid, gradient fill under the first
 * series, smooth lines that draw themselves in, a pulsing latest point.
 */
export function AreaChart({ series, labels }: { series: AreaSeries[]; labels: string[] }) {
  const mounted = useMounted();
  const W = 640;
  const H = 220;
  const PAD_X = 8;
  const PAD_TOP = 16;
  const PAD_BOTTOM = 28;

  const max = Math.max(1, ...series.flatMap((s) => s.values));
  const innerW = W - PAD_X * 2;
  const innerH = H - PAD_TOP - PAD_BOTTOM;
  const stepX = innerW / Math.max(1, labels.length - 1);

  const toPoints = (values: number[]): Array<[number, number]> =>
    values.map((v, i) => [PAD_X + i * stepX, PAD_TOP + innerH - (v / max) * innerH]);

  const gridYs = [0.25, 0.5, 0.75, 1].map((t) => PAD_TOP + innerH * (1 - t));
  // Sparse x labels: first, middle, last.
  const labelIdx = [0, Math.floor((labels.length - 1) / 2), labels.length - 1];

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" style={{ maxWidth: '100%' }} preserveAspectRatio="xMidYMid meet" role="img" aria-label="Activity chart">
        <defs>
          <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={series[0]?.color ?? '#d97a2e'} stopOpacity="0.22" />
            <stop offset="100%" stopColor={series[0]?.color ?? '#d97a2e'} stopOpacity="0" />
          </linearGradient>
        </defs>

        {gridYs.map((y) => (
          <line
            key={y}
            x1={PAD_X}
            x2={W - PAD_X}
            y1={y}
            y2={y}
            stroke="var(--color-line)"
            strokeDasharray="3 5"
          />
        ))}
        <line
          x1={PAD_X}
          x2={W - PAD_X}
          y1={PAD_TOP + innerH}
          y2={PAD_TOP + innerH}
          stroke="var(--color-line-strong)"
        />

        {series.map((s, index) => {
          const points = toPoints(s.values);
          const path = smoothPath(points);
          const last = points[points.length - 1];
          return (
            <g key={s.label}>
              {index === 0 ? (
                <path
                  d={`${path} L ${last[0]} ${PAD_TOP + innerH} L ${points[0][0]} ${PAD_TOP + innerH} Z`}
                  fill="url(#area-fill)"
                  opacity={mounted ? 1 : 0}
                  style={{ transition: 'opacity 1s ease 0.4s' }}
                />
              ) : null}
              <path
                d={path}
                fill="none"
                stroke={s.color}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeDasharray={index === 0 ? undefined : '1 8'}
                pathLength={1}
                style={{
                  strokeDasharray: index === 0 ? 1 : undefined,
                  strokeDashoffset: index === 0 ? (mounted ? 0 : 1) : undefined,
                  transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)',
                }}
              />
              <circle cx={last[0]} cy={last[1]} r={4} fill={s.color} />
              {index === 0 ? (
                <circle cx={last[0]} cy={last[1]} r={4} fill="none" stroke={s.color}>
                  <animate attributeName="r" values="4;11" dur="1.8s" repeatCount="indefinite" />
                  <animate
                    attributeName="opacity"
                    values="0.7;0"
                    dur="1.8s"
                    repeatCount="indefinite"
                  />
                </circle>
              ) : null}
            </g>
          );
        })}

        {labelIdx.map((i) => (
          <text
            key={i}
            x={PAD_X + i * stepX}
            y={H - 8}
            textAnchor={i === 0 ? 'start' : i === labels.length - 1 ? 'end' : 'middle'}
            fill="var(--color-fg-soft)"
            fontSize="10"
            fontFamily="var(--font-mono)"
            letterSpacing="0.08em"
          >
            {labels[i]}
          </text>
        ))}
      </svg>

      <div className="mt-3 flex flex-wrap items-center gap-5">
        {series.map((s) => (
          <span key={s.label} className="flex items-center gap-2 text-xs text-fg-soft">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

/** Donut with a center total, segments sweeping in on mount, legend below. */
export function DonutChart({ slices, centerLabel }: { slices: DonutSlice[]; centerLabel: string }) {
  const mounted = useMounted();
  const total = Math.max(
    1,
    slices.reduce((sum, s) => sum + s.value, 0),
  );
  const R = 52;
  const C = 2 * Math.PI * R;
  const GAP = slices.length > 1 ? 2.5 : 0;

  let offset = 0;
  const segments = slices
    .filter((s) => s.value > 0)
    .map((s) => {
      const frac = s.value / total;
      const seg = { ...s, dash: Math.max(0, frac * C - GAP), start: offset };
      offset += frac * C;
      return seg;
    });

  return (
    <div>
      <div className="relative mx-auto w-40">
        <svg viewBox="0 0 140 140" className="w-full -rotate-90" role="img" aria-label={centerLabel}>
          <circle cx="70" cy="70" r={R} fill="none" stroke="var(--color-line)" strokeWidth="14" />
          {segments.map((s) => (
            <circle
              key={s.label}
              cx="70"
              cy="70"
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={`${mounted ? s.dash : 0} ${C}`}
              strokeDashoffset={-s.start}
              style={{ transition: 'stroke-dasharray 1.1s cubic-bezier(0.16,1,0.3,1)' }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-display text-3xl tabular-nums text-fg">
            {slices.reduce((sum, s) => sum + s.value, 0)}
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-fg-soft">
            {centerLabel}
          </p>
        </div>
      </div>

      <ul className="mt-5 space-y-2">
        {slices.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-3 text-[13px]">
            <span className="flex min-w-0 items-center gap-2 text-fg-soft">
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="truncate">{s.label}</span>
            </span>
            <span className="font-mono text-xs tabular-nums text-fg">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface BarDatum {
  label: string;
  value: number;
  color: string;
}

/** Horizontal bar list: label, animated gradient track, count. */
export function BarList({ data }: { data: BarDatum[] }) {
  const mounted = useMounted();
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <ul className="space-y-3.5">
      {data.map((d, index) => (
        <li key={d.label}>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-fg-soft">{d.label}</span>
            <span className="font-mono text-xs tabular-nums text-fg">{d.value}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-fg/[0.05]">
            <div
              className="h-full rounded-full"
              style={{
                width: mounted ? `${(d.value / max) * 100}%` : '0%',
                backgroundImage: `linear-gradient(90deg, ${d.color}, ${d.color}cc)`,
                transition: `width 0.9s cubic-bezier(0.16,1,0.3,1) ${index * 70}ms`,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
