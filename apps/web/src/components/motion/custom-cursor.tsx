'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * Custom cursor: a crisp dot at the pointer and a lagging ring behind it.
 * Elements carrying data-cursor="Label" expand the ring into a labeled chip.
 * Fine pointers only; reduced motion disables it entirely (CSS hides the
 * elements and the has-custom-cursor class is never added).
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  // The admin panel is a plain tool, not a show — it keeps the native cursor.
  const isAdmin = usePathname().startsWith('/admin');

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label || isAdmin) return;

    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    document.documentElement.classList.add('has-custom-cursor');

    let raf = 0;
    let x = -100;
    let y = -100;
    let ringX = -100;
    let ringY = -100;
    let started = false;

    const loop = () => {
      ringX += (x - ringX) * 0.16;
      ringY += (y - ringY) * 0.16;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!started) {
        started = true;
        ringX = x;
        ringY = y;
        dot.classList.add('is-on');
        ring.classList.add('is-on');
        raf = requestAnimationFrame(loop);
      }
    };

    // Event delegation: one listener reads data-cursor off whatever is hovered.
    const onOver = (event: PointerEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>('[data-cursor]');
      if (target?.dataset.cursor) {
        label.textContent = target.dataset.cursor;
        ring.classList.add('has-label');
      } else {
        ring.classList.remove('has-label');
      }
    };

    const onLeave = () => {
      dot.classList.remove('is-on');
      ring.classList.remove('is-on');
      started = false;
      cancelAnimationFrame(raf);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [isAdmin]);

  if (isAdmin) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span ref={labelRef} className="cursor-label" />
      </div>
    </>
  );
}
