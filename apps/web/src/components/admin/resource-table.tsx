'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminFetch, useRequireAuth, type ResourceDef } from '@/lib/admin';
import {
  AdminIcon,
  ConfirmModal,
  Pagination,
  adminInput,
  avatarHue,
  initials,
} from '@/components/admin/ui';
import { ResourceModal } from '@/components/admin/resource-form';

type Row = Record<string, unknown> & { id: string };

const PAGE_SIZE = 8;

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

/** Column-aware cell: lead columns get an avatar tile, slugs a mono chip,
 *  order numbers a circled badge, booleans a status pill, the rest a soft tag. */
function CellContent({
  column,
  columnIndex,
  value,
}: {
  column: string;
  columnIndex: number;
  value: unknown;
}) {
  const text = cellText(value);

  if (columnIndex === 0) {
    return (
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-mono text-[11px] font-semibold ${avatarHue(text)}`}
        >
          {initials(text) || '—'}
        </span>
        <span className="font-medium text-fg">{text}</span>
      </div>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
          value ? 'bg-emerald-500/12 text-emerald-600' : 'bg-fg/[0.05] text-fg-soft'
        }`}
      >
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 rounded-full ${value ? 'bg-emerald-500' : 'bg-fg-soft/50'}`}
        />
        {value ? 'Yes' : 'No'}
      </span>
    );
  }

  if (Array.isArray(value)) {
    return (
      <span className="inline-flex rounded-full bg-fg/[0.05] px-2.5 py-1 text-xs text-fg-soft">
        {text}
      </span>
    );
  }

  if (column === 'slug') {
    return (
      <code className="rounded-lg border border-line bg-fg/[0.03] px-2 py-1 font-mono text-[11px] text-fg-soft">
        {text}
      </code>
    );
  }

  if (column === 'order' || typeof value === 'number') {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft font-mono text-[11px] font-semibold text-accent-strong">
        {text}
      </span>
    );
  }

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return <span className="whitespace-nowrap text-[13px] text-fg-soft">{text}</span>;
  }

  if (value === null || value === undefined || text === '—') {
    return <span className="text-fg-soft/50">—</span>;
  }

  return (
    <span className="inline-flex max-w-full items-center truncate rounded-full bg-fg/[0.045] px-2.5 py-1 text-xs text-fg-soft">
      {text}
    </span>
  );
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
  const [page, setPage] = useState(1);
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

  // Clamp instead of storing: a shrinking result set (search, delete) can
  // strand `page` past the last page.
  const pageCount = filtered ? Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)) : 1;
  const safePage = Math.min(page, pageCount);
  const paged = filtered?.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE) ?? null;

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
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder={`Search ${def.label.toLowerCase()}…`}
              className={`${adminInput} w-56 !rounded-full pl-10`}
            />
          </div>
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="admin-gradient admin-glow inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
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
      <div className="admin-card admin-float mt-6 overflow-hidden rounded-3xl border border-line bg-ink-raised !transform-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                {def.columns.map((column, columnIndex) => (
                  <th
                    key={column}
                    className="px-5 py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-accent-strong/80"
                  >
                    <span className="inline-flex items-center gap-2">
                      {columnIndex === 0 ? (
                        <span
                          aria-hidden="true"
                          className="h-1 w-1 rotate-45 bg-accent/70"
                        />
                      ) : null}
                      {column.replace(/([A-Z])/g, ' $1')}
                    </span>
                  </th>
                ))}
                <th className="w-28 px-5 py-4 text-right font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-accent-strong/80">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered === null ? (
                [...Array(5)].map((_, index) => (
                  <tr key={index} className="border-b border-line last:border-b-0">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 animate-pulse rounded-xl bg-fg/5" />
                        <div className="h-4 w-40 animate-pulse rounded bg-fg/5" />
                      </div>
                    </td>
                    <td colSpan={def.columns.length} className="px-5 py-3.5">
                      <div className="h-4 w-1/2 animate-pulse rounded bg-fg/5" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={def.columns.length + 1} className="px-6 py-16 text-center">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                      <AdminIcon name={def.key} className="h-5 w-5" />
                    </span>
                    <p className="mt-4 text-sm text-fg-soft">
                      {query
                        ? `Nothing matches “${query}”.`
                        : `No ${def.label.toLowerCase()} yet — add the first one.`}
                    </p>
                  </td>
                </tr>
              ) : (
                paged!.map((row) => (
                  <tr
                    key={row.id}
                    className="group border-b border-line transition-[background-color,box-shadow] duration-200 last:border-b-0 hover:bg-accent-soft/35 hover:shadow-[inset_3px_0_0_var(--color-accent)]"
                  >
                    {def.columns.map((column, columnIndex) => (
                      <td key={column} className="px-5 py-3.5 align-middle">
                        <CellContent
                          column={column}
                          columnIndex={columnIndex}
                          value={row[column]}
                        />
                      </td>
                    ))}
                    <td className="px-5 py-3.5 align-middle">
                      <div className="flex justify-end gap-2 opacity-45 transition-opacity duration-200 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => setEditing(row)}
                          title="Edit"
                          aria-label={`Edit ${cellText(row[def.columns[0]])}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-ink-raised text-fg-soft transition-colors hover:border-accent hover:bg-accent-soft hover:text-accent"
                        >
                          <AdminIcon name="edit" className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleting(row)}
                          title="Delete"
                          aria-label={`Delete ${cellText(row[def.columns[0]])}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-ink-raised text-fg-soft transition-colors hover:border-rose-300 hover:bg-rose-500/10 hover:text-rose-500"
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
        {filtered ? (
          <Pagination
            page={safePage}
            total={filtered.length}
            pageSize={PAGE_SIZE}
            onPage={setPage}
          />
        ) : null}
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
