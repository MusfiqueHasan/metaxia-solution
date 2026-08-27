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
    `group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors duration-150 ${
      active
        ? 'bg-accent-soft text-accent'
        : 'text-fg-soft hover:bg-ink hover:text-fg'
    }`;

  const activeBar = (active: boolean) =>
    active ? (
      <span
        aria-hidden="true"
        className="absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-accent"
      />
    ) : null;

  return (
    <aside className="sticky top-0 flex h-svh w-60 shrink-0 flex-col border-r border-line bg-ink-raised">
      <Link
        href="/admin/dashboard"
        className="flex items-center gap-2.5 border-b border-line px-5 py-4"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent font-display text-base text-white">
          M
        </span>
        <span>
          <span className="block font-display text-base leading-tight tracking-tight text-fg">
            Metaxia
          </span>
          <span className="block font-mono text-[9px] uppercase tracking-[0.22em] text-fg-soft">
            Admin CMS
          </span>
        </span>
      </Link>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4" aria-label="Admin">
        <Link href="/admin/dashboard" className={linkClass(pathname === '/admin/dashboard')}>
          {activeBar(pathname === '/admin/dashboard')}
          <AdminIcon name="dashboard" /> Dashboard
        </Link>

        <p className="px-3 pb-1.5 pt-5 font-mono text-[9px] font-medium uppercase tracking-[0.22em] text-fg-soft/70">
          Content
        </p>
        {RESOURCES.map((resource) => {
          const href = `/admin/${resource.key}`;
          const active = pathname.startsWith(href);
          return (
            <Link key={resource.key} href={href} className={linkClass(active)}>
              {activeBar(active)}
              <AdminIcon name={resource.key} /> {resource.label}
            </Link>
          );
        })}

        <p className="px-3 pb-1.5 pt-5 font-mono text-[9px] font-medium uppercase tracking-[0.22em] text-fg-soft/70">
          Inbound
        </p>
        <Link href="/admin/inbox" className={linkClass(pathname === '/admin/inbox')}>
          {activeBar(pathname === '/admin/inbox')}
          <AdminIcon name="inbox" /> Inbox
        </Link>
      </nav>

      {/* Signed-in card */}
      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3 rounded-xl border border-line bg-ink px-3 py-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft font-display text-sm text-accent">
            A
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-medium text-fg">Admin</span>
            <span className="block truncate text-[11px] text-fg-soft">admin@metaxia.io</span>
          </span>
          <button
            type="button"
            title="Log out"
            aria-label="Log out"
            onClick={() => {
              clearToken();
              router.push('/admin');
            }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-fg-soft transition-colors hover:bg-rose-500/10 hover:text-rose-500"
          >
            <AdminIcon name="logout" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
