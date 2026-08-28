'use client';

import { useEffect, useMemo, useState } from 'react';
import { adminFetch, useRequireAuth } from '@/lib/admin';
import { AdminIcon, Pagination, adminInput } from '@/components/admin/ui';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  createdAt: string;
}

interface NewsletterSubscriber {
  id: string;
  email: string;
  createdAt: string;
}

const PAGE_SIZE = 8;

const AVATAR_HUES = [
  'bg-orange-500/15 text-orange-600',
  'bg-amber-500/15 text-amber-600',
  'bg-rose-500/15 text-rose-500',
  'bg-emerald-500/15 text-emerald-600',
  'bg-violet-500/15 text-violet-500',
  'bg-teal-500/15 text-teal-600',
];

function avatarHue(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return AVATAR_HUES[Math.abs(hash) % AVATAR_HUES.length];
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]!.toUpperCase())
    .join('');
}

function timeAgo(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const seconds = Math.max(0, (Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 86400 * 7) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fullDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function AdminInboxPage() {
  useRequireAuth();
  const [submissions, setSubmissions] = useState<ContactSubmission[] | null>(null);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[] | null>(null);
  const [tab, setTab] = useState<'messages' | 'subscribers'>('messages');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminFetch<ContactSubmission[]>('/admin/contact-submissions')
      .then(setSubmissions)
      .catch(() => setError('Failed to load contact submissions.'));
    adminFetch<NewsletterSubscriber[]>('/admin/newsletter-subscribers')
      .then(setSubscribers)
      .catch(() => setError('Failed to load newsletter subscribers.'));
  }, []);

  const q = query.trim().toLowerCase();

  const filteredMessages = useMemo(
    () =>
      submissions?.filter(
        (item) =>
          !q ||
          item.name.toLowerCase().includes(q) ||
          item.email.toLowerCase().includes(q) ||
          item.message.toLowerCase().includes(q),
      ) ?? null,
    [submissions, q],
  );

  const filteredSubscribers = useMemo(
    () => subscribers?.filter((item) => !q || item.email.toLowerCase().includes(q)) ?? null,
    [subscribers, q],
  );

  const active = tab === 'messages' ? filteredMessages : filteredSubscribers;
  const pageCount = active ? Math.max(1, Math.ceil(active.length / PAGE_SIZE)) : 1;
  const safePage = Math.min(page, pageCount);
  const slice = (safePage - 1) * PAGE_SIZE;

  const tabs = [
    { key: 'messages' as const, label: 'Messages', count: submissions?.length },
    { key: 'subscribers' as const, label: 'Subscribers', count: subscribers?.length },
  ];

  return (
    <div className="px-6 py-8 lg:px-10">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-[-0.01em] text-fg">Inbox</h1>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-soft">
            Everything the site sends back
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="admin-float flex items-center gap-1 rounded-full border border-line bg-ink-raised p-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => {
                  setTab(t.key);
                  setPage(1);
                }}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                  tab === t.key
                    ? 'admin-gradient admin-glow text-white'
                    : 'text-fg-soft hover:text-fg'
                }`}
              >
                {t.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] tabular-nums ${
                    tab === t.key ? 'bg-white/20 text-white' : 'bg-accent-soft text-accent-strong'
                  }`}
                >
                  {t.count ?? '—'}
                </span>
              </button>
            ))}
          </div>
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
              placeholder={tab === 'messages' ? 'Search messages…' : 'Search subscribers…'}
              className={`${adminInput} w-56 !rounded-full pl-10`}
            />
          </div>
        </div>
      </div>

      {error ? (
        <p className="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-500">
          {error}
        </p>
      ) : null}

      {/* Messages: stacked letter cards */}
      {tab === 'messages' ? (
        <div className="mt-6 space-y-3">
          {filteredMessages === null ? (
            [...Array(3)].map((_, index) => (
              <div
                key={index}
                className="admin-float rounded-3xl border border-line bg-ink-raised p-6"
              >
                <div className="h-4 w-1/3 animate-pulse rounded bg-fg/5" />
                <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-fg/5" />
              </div>
            ))
          ) : filteredMessages.length === 0 ? (
            <div className="admin-float rounded-3xl border border-line bg-ink-raised px-6 py-16 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                <AdminIcon name="inbox" className="h-5 w-5" />
              </span>
              <p className="mt-4 text-sm text-fg-soft">
                {q ? `Nothing matches “${query}”.` : 'No messages yet — they land here.'}
              </p>
            </div>
          ) : (
            filteredMessages.slice(slice, slice + PAGE_SIZE).map((item) => (
              <article
                key={item.id}
                className="admin-card admin-float group rounded-3xl border border-line bg-ink-raised p-6 hover:border-accent/30"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-mono text-[13px] font-semibold ${avatarHue(item.email)}`}
                    >
                      {initials(item.name) || '?'}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-fg">{item.name}</p>
                      <div className="flex flex-wrap items-center gap-x-3 text-[13px]">
                        <a href={`mailto:${item.email}`} className="text-accent hover:underline">
                          {item.email}
                        </a>
                        {item.phone ? <span className="text-fg-soft">{item.phone}</span> : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <time
                      dateTime={item.createdAt}
                      title={fullDate(item.createdAt)}
                      className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-soft"
                    >
                      {timeAgo(item.createdAt)}
                    </time>
                    <a
                      href={`mailto:${item.email}?subject=${encodeURIComponent('Re: your message to Metaxia Solutions')}`}
                      className="flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-[12px] font-medium text-fg-soft opacity-0 transition-all hover:border-accent hover:text-accent group-hover:opacity-100"
                    >
                      <AdminIcon name="mail" className="h-3.5 w-3.5" /> Reply
                    </a>
                  </div>
                </div>
                <p className="mt-4 border-l-2 border-accent/30 pl-4 text-sm leading-relaxed text-fg-soft">
                  {item.message}
                </p>
              </article>
            ))
          )}
          {filteredMessages && filteredMessages.length > 0 ? (
            <div className="admin-float overflow-hidden rounded-3xl border border-line bg-ink-raised">
              <Pagination
                page={safePage}
                total={filteredMessages.length}
                pageSize={PAGE_SIZE}
                onPage={setPage}
              />
            </div>
          ) : null}
        </div>
      ) : (
        /* Subscribers: compact roster rows */
        <div className="admin-float mt-6 overflow-hidden rounded-3xl border border-line bg-ink-raised">
          {filteredSubscribers === null ? (
            <div className="p-6">
              <div className="h-4 w-1/3 animate-pulse rounded bg-fg/5" />
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                <AdminIcon name="mail" className="h-5 w-5" />
              </span>
              <p className="mt-4 text-sm text-fg-soft">
                {q ? `Nothing matches “${query}”.` : 'No subscribers yet.'}
              </p>
            </div>
          ) : (
            <>
              <ul>
                {filteredSubscribers.slice(slice, slice + PAGE_SIZE).map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-4 border-b border-line px-6 py-4 transition-colors last:border-b-0 hover:bg-accent-soft/30"
                  >
                    <div className="flex min-w-0 items-center gap-3.5">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-[12px] font-semibold ${avatarHue(item.email)}`}
                      >
                        {item.email[0]?.toUpperCase() ?? '?'}
                      </span>
                      <p className="truncate text-sm font-medium text-fg">{item.email}</p>
                    </div>
                    <time
                      dateTime={item.createdAt}
                      title={fullDate(item.createdAt)}
                      className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-soft"
                    >
                      {timeAgo(item.createdAt)}
                    </time>
                  </li>
                ))}
              </ul>
              <Pagination
                page={safePage}
                total={filteredSubscribers.length}
                pageSize={PAGE_SIZE}
                onPage={setPage}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
