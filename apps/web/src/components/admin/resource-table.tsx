'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminFetch, useRequireAuth, type ResourceDef } from '@/lib/admin';
import { AdminIcon, ConfirmModal, adminInput } from '@/components/admin/ui';
import { ResourceModal } from '@/components/admin/resource-form';

type Row = Record<string, unknown> & { id: string };

function cellText(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return `${value.length} items`;
  const text = String(value);
  if (/^\d{4}-\d{2}-\d{2}T/.test(text)) {
    return new Date(text).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  return text.length > 64 ? `${text.slice(0, 64)}…` : text;
}

/**
 * The full list view for one resource: toolbar (count, search, add), a
 * modern table with icon row-actions, and the create/edit + delete-confirm
 * modals. All reads go to the public endpoint; writes go through /admin.
 */
export function ResourceManager({ def }: { def: ResourceDef }) {
  useRequireAuth();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setRows(await adminFetch<Row[]>(def.publicPath));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load.');
    }
  }, [def.publicPath]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!rows) return null;
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      def.columns.some((column) => String(row[column] ?? '').toLowerCase().includes(q)),
    );
  }, [rows, query, def.columns]);

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await adminFetch(`${def.apiPath}/${deleting.id}`, { method: 'DELETE' });
      setDeleting(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed.');
    } finally {
      setBusy(false);
    }
  }

  const labelSingular = def.label.replace(/s$/, '').toLowerCase();

  return (
    <div className="px-6 py-8 lg:px-10">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-[-0.01em] text-fg">{def.label}</h1>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-soft">
            {rows ? `${rows.length} entries` : 'loading'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <AdminIcon
              name="search"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-soft/60"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${def.label.toLowerCase()}…`}
              className={`${adminInput} w-56 pl-10`}
            />
          </div>
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
          >
            <AdminIcon name="plus" className="h-3.5 w-3.5" /> Add {labelSingular}
          </button>
        </div>
      </div>

      {error ? (
        <p className="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </p>
      ) : null}

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-line">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-ink-raised/70">
                {def.columns.map((column) => (
                  <th
                    key={column}
                    className="px-5 py-3.5 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-fg-soft"
                  >
                    {column.replace(/([A-Z])/g, ' $1')}
                  </th>
                ))}
                <th className="w-28 px-5 py-3.5 text-right font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-fg-soft">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered === null ? (
                [...Array(4)].map((_, index) => (
                  <tr key={index} className="border-b border-line last:border-b-0">
                    <td colSpan={def.columns.length + 1} className="px-5 py-4">
                      <div className="h-4 w-2/3 animate-pulse rounded bg-fg/5" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={def.columns.length + 1}
                    className="px-5 py-14 text-center text-sm text-fg-soft"
                  >
                    {query
                      ? `Nothing matches “${query}”.`
                      : `No ${def.label.toLowerCase()} yet — add the first one.`}
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-line transition-colors last:border-b-0 hover:bg-fg/[0.03]"
                  >
                    {def.columns.map((column, columnIndex) => (
                      <td
                        key={column}
                        className={`px-5 py-4 ${columnIndex === 0 ? 'font-medium text-fg' : 'text-fg-soft'}`}
                      >
                        {cellText(row[column])}
                      </td>
                    ))}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditing(row)}
                          title="Edit"
                          aria-label={`Edit ${cellText(row[def.columns[0]])}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-fg-soft transition-colors hover:border-accent hover:text-accent"
                        >
                          <AdminIcon name="edit" className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleting(row)}
                          title="Delete"
                          aria-label={`Delete ${cellText(row[def.columns[0]])}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-fg-soft transition-colors hover:border-rose-400 hover:text-rose-400"
                        >
                          <AdminIcon name="trash" className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / edit */}
      <ResourceModal
        def={def}
        row={editing}
        open={creating || editing !== null}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        onSaved={() => {
          setCreating(false);
          setEditing(null);
          void load();
        }}
      />

      {/* Delete confirmation */}
      <ConfirmModal
        open={deleting !== null}
        busy={busy}
        onCancel={() => setDeleting(null)}
        onConfirm={() => void confirmDelete()}
        title={`Delete this ${labelSingular}?`}
        detail={
          deleting
            ? `“${cellText(deleting[def.columns[0]])}” will be removed permanently. The live site updates within a minute.`
            : undefined
        }
      />
    </div>
  );
}
