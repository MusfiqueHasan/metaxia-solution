'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminTopbar } from '@/components/admin/admin-topbar';

/**
 * Admin chrome: the floating sidebar + topbar around every admin screen.
 * Below lg the sidebar becomes a slide-in drawer driven from the topbar's
 * menu button. The login route renders bare — no shell padding, so its
 * full-viewport split layout fits the screen exactly.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const isLogin = usePathname() === '/admin';
  const [menuOpen, setMenuOpen] = useState(false);

  if (isLogin) {
    return <div className="admin-theme bg-ink text-fg">{children}</div>;
  }

  return (
    <div className="admin-theme admin-shell relative isolate flex min-h-svh gap-4 bg-ink p-3 text-fg lg:p-4">
      {/* Ambient canvas: warm dot grid + drifting copper glows behind everything */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-clip">
        <div className="admin-dots absolute inset-x-0 top-0 h-[42rem]" />
        <div className="absolute -top-40 right-[-8%] h-[30rem] w-[30rem] rounded-full bg-accent/[0.08] blur-[130px]" />
        <div className="absolute left-[30%] top-[-12rem] h-[24rem] w-[24rem] rounded-full bg-[#f0b35e]/[0.1] blur-[120px]" />
        <div className="absolute bottom-[-10rem] left-[-6%] h-[26rem] w-[26rem] rounded-full bg-rose-300/[0.09] blur-[130px]" />
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#fdf3e7]/80 to-transparent" />
      </div>

      {/* Drawer backdrop (mobile only) */}
      {menuOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      ) : null}

      <AdminSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <AdminTopbar onMenu={() => setMenuOpen(true)} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
