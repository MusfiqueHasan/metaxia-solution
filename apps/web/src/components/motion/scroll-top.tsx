'use client';

import { useEffect, useState } from 'react';

/**
 * Floating back-to-top action: appears once the visitor is a screen deep,
 * scrolls smoothly home, and hides again near the top.
 */
export function ScrollTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      data-cursor="Top"
      className={`fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-line-strong bg-ink/85 text-fg shadow-[0_8px_32px_-8px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent hover:text-accent ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="h-4 w-4">
        <path
          d="M8 13V3M3.5 7 8 2.5 12.5 7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
