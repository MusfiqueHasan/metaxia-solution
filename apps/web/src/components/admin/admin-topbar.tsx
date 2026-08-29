'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminIcon } from '@/components/admin/ui';

export function AdminTopbar({ onMenu }: { onMenu?: () => void }) {
  const pathname = usePathname();
  if (pathname === '/admin') return null;

  const section =
    pathname
      .split('/')
      .filter(Boolean)[1]
      ?.replace(/-/g, ' ')
      .replace(/^\w/, (c) => c.toUpperCase()) ?? 'Dashboard';

  return (
    <header className="admin-float sticky top-3 z-30 flex h-14 items-center justify-between rounded-full border border-line bg-ink-raised/90 px-6 backdrop-blur lg:top-4">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open menu"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-fg-soft transition-colors hover:border-accent hover:text-accent lg:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <p className="truncate font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-fg-soft">
          Admin <span className="mx-1.5 text-fg-soft/50">/</span>
          <span className="text-fg">{section}</span>
        </p>
      </div>

      <Link
        href="/"
        target="_blank"
        className="flex h-9 items-center gap-2 rounded-full border border-line px-4 text-[13px] font-medium text-fg-soft transition-colors hover:border-accent hover:text-accent"
      >
        <AdminIcon name="eye" className="h-4 w-4" /> View site
      </Link>
    </header>
  );
}
