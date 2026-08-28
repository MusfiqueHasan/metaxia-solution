'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { adminFetch, useRequireAuth, RESOURCES } from '@/lib/admin';
import { AdminIcon } from '@/components/admin/ui';

const CHIP_HUES = [
  'bg-violet-500/12 text-violet-500',
  'bg-sky-500/12 text-sky-500',
  'bg-amber-500/12 text-amber-500',
  'bg-emerald-500/12 text-emerald-500',
  'bg-rose-500/12 text-rose-500',
  'bg-cyan-500/12 text-cyan-500',
  'bg-fuchsia-500/12 text-fuchsia-500',
  'bg-lime-500/12 text-lime-500',
];

export default function AdminDashboardPage() {
  useRequireAuth();
  const [counts, setCounts] = useState<Record<string, number | null>>({});
  const [inbox, setInbox] = useState<{ contacts: number | null; subscribers: number | null }>({
    contacts: null,
    subscribers: null,
  });

  useEffect(() => {
    for (const resource of RESOURCES) {
      adminFetch<unknown[]>(resource.publicPath)
        .then((rows) => setCounts((prev) => ({ ...prev, [resource.key]: rows.length })))
        .catch(() => setCounts((prev) => ({ ...prev, [resource.key]: null })));
    }
    adminFetch<unknown[]>('/admin/contact-submissions')
      .then((rows) => setInbox((prev) => ({ ...prev, contacts: rows.length })))
      .catch(() => undefined);
    adminFetch<unknown[]>('/admin/newsletter-subscribers')
      .then((rows) => setInbox((prev) => ({ ...prev, subscribers: rows.length })))
      .catch(() => undefined);
  }, []);

  return (
    <div className="px-6 py-8 lg:px-10">
      <h1 className="font-display text-3xl tracking-[-0.01em] text-fg">Dashboard</h1>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-soft">
        Content overview · live site updates within a minute of saving
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {RESOURCES.map((resource, index) => (
          <Link
            key={resource.key}
            href={`/admin/${resource.key}`}
            className="admin-card admin-float group rounded-3xl border border-line bg-ink-raised p-5 hover:border-accent/40"
          >
            <div className="flex items-center justify-between">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-2xl ${CHIP_HUES[index % CHIP_HUES.length]}`}
              >
                <AdminIcon name={resource.key} className="h-4.5 w-4.5" />
              </span>
              <span
                aria-hidden="true"
                className="text-fg-soft/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent"
              >
                →
              </span>
            </div>
            <p className="mt-5 font-display text-4xl tabular-nums text-fg">
              {counts[resource.key] ?? '—'}
            </p>
            <p className="mt-1 text-sm text-fg-soft">{resource.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/inbox"
          className="admin-card admin-float group flex items-center justify-between rounded-3xl border border-line bg-ink-raised p-5 hover:border-accent/40"
        >
          <div className="flex items-center gap-4">
            <span className="admin-gradient admin-glow flex h-10 w-10 items-center justify-center rounded-2xl text-white">
              <AdminIcon name="inbox" className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="text-sm font-medium text-fg">Contact messages</p>
              <p className="text-sm text-fg-soft">
                {inbox.contacts ?? '—'} received · {inbox.subscribers ?? '—'} newsletter subscribers
              </p>
            </div>
          </div>
          <span aria-hidden="true" className="text-fg-soft/50 group-hover:text-accent">
            →
          </span>
        </Link>

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="admin-card admin-float group flex items-center justify-between rounded-3xl border border-line bg-ink-raised p-5 hover:border-accent/40"
        >
          <div className="flex items-center gap-4">
            <span className="admin-gradient admin-glow flex h-10 w-10 items-center justify-center rounded-2xl text-white">
              <AdminIcon name="eye" className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="text-sm font-medium text-fg">View the live site</p>
              <p className="text-sm text-fg-soft">Opens in a new tab</p>
            </div>
          </div>
          <span aria-hidden="true" className="text-fg-soft/50 group-hover:text-accent">
            ↗
          </span>
        </a>
      </div>
    </div>
  );
}
