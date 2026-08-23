'use client';

import { useEffect, useState } from 'react';
import { adminFetch, useRequireAuth } from '@/lib/admin';

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
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function AdminInboxPage() {
  useRequireAuth();
  const [submissions, setSubmissions] = useState<ContactSubmission[] | null>(null);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminFetch<ContactSubmission[]>('/admin/contact-submissions')
      .then(setSubmissions)
      .catch(() => setError('Failed to load contact submissions.'));
    adminFetch<NewsletterSubscriber[]>('/admin/newsletter-subscribers')
      .then(setSubscribers)
      .catch(() => setError('Failed to load newsletter subscribers.'));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-medium tracking-tight text-ink">Inbox</h1>
      {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

      <section className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">Contact submissions</h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-ink/10 bg-surface-alt">
          <table className="min-w-full divide-y divide-ink/10 text-left text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-ink-soft">Name</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-ink-soft">Email</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-ink-soft">Phone</th>
                <th className="px-4 py-3 font-medium text-ink-soft">Message</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-ink-soft">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {submissions === null ? (
                <tr>
                  <td className="px-4 py-4 text-ink-soft" colSpan={5}>Loading…</td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-ink-soft" colSpan={5}>No submissions yet.</td>
                </tr>
              ) : (
                submissions.map((s) => (
                  <tr key={s.id}>
                    <td className="whitespace-nowrap px-4 py-3 text-ink">{s.name}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink">{s.email}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink">{s.phone ?? '—'}</td>
                    <td className="max-w-md px-4 py-3 text-ink-soft">{s.message}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{formatDate(s.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">Newsletter subscribers</h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-ink/10 bg-surface-alt">
          <table className="min-w-full divide-y divide-ink/10 text-left text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-ink-soft">Email</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-ink-soft">Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {subscribers === null ? (
                <tr>
                  <td className="px-4 py-4 text-ink-soft" colSpan={2}>Loading…</td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-ink-soft" colSpan={2}>No subscribers yet.</td>
                </tr>
              ) : (
                subscribers.map((s) => (
                  <tr key={s.id}>
                    <td className="whitespace-nowrap px-4 py-3 text-ink">{s.email}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{formatDate(s.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
