'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { adminFetch, getToken, type ResourceDef, type FieldDef } from '@/lib/admin';
import { Modal, AdminIcon, adminInput, adminLabel } from '@/components/admin/ui';
import { RichText } from '@/components/admin/rich-text';

type Row = Record<string, unknown>;

function toIsoStringOrUndefined(value: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function toDatetimeLocal(value: unknown): string {
  if (typeof value !== 'string' || !value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function initialValue(field: FieldDef, row?: Row): string | boolean {
  const raw = row?.[field.name];
  switch (field.kind) {
    case 'boolean':
      return Boolean(raw);
    case 'list':
      return Array.isArray(raw) ? raw.join('\n') : '';
    case 'date':
      return toDatetimeLocal(raw);
    case 'number':
      return raw === undefined || raw === null ? '' : String(raw);
    default:
      return typeof raw === 'string' ? raw : '';
  }
}

/** Image field: current path, live thumbnail, and a real file upload. */
function ImageField({
  id,
  value,
  placeholder,
  onChange,
}: {
  id: string;
  value: string;
  placeholder?: string;
  onChange: (path: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setUploadError(null);
    try {
      const body = new FormData();
      body.append('file', file);
      const token = getToken();
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: token ? { authorization: `Bearer ${token}` } : undefined,
        body,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message ?? 'Upload failed.');
      onChange(data.url as string);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mt-2 flex items-start gap-4">
      <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-ink">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-fg-soft/50">
            No image
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <input
          id={id}
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={adminInput}
        />
        <div className="mt-2 flex items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line-strong bg-ink-raised px-3.5 py-1.5 text-xs font-medium text-fg transition-colors hover:border-accent hover:text-accent">
            <AdminIcon name="plus" className="h-3 w-3" />
            {uploading ? 'Uploading…' : 'Upload image'}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFile(file);
                e.target.value = '';
              }}
            />
          </label>
          {value ? (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-xs text-fg-soft transition-colors hover:text-rose-400"
            >
              Remove
            </button>
          ) : null}
        </div>
        {uploadError ? <p className="mt-1.5 text-xs text-rose-400">{uploadError}</p> : null}
      </div>
    </div>
  );
}

/**
 * Create/edit dialog for any admin resource. Field kinds render the right
 * control (text, textarea, number, toggle, list-as-lines, datetime, or the
 * rich-text editor for blog bodies); submit POSTs or PATCHes through the
 * admin proxy and hands control back to the list.
 */
export function ResourceModal({
  def,
  row,
  open,
  onClose,
  onSaved,
}: {
  def: ResourceDef;
  row: Row | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = Boolean(row);
  const [values, setValues] = useState<Record<string, string | boolean>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const next: Record<string, string | boolean> = {};
    for (const field of def.fields) next[field.name] = initialValue(field, row ?? undefined);
    setValues(next);
    setError(null);
  }, [open, def, row]);

  const set = (name: string, value: string | boolean) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload: Record<string, unknown> = {};
    for (const field of def.fields) {
      const value = values[field.name];
      switch (field.kind) {
        case 'boolean':
          payload[field.name] = Boolean(value);
          break;
        case 'number':
          payload[field.name] = Number(value || 0);
          break;
        case 'list':
          payload[field.name] = String(value ?? '')
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);
          break;
        case 'date': {
          const iso = toIsoStringOrUndefined(String(value ?? ''));
          if (iso !== undefined) payload[field.name] = iso;
          break;
        }
        default: {
          const text = String(value ?? '');
          if (text || !field.optional) payload[field.name] = text;
        }
      }
    }

    try {
      if (isEdit && row) {
        await adminFetch(`${def.apiPath}/${row.id as string}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch(def.apiPath, { method: 'POST', body: JSON.stringify(payload) });
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? `Edit ${def.label.replace(/s$/, '').toLowerCase()}` : `New ${def.label.replace(/s$/, '').toLowerCase()}`}
      wide
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          {def.fields.map((field) => {
            const value = values[field.name];
            const fullWidth =
              field.kind === 'textarea' ||
              field.kind === 'richtext' ||
              field.kind === 'list' ||
              field.kind === 'image';

            return (
              <div key={field.name} className={fullWidth ? 'sm:col-span-2' : ''}>
                {field.kind === 'boolean' ? (
                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-line-strong bg-ink px-4 py-3">
                    <span className={adminLabel}>{field.label}</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={Boolean(value)}
                      onClick={() => set(field.name, !value)}
                      className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${
                        value ? 'bg-accent' : 'bg-line-strong'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-300 ${
                          value ? 'translate-x-[22px]' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </label>
                ) : (
                  <>
                    <label htmlFor={`f-${field.name}`} className={adminLabel}>
                      {field.label}
                      {field.optional ? (
                        <span className="ml-2 normal-case tracking-normal text-fg-soft/60">
                          optional
                        </span>
                      ) : null}
                    </label>

                    {field.kind === 'image' ? (
                      <ImageField
                        id={`f-${field.name}`}
                        value={String(value ?? '')}
                        placeholder={field.placeholder}
                        onChange={(path) => set(field.name, path)}
                      />
                    ) : field.kind === 'richtext' ? (
                      <div className="mt-2">
                        <RichText
                          value={String(value ?? '')}
                          onChange={(html) => set(field.name, html)}
                        />
                      </div>
                    ) : field.kind === 'textarea' || field.kind === 'list' ? (
                      <textarea
                        id={`f-${field.name}`}
                        rows={field.kind === 'list' ? 4 : 5}
                        value={String(value ?? '')}
                        placeholder={field.placeholder}
                        onChange={(e) => set(field.name, e.target.value)}
                        className={`mt-2 ${adminInput}`}
                      />
                    ) : (
                      <input
                        id={`f-${field.name}`}
                        type={
                          field.kind === 'number'
                            ? 'number'
                            : field.kind === 'date'
                              ? 'datetime-local'
                              : 'text'
                        }
                        value={String(value ?? '')}
                        placeholder={field.placeholder}
                        required={!field.optional && field.kind !== 'date'}
                        onChange={(e) => set(field.name, e.target.value)}
                        className={`mt-2 ${adminInput}`}
                      />
                    )}

                    {field.kind === 'date' && field.optional && isEdit ? (
                      <p className="mt-1.5 text-xs text-fg-soft/70">
                        Leave blank to keep the current value.
                      </p>
                    ) : null}
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div aria-live="polite" className="min-h-5">
          {error ? <p className="text-sm text-rose-400">{error}</p> : null}
        </div>

        <div className="flex justify-end gap-3 border-t border-line pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-line-strong bg-ink-raised px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-ink"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-strong disabled:opacity-60"
          >
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
