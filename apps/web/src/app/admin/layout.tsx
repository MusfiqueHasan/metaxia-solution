import type { Metadata } from 'next';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[70vh] bg-surface">
      <AdminSidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
