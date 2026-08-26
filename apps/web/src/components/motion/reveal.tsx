'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Fraction of the element that must be visible before revealing. */
  threshold?: number;
  /** Reveal once and stay revealed (default) or toggle with visibility. */
  once?: boolean;
}

/**
 * Adds `is-revealed` to its element when it enters the viewport. The visual
 * treatment lives entirely in CSS (`.reveal-rise`, `.word-mask`, `.meter-fill`,
 * ...), so children stay server-rendered and reduced-motion users see content
 * immediately.
 */
export function Reveal({ children, className, threshold = 0.2, once = true }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.classList.add('is-revealed');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add('is-revealed');
            if (once) observer.disconnect();
          } else if (!once) {
            node.classList.remove('is-revealed');
          }
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
