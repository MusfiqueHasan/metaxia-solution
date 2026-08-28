'use client';

import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminTopbar } from '@/components/admin/admin-topbar';

/**
 * Admin chrome: the floating sidebar + topbar around every admin screen.
 * The login route renders bare — no shell padding, so its full-viewport
 * split layout fits the screen exactly (no phantom vertical scroll).
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const isLogin = usePathname() === '/admin';

  if (isLogin) {
    return <div className="admin-theme bg-ink text-fg">{children}</div>;
  }

  return (
    <div className="admin-theme admin-shell flex min-h-svh gap-4 bg-ink p-3 text-fg lg:p-4">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <AdminTopbar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
