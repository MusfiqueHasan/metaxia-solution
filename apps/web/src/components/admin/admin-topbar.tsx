'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AdminIcon } from '@/components/admin/ui';

const THEME_KEY = 'mx-admin-theme';

function applyTheme(dark: boolean) {
  document.querySelector('.admin-shell')?.classList.toggle('admin-dark', dark);
}

export function AdminTopbar() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    let stored = false;
    try {
      stored = localStorage.getItem(THEME_KEY) === 'dark';
    } catch {
      /* storage unavailable */
    }
    setDark(stored);
    applyTheme(stored);
  }, []);

  if (pathname === '/admin') return null;

  const toggle = () => {
    const next = !dark;
    setDark(next);
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
    } catch {
      /* storage unavailable */
    }
  };

  const section =
    pathname
      .split('/')
      .filter(Boolean)[1]
      ?.replace(/-/g, ' ')
      .replace(/^\w/, (c) => c.toUpperCase()) ?? 'Dashboard';

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-ink-raised/85 px-6 backdrop-blur">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-fg-soft">
        Admin <span className="mx-1.5 text-fg-soft/50">/</span>
        <span className="text-fg">{section}</span>
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggle}
          title={dark ? 'Switch to light theme' : 'Switch to dark theme'}
          aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-fg-soft transition-colors hover:border-accent hover:text-accent"
        >
          <AdminIcon name={dark ? 'sun' : 'moon'} className="h-4 w-4" />
        </button>
        <Link
          href="/"
          target="_blank"
          className="flex h-9 items-center gap-2 rounded-lg border border-line px-3.5 text-[13px] font-medium text-fg-soft transition-colors hover:border-accent hover:text-accent"
        >
          <AdminIcon name="eye" className="h-4 w-4" /> View site
        </Link>
      </div>
    </header>
  );
}
