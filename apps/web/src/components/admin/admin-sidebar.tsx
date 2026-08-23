'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { RESOURCES, clearToken } from '@/lib/admin';

const linkBase = 'block rounded-lg px-3 py-2 text-sm font-medium transition-colors';
const linkInactive = 'text-ink-soft hover:bg-ink/5 hover:text-ink';
const linkActive = 'bg-accent-soft text-accent';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearToken();
    router.push('/admin');
  }

  if (pathname === '/admin') return null;

  return (
    <aside className="flex w-56 shrink-0 flex-col gap-1 border-r border-ink/10 bg-surface-alt p-4">
      <Link href="/admin/dashboard" className="mb-4 font-display text-sm font-semibold tracking-tight text-ink">
        Metaxia Admin
      </Link>

      {RESOURCES.map((resource) => {
        const href = `/admin/${resource.key}`;
        const active = pathname?.startsWith(href);
        return (
          <Link key={resource.key} href={href} className={`${linkBase} ${active ? linkActive : linkInactive}`}>
            {resource.label}
          </Link>
        );
      })}

      <Link
        href="/admin/inbox"
        className={`${linkBase} ${pathname?.startsWith('/admin/inbox') ? linkActive : linkInactive}`}
      >
        Inbox
      </Link>

      <button type="button" onClick={handleLogout} className={`${linkBase} ${linkInactive} mt-4 text-left`}>
        Logout
      </button>
    </aside>
  );
}
