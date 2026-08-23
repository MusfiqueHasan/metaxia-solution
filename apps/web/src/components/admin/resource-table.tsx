'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { adminFetch, type ResourceDef } from '@/lib/admin';

interface Row {
  id: string;
  [key: string]: unknown;
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

export function ResourceTable({ def }: { def: ResourceDef }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await adminFetch<Row[]>(def.publicPath);
      setRows(data);
    } catch {
      setError('Failed to load rows.');
    }
  }, [def.publicPath]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete(id: string) {
    if (!confirm('Delete this item? This cannot be undone.')) return;
    try {
      await adminFetch(`${def.apiPath}/${id}`, { method: 'DELETE' });
      setRows((prev) => prev?.filter((r) => r.id !== id) ?? null);
    } catch {
      setError('Failed to delete row.');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium tracking-tight text-ink">{def.label}</h1>
        <Link
          href={`/admin/${def.key}/new`}
          className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent-strong"
        >
          New
        </Link>
      </div>

      {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-ink/10 bg-surface-alt">
        <table className="min-w-full divide-y divide-ink/10 text-left text-sm">
          <thead>
            <tr>
              {def.columns.map((col) => (
                <th key={col} className="whitespace-nowrap px-4 py-3 font-medium text-ink-soft">
                  {col}
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {rows === null ? (
              <tr>
                <td className="px-4 py-4 text-ink-soft" colSpan={def.columns.length + 1}>
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-ink-soft" colSpan={def.columns.length + 1}>
                  No rows yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  {def.columns.map((col) => (
                    <td key={col} className="whitespace-nowrap px-4 py-3 text-ink">
                      {formatCell(row[col])}
                    </td>
                  ))}
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <Link href={`/admin/${def.key}/${row.id}`} className="text-accent hover:underline">
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(row.id)}
                      className="ml-4 text-rose-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
