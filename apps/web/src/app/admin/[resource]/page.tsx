'use client';

import { notFound } from 'next/navigation';
import { useParams } from 'next/navigation';
import { getResource, useRequireAuth } from '@/lib/admin';
import { ResourceTable } from '@/components/admin/resource-table';

export default function AdminResourceListPage() {
  useRequireAuth();
  const params = useParams<{ resource: string }>();
  const def = getResource(params.resource);
  if (!def) notFound();

  return <ResourceTable def={def} />;
}
