'use client';

import { useEffect } from 'react';

/**
 * The site's signature interaction. Tracks the pointer once, globally, and:
 *  1. positions the fixed `.beacon-light` radial glow (viewport coords), and
 *  2. feeds every `.blueprint` panel its local pointer position so the
 *     blueprint grid emerges only inside the light's radius.
 *
 * Fine pointers only; disabled for reduced motion. All writes happen inside
 * one requestAnimationFrame per pointer move — no React state, no re-renders.
 */
export function CursorBeacon() {
  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    const root = document.documentElement;
    let frame = 0;
    let x = -600;
    let y = -600;

    const apply = () => {
      frame = 0;
      root.style.setProperty('--beacon-px', `${x}px`);
      root.style.setProperty('--beacon-py', `${y}px`);

      const panels = document.getElementsByClassName('blueprint');
      for (const panel of panels) {
        const rect = panel.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > window.innerHeight + 200) continue;
        (panel as HTMLElement).style.setProperty('--beacon-x', `${x - rect.left}px`);
        (panel as HTMLElement).style.setProperty('--beacon-y', `${y - rect.top}px`);
      }
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <div className="beacon-light" aria-hidden="true" />;
}
