'use client';

import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { adminFetch, getResource, useRequireAuth } from '@/lib/admin';
import { ResourceForm } from '@/components/admin/resource-form';

interface Row {
  id: string;
  [key: string]: unknown;
}

export default function AdminResourceEditPage() {
  useRequireAuth();
  const params = useParams<{ resource: string; id: string }>();
  const def = getResource(params.resource);

  const [row, setRow] = useState<Row | null | undefined>(undefined);

  useEffect(() => {
    if (!def) return;
    let cancelled = false;
    adminFetch<Row[]>(def.publicPath)
      .then((rows) => {
        if (cancelled) return;
        setRow(rows.find((r) => r.id === params.id) ?? null);
      })
      .catch(() => {
        if (!cancelled) setRow(null);
      });
    return () => {
      cancelled = true;
    };
  }, [def, params.id]);

  if (!def) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl tracking-[-0.01em] text-ink">Edit {def.label.replace(/s$/, '')}</h1>
      <div className="mt-6">
        {row === undefined ? (
          <p className="text-sm text-ink-soft">Loading…</p>
        ) : row === null ? (
          <p className="text-sm text-rose-600">Row not found.</p>
        ) : (
          <ResourceForm def={def} initial={row} />
        )}
      </div>
    </div>
  );
}
