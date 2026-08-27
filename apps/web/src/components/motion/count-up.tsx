'use client';

import { useEffect, useRef } from 'react';

interface CountUpProps {
  value: number;
  suffix?: string;
  /** Milliseconds for the full count. */
  duration?: number;
}

/**
 * Counts from 0 to `value` when the element enters the viewport — one rAF
 * loop writing textContent directly (no re-renders), eased on the expo
 * curve. Reduced motion (and no-JS, via SSR) shows the final value.
 */
export function CountUp({ value, suffix = '', duration = 1400 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 4);
          node.textContent = `${Math.round(eased * value)}${suffix}`;
          if (progress < 1) raf = requestAnimationFrame(tick);
        };
        node.textContent = `0${suffix}`;
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, suffix, duration]);

  // SSR renders the final value so crawlers and no-JS visitors see the truth.
  return <span ref={ref}>{`${value}${suffix}`}</span>;
}
