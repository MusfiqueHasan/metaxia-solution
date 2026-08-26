'use client';

import { useEffect, useRef } from 'react';

/**
 * Ambient starfield: a few hundred twinkling points drawn on a 2D canvas,
 * drifting almost imperceptibly. Sized to its parent, devicePixelRatio-aware,
 * paused entirely under reduced motion (renders one static frame instead).
 */
export function Starfield({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let width = 0;
    let height = 0;

    interface Star {
      x: number;
      y: number;
      r: number;
      phase: number;
      speed: number;
    }
    let stars: Star[] = [];

    const seed = () => {
      const count = Math.min(240, Math.floor((width * height) / 6000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.1 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.4 + 0.15,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        const twinkle = reducedMotion ? 0.6 : 0.35 + 0.45 * Math.abs(Math.sin(star.phase + t * 0.0004 * star.speed * 4));
        ctx.globalAlpha = twinkle;
        ctx.fillStyle = '#f2f1ec';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    resize();
    if (reducedMotion) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ''}`}
    />
  );
}
