'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RESOURCES, adminFetch, useRequireAuth } from '@/lib/admin';

export default function AdminDashboardPage() {
  useRequireAuth();
  const [counts, setCounts] = useState<Record<string, number | null>>({});

  useEffect(() => {
    let cancelled = false;
    for (const resource of RESOURCES) {
      adminFetch<unknown[]>(resource.publicPath)
        .then((rows) => {
          if (!cancelled) setCounts((prev) => ({ ...prev, [resource.key]: rows.length }));
        })
        .catch(() => {
          if (!cancelled) setCounts((prev) => ({ ...prev, [resource.key]: null }));
        });
    }
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl tracking-[-0.01em] text-ink">Dashboard</h1>
      <p className="mt-2 text-sm text-ink-soft">Overview of published content.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {RESOURCES.map((resource) => (
          <Link
            key={resource.key}
            href={`/admin/${resource.key}`}
            className="rounded-2xl border border-ink/10 bg-surface-alt p-5 transition-colors hover:border-accent/40"
          >
            <p className="text-sm font-medium text-ink-soft">{resource.label}</p>
            <p className="mt-2 font-display text-3xl text-ink">
              {counts[resource.key] ?? '—'}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
