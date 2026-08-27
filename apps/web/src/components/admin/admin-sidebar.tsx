'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { RESOURCES, clearToken } from '@/lib/admin';
import { AdminIcon } from '@/components/admin/ui';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // The login route runs chrome-free.
  if (pathname === '/admin') return null;

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-200 ${
      active
        ? 'bg-accent-soft text-accent'
        : 'text-fg-soft hover:bg-fg/5 hover:text-fg'
    }`;

  return (
    <aside className="sticky top-0 flex h-svh w-60 shrink-0 flex-col border-r border-line bg-ink-raised/60">
      <Link
        href="/admin/dashboard"
        className="flex items-center gap-2 border-b border-line px-5 py-5 font-display text-lg tracking-tight text-fg"
      >
        Metaxia
        <span className="h-1.5 w-1.5 rotate-45 bg-accent" aria-hidden="true" />
        <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.24em] text-fg-soft">
          Admin
        </span>
      </Link>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4" aria-label="Admin">
        <Link href="/admin/dashboard" className={linkClass(pathname === '/admin/dashboard')}>
          <AdminIcon name="dashboard" /> Dashboard
        </Link>

        <p className="px-3.5 pb-1 pt-5 font-mono text-[9px] uppercase tracking-[0.24em] text-fg-soft/60">
          Content
        </p>
        {RESOURCES.map((resource) => {
          const href = `/admin/${resource.key}`;
          return (
            <Link key={resource.key} href={href} className={linkClass(pathname.startsWith(href))}>
              <AdminIcon name={resource.key} /> {resource.label}
            </Link>
          );
        })}

        <p className="px-3.5 pb-1 pt-5 font-mono text-[9px] uppercase tracking-[0.24em] text-fg-soft/60">
          Inbound
        </p>
        <Link href="/admin/inbox" className={linkClass(pathname === '/admin/inbox')}>
          <AdminIcon name="inbox" /> Inbox
        </Link>
      </nav>

      <div className="space-y-0.5 border-t border-line px-3 py-4">
        <Link href="/" className={linkClass(false)}>
          <AdminIcon name="eye" /> View website
        </Link>
        <button
          type="button"
          onClick={() => {
            clearToken();
            router.push('/admin');
          }}
          className={`w-full ${linkClass(false)}`}
        >
          <AdminIcon name="logout" /> Log out
        </button>
      </div>
    </aside>
  );
}
