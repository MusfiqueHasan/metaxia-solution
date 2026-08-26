'use client';

import { notFound, useParams } from 'next/navigation';
import { getResource, useRequireAuth } from '@/lib/admin';
import { ResourceForm } from '@/components/admin/resource-form';

export default function AdminResourceNewPage() {
  useRequireAuth();
  const params = useParams<{ resource: string }>();
  const def = getResource(params.resource);
  if (!def) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl tracking-[-0.01em] text-ink">New {def.label.replace(/s$/, '')}</h1>
      <div className="mt-6">
        <ResourceForm def={def} />
      </div>
    </div>
  );
}
