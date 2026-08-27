'use client';

import { useEffect, type ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/* Icons — one stroke-based set so the panel reads as one system.      */
/* ------------------------------------------------------------------ */

const ICON_PATHS: Record<string, string> = {
  dashboard: 'M4 4h7v7H4zM13 4h7v4h-7zM13 11h7v9h-7zM4 14h7v6H4z',
  services: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.9 2.9-2.4-2.4 2.3-2.5z',
  'case-studies': 'M4 8h16v11H4zM9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M4 12h16',
  posts: 'M5 4h11l3 3v13H5zM16 4v3h3M8 11h8M8 14h8M8 17h5',
  team: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a6 6 0 0 1 12 0M16 8a2.5 2.5 0 1 0 0-5M15.5 12.5A5 5 0 0 1 21 18',
  jobs: 'M4 8h16v11H4zM9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M12 12v3',
  pricing: 'M4 4h7l9 9-7 7-9-9zM8.5 8.5h.01',
  faq: 'M12 21a9 9 0 1 0-9-9c0 1.6.4 3.1 1.2 4.4L3 21l4.8-1.2A8.9 8.9 0 0 0 12 21zM9.8 9.5a2.3 2.3 0 0 1 4.5.7c0 1.5-2.2 2-2.2 3.1M12 16.5h.01',
  testimonials: 'M7 5h4v6H8a3 3 0 0 1-3-3V5h2zM16 5h4v6h-3a3 3 0 0 1-3-3V5h2zM7 11v2a4 4 0 0 1-2 3.4M16 11v2a4 4 0 0 1-2 3.4',
  inbox: 'M3 6h18v12H3zM3 7l9 6 9-6',
  logout: 'M9 4h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9M13 12H3M6 9l-3 3 3 3',
  search: 'M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM20 20l-4.5-4.5',
  plus: 'M12 5v14M5 12h14',
  edit: 'M5 19h3l10-10-3-3L5 16v3zM13 7l3 3',
  trash: 'M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13M10 11v5M14 11v5',
  close: 'M6 6l12 12M18 6L6 18',
  warning: 'M12 4 2.5 20h19L12 4zM12 10v5M12 18h.01',
  eye: 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z',
};

export function AdminIcon({ name, className = 'h-4 w-4' }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d={ICON_PATHS[name] ?? ICON_PATHS.dashboard}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Field styles shared by every admin form                             */
/* ------------------------------------------------------------------ */

export const adminInput =
  'w-full rounded-lg border border-line-strong bg-ink-raised px-3.5 py-2.5 text-sm text-fg shadow-[0_1px_2px_rgba(15,23,42,0.04)] placeholder:text-fg-soft/60 transition-[border-color,box-shadow] focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-soft)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60';

export const adminLabel =
  'font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-fg-soft';

/* ------------------------------------------------------------------ */
/* Modal shell — backdrop blur, ink panel, escape/backdrop to close.   */
/* ------------------------------------------------------------------ */

export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
      />
      <div
        className={`relative flex max-h-[88vh] w-full flex-col overflow-hidden rounded-2xl border border-line-strong bg-ink-raised shadow-[0_24px_80px_-24px_rgba(15,23,42,0.45)] ${
          wide ? 'max-w-3xl' : 'max-w-lg'
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-xl tracking-[-0.01em] text-fg">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-fg-soft transition-colors hover:border-accent hover:text-accent"
          >
            <AdminIcon name="close" className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Destructive-action confirmation                                     */
/* ------------------------------------------------------------------ */

export function ConfirmModal({
  open,
  onCancel,
  onConfirm,
  busy = false,
  title,
  detail,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  busy?: boolean;
  title: string;
  detail?: string;
}) {
  return (
    <Modal open={open} onClose={onCancel} title="Confirm deletion">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-400">
          <AdminIcon name="warning" className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-medium text-fg">{title}</p>
          {detail ? <p className="mt-1 text-sm leading-relaxed text-fg-soft">{detail}</p> : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-line-strong bg-ink-raised px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-ink"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-rose-500 disabled:opacity-60"
        >
          {busy ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
}
