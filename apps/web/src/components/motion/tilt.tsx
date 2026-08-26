'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface TiltProps {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees. Keep small — this is depth, not a gimmick. */
  max?: number;
}

/**
 * Cursor-aware card tilt: rotateX/rotateY within ±max degrees, driven by
 * pointer position. Fine pointers only, transform-only, no React state.
 */
export function Tilt({ children, className, max = 3.5 }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    let frame = 0;

    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = node.getBoundingClientRect();
        const relX = (event.clientX - rect.left) / rect.width - 0.5;
        const relY = (event.clientY - rect.top) / rect.height - 0.5;
        node.style.transform = `perspective(900px) rotateX(${(-relY * max * 2).toFixed(2)}deg) rotateY(${(relX * max * 2).toFixed(2)}deg)`;
      });
    };

    const onLeave = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      node.style.transform = '';
    };

    node.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    node.style.willChange = 'transform';
    node.addEventListener('pointermove', onMove, { passive: true });
    node.addEventListener('pointerleave', onLeave);
    return () => {
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [max]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
