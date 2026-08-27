'use client';

import { useEffect, useState } from 'react';
import { adminFetch, useRequireAuth } from '@/lib/admin';
import { AdminIcon, adminInput } from '@/components/admin/ui';

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

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

const th =
  'px-5 py-3.5 text-left font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-fg-soft';

export default function AdminInboxPage() {
  useRequireAuth();
  const [submissions, setSubmissions] = useState<ContactSubmission[] | null>(null);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[] | null>(null);
  const [query, setQuery] = useState('');
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
  const filteredSubmissions = submissions?.filter(
    (item) =>
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      item.message.toLowerCase().includes(q),
  );

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-[-0.01em] text-fg">Inbox</h1>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-soft">
            {submissions ? `${submissions.length} messages` : 'loading'} ·{' '}
            {subscribers ? `${subscribers.length} subscribers` : 'loading'}
          </p>
        </div>
        <div className="relative">
          <AdminIcon
            name="search"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-soft/60"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages…"
            className={`${adminInput} w-56 pl-10`}
          />
        </div>
      </div>

      {error ? (
        <p className="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </p>
      ) : null}

      <h2 className="mt-8 font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-fg-soft">
        Contact messages
      </h2>
      <div className="mt-3 overflow-hidden rounded-2xl border border-line">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-ink-raised/70">
                <th className={th}>From</th>
                <th className={th}>Message</th>
                <th className={th}>Received</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions === undefined || filteredSubmissions === null ? (
                <tr>
                  <td colSpan={3} className="px-5 py-6">
                    <div className="h-4 w-1/2 animate-pulse rounded bg-fg/5" />
                  </td>
                </tr>
              ) : filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-12 text-center text-sm text-fg-soft">
                    {q ? `Nothing matches “${query}”.` : 'No messages yet.'}
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-line align-top transition-colors last:border-b-0 hover:bg-fg/[0.03]"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-fg">{item.name}</p>
                      <a href={`mailto:${item.email}`} className="text-accent hover:underline">
                        {item.email}
                      </a>
                      {item.phone ? <p className="text-fg-soft">{item.phone}</p> : null}
                    </td>
                    <td className="max-w-xl px-5 py-4 leading-relaxed text-fg-soft">
                      {item.message}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-fg-soft">
                      {formatDate(item.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <h2 className="mt-10 font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-fg-soft">
        Newsletter subscribers
      </h2>
      <div className="mt-3 overflow-hidden rounded-2xl border border-line">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-ink-raised/70">
              <th className={th}>Email</th>
              <th className={th}>Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {subscribers === null ? (
              <tr>
                <td colSpan={2} className="px-5 py-6">
                  <div className="h-4 w-1/3 animate-pulse rounded bg-fg/5" />
                </td>
              </tr>
            ) : subscribers.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-5 py-12 text-center text-sm text-fg-soft">
                  No subscribers yet.
                </td>
              </tr>
            ) : (
              subscribers.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-line transition-colors last:border-b-0 hover:bg-fg/[0.03]"
                >
                  <td className="px-5 py-4 font-medium text-fg">{item.email}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-fg-soft">
                    {formatDate(item.createdAt)}
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
