'use client';

import { notFound, useParams } from 'next/navigation';
import { getResource } from '@/lib/admin';
import { ResourceManager } from '@/components/admin/resource-table';

export default function AdminResourceListPage() {
  const params = useParams<{ resource: string }>();
  const def = getResource(params.resource);
  if (!def) notFound();

  return <ResourceManager def={def} />;
}
