'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { adminFetch, type FieldDef, type ResourceDef } from '@/lib/admin';

type FormValue = string | boolean;
type FormState = Record<string, FormValue>;

interface Row {
  id: string;
  [key: string]: unknown;
}

const inputClass =
  'mt-1.5 w-full rounded-lg border border-ink/15 bg-surface px-3.5 py-2 text-sm text-ink placeholder:text-ink-soft/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60';

const labelClass = 'block text-sm font-medium text-ink';

function toIsoStringOrUndefined(value: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function isoToDatetimeLocal(value: unknown): string {
  if (typeof value !== 'string' || !value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function initialFormState(fields: FieldDef[], initial?: Row): FormState {
  const state: FormState = {};
  for (const field of fields) {
    const raw = initial?.[field.name];
    if (field.kind === 'boolean') {
      state[field.name] = Boolean(raw);
    } else if (field.kind === 'list') {
      state[field.name] = Array.isArray(raw) ? raw.join('\n') : '';
    } else if (field.kind === 'date') {
      state[field.name] = isoToDatetimeLocal(raw);
    } else if (field.kind === 'number') {
      state[field.name] = raw === undefined || raw === null ? '' : String(raw);
    } else {
      state[field.name] = typeof raw === 'string' ? raw : '';
    }
  }
  return state;
}

function serialize(fields: FieldDef[], state: FormState): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  for (const field of fields) {
    const value = state[field.name];
    if (field.kind === 'number') {
      payload[field.name] = Number(value);
    } else if (field.kind === 'boolean') {
      payload[field.name] = Boolean(value);
    } else if (field.kind === 'list') {
      payload[field.name] = String(value)
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    } else if (field.kind === 'date') {
      const iso = toIsoStringOrUndefined(String(value));
      if (iso) payload[field.name] = iso;
    } else {
      payload[field.name] = value;
    }
  }
  return payload;
}

export function ResourceForm({ def, initial }: { def: ResourceDef; initial?: Row }) {
  const router = useRouter();
  const [state, setState] = useState<FormState>(() => initialFormState(def.fields, initial));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(initial);

  function setField(name: string, value: FormValue) {
    setState((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const body = JSON.stringify(serialize(def.fields, state));
      if (isEdit && initial) {
        await adminFetch(`${def.apiPath}/${initial.id}`, { method: 'PATCH', body });
      } else {
        await adminFetch(def.apiPath, { method: 'POST', body });
      }
      router.push(`/admin/${def.key}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed.');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl rounded-2xl border border-ink/10 bg-surface-alt p-6">
      <div className="flex flex-col gap-5">
        {def.fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className={labelClass}>
              {field.label}
              {field.optional ? <span className="font-normal text-ink-soft"> (optional)</span> : null}
            </label>

            {field.kind === 'textarea' || field.kind === 'list' ? (
              <textarea
                id={field.name}
                rows={field.kind === 'list' ? 5 : 8}
                value={String(state[field.name] ?? '')}
                onChange={(e) => setField(field.name, e.target.value)}
                disabled={submitting}
                className={`${inputClass} resize-y`}
                required={!field.optional && field.kind !== 'list'}
              />
            ) : field.kind === 'boolean' ? (
              <input
                id={field.name}
                type="checkbox"
                checked={Boolean(state[field.name])}
                onChange={(e) => setField(field.name, e.target.checked)}
                disabled={submitting}
                className="mt-2 h-4 w-4 rounded border-ink/30 text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              />
            ) : field.kind === 'number' ? (
              <input
                id={field.name}
                type="number"
                value={String(state[field.name] ?? '')}
                onChange={(e) => setField(field.name, e.target.value)}
                disabled={submitting}
                className={inputClass}
                required={!field.optional}
              />
            ) : field.kind === 'date' ? (
              <>
                <input
                  id={field.name}
                  type="datetime-local"
                  value={String(state[field.name] ?? '')}
                  onChange={(e) => setField(field.name, e.target.value)}
                  disabled={submitting}
                  className={inputClass}
                  required={!field.optional}
                />
                {field.optional && isEdit ? (
                  <p className="mt-1.5 text-xs text-ink-soft">Leave blank to keep the current value.</p>
                ) : null}
              </>
            ) : (
              <input
                id={field.name}
                type="text"
                value={String(state[field.name] ?? '')}
                onChange={(e) => setField(field.name, e.target.value)}
                disabled={submitting}
                className={inputClass}
                required={!field.optional}
              />
            )}
          </div>
        ))}
      </div>

      {error ? <p className="mt-5 text-sm text-rose-600">{error}</p> : null}

      <div className="mt-7 flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create'}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/admin/${def.key}`)}
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-full border border-ink/15 px-6 py-2.5 text-sm font-medium text-ink hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
