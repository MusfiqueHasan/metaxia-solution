'use client';

import { useEffect, useRef, useState } from 'react';

const SESSION_KEY = 'mx-intro-seen';

/**
 * First-visit intro: the ink curtain holds for a beat while the wordmark
 * reveals and a copper line draws, then the whole curtain lifts to unveil
 * the page. Plays once per browser session; repeat navigations skip it.
 * A CSS failsafe clears the curtain even if JS never runs, and reduced
 * motion hides it entirely.
 */
export function IntroLoader() {
  const ref = useRef<HTMLDivElement>(null);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === '1';
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* storage unavailable — play the intro anyway */
    }

    if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSkip(true);
      return;
    }

    node.classList.add('is-armed');
    const timer = setTimeout(() => node.classList.add('is-done'), 1700);
    return () => clearTimeout(timer);
  }, []);

  if (skip) return null;

  return (
    <div ref={ref} className="intro-overlay" aria-hidden="true">
      <div className="flex flex-col items-center gap-6 px-6">
        <p className="flex items-center gap-3 font-display text-5xl tracking-[-0.01em] text-fg sm:text-6xl">
          Metaxia
          <span className="mt-3 h-2 w-2 rotate-45 bg-accent" />
        </p>
        <div className="h-px w-48 overflow-hidden bg-line-strong sm:w-64">
          <div className="intro-line h-px w-full bg-accent" />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-fg-soft">
          systems &amp; software
        </p>
      </div>
    </div>
  );
}
