'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminIcon } from '@/components/admin/ui';

export function AdminTopbar() {
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
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-fg-soft">
        Admin <span className="mx-1.5 text-fg-soft/50">/</span>
        <span className="text-fg">{section}</span>
      </p>

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
