import type { Metadata } from 'next';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminTopbar } from '@/components/admin/admin-topbar';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
