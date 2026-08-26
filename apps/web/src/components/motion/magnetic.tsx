'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface MagneticProps {
  children: ReactNode;
  className?: string;
  /** Maximum pull toward the cursor, in pixels. */
  strength?: number;
}

/**
 * Subtle magnetic pull: the wrapped element drifts a few pixels toward the
 * cursor while hovered and springs back on leave. Fine pointers only; no
 * React state — transforms are written directly in rAF.
 */
export function Magnetic({ children, className, strength = 8 }: MagneticProps) {
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
        const relX = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const relY = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        node.style.transform = `translate(${(relX * strength).toFixed(1)}px, ${(relY * strength).toFixed(1)}px)`;
      });
    };

    const onLeave = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      node.style.transform = '';
    };

    node.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
    node.addEventListener('pointermove', onMove, { passive: true });
    node.addEventListener('pointerleave', onLeave);
    return () => {
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [strength]);

  return (
    <div ref={ref} className={className ? `inline-block ${className}` : 'inline-block'}>
      {children}
    </div>
  );
}
