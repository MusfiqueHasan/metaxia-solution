'use client';

import { useEffect, useRef } from 'react';

/**
 * The signature object: a sphere of ~700 points, orthographically projected
 * onto a 2D canvas, rotating slowly and tilting a few degrees toward the
 * pointer. Pure canvas math — no WebGL library, no React state per frame.
 * Under reduced motion it renders a single static frame.
 */
export function ParticleOrb({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    const COUNT = 700;
    // Fibonacci-sphere distribution: even coverage, no clumped poles.
    const points = Array.from({ length: COUNT }, (_, i) => {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = i * Math.PI * (3 - Math.sqrt(5));
      return { x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius };
    });

    let raf = 0;
    let size = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let tiltX = 0;
    let tiltY = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = Math.min(canvas.clientWidth, canvas.clientHeight);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const R = size * 0.42;
      const cx = w / 2;
      const cy = h / 2;
      const spin = t * 0.00008;

      tiltX += (targetTiltX - tiltX) * 0.06;
      tiltY += (targetTiltY - tiltY) * 0.06;

      ctx.clearRect(0, 0, w, h);

      for (const p of points) {
        // Spin around Y, then tilt toward the pointer around X/Y.
        const cosS = Math.cos(spin);
        const sinS = Math.sin(spin);
        let x = p.x * cosS - p.z * sinS;
        let z = p.x * sinS + p.z * cosS;
        let y = p.y;

        const cosTX = Math.cos(tiltX);
        const sinTX = Math.sin(tiltX);
        const y2 = y * cosTX - z * sinTX;
        const z2 = y * sinTX + z * cosTX;
        const cosTY = Math.cos(tiltY);
        const sinTY = Math.sin(tiltY);
        const x2 = x * cosTY + z2 * sinTY;
        const z3 = -x * sinTY + z2 * cosTY;

        const depth = (z3 + 1) / 2; // 0 (far) .. 1 (near)
        const px = cx + x2 * R;
        const py = cy + y2 * R;
        const dotR = 0.5 + depth * 1.2;

        ctx.globalAlpha = 0.12 + depth * 0.75;
        ctx.fillStyle = depth > 0.82 ? '#f2a06b' : '#f2f1ec';
        ctx.beginPath();
        ctx.arc(px, py, dotR, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    const onPointer = (event: PointerEvent) => {
      targetTiltY = (event.clientX / window.innerWidth - 0.5) * 0.5;
      targetTiltX = (event.clientY / window.innerHeight - 0.5) * -0.5;
    };

    resize();
    if (reducedMotion) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
      if (finePointer) window.addEventListener('pointermove', onPointer, { passive: true });
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      if (finePointer) window.removeEventListener('pointermove', onPointer);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
