'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { adminFetch, useRequireAuth, RESOURCES } from '@/lib/admin';
import { AdminIcon } from '@/components/admin/ui';
import { AreaChart, BarList, DonutChart } from '@/components/admin/charts';

const CHIP_HUES = [
  'bg-orange-500/12 text-orange-600',
  'bg-amber-500/12 text-amber-600',
  'bg-rose-500/12 text-rose-500',
  'bg-emerald-500/12 text-emerald-600',
  'bg-violet-500/12 text-violet-500',
  'bg-teal-500/12 text-teal-600',
  'bg-fuchsia-500/12 text-fuchsia-500',
  'bg-yellow-500/12 text-yellow-600',
];

const PALETTE = ['#d97a2e', '#f0b35e', '#8b5cf6', '#10b981', '#f43f5e', '#14b8a6', '#d946ef', '#eab308'];

const DAYS = 14;

interface Stamped {
  createdAt: string;
}

/** Bucket timestamps into counts for the trailing N days (oldest first). */
function bucketByDay(items: Stamped[] | null, days: number): number[] {
  const counts = new Array(days).fill(0);
  if (!items) return counts;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (const item of items) {
    const date = new Date(item.createdAt);
    if (Number.isNaN(date.getTime())) continue;
    date.setHours(0, 0, 0, 0);
    const diff = Math.round((today.getTime() - date.getTime()) / 86400000);
    if (diff >= 0 && diff < days) counts[days - 1 - diff] += 1;
  }
  return counts;
}

function dayLabels(days: number): string[] {
  const out: string[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }
  return out;
}

export default function AdminDashboardPage() {
  useRequireAuth();
  const [counts, setCounts] = useState<Record<string, number | null>>({});
  const [messages, setMessages] = useState<Stamped[] | null>(null);
  const [subscribers, setSubscribers] = useState<Stamped[] | null>(null);
  const [categories, setCategories] = useState<Record<string, number>>({});

  useEffect(() => {
    for (const resource of RESOURCES) {
      adminFetch<Array<Record<string, unknown>>>(resource.publicPath)
        .then((rows) => {
          setCounts((prev) => ({ ...prev, [resource.key]: rows.length }));
          if (resource.key === 'posts') {
            const byCategory: Record<string, number> = {};
            for (const row of rows) {
              const category = typeof row.category === 'string' && row.category ? row.category : 'Other';
              byCategory[category] = (byCategory[category] ?? 0) + 1;
            }
            setCategories(byCategory);
          }
        })
        .catch(() => setCounts((prev) => ({ ...prev, [resource.key]: null })));
    }
    adminFetch<Stamped[]>('/admin/contact-submissions')
      .then(setMessages)
      .catch(() => undefined);
    adminFetch<Stamped[]>('/admin/newsletter-subscribers')
      .then(setSubscribers)
      .catch(() => undefined);
  }, []);

  const labels = useMemo(() => dayLabels(DAYS), []);
  const messageSeries = useMemo(() => bucketByDay(messages, DAYS), [messages]);
  const subscriberSeries = useMemo(() => bucketByDay(subscribers, DAYS), [subscribers]);

  const donutSlices = useMemo(
    () =>
      Object.entries(categories)
        .sort(([, a], [, b]) => b - a)
        .map(([label, value], index) => ({
          label,
          value,
          color: PALETTE[index % PALETTE.length],
        })),
    [categories],
  );

  const contentBars = RESOURCES.map((resource, index) => ({
    label: resource.label,
    value: counts[resource.key] ?? 0,
    color: PALETTE[index % PALETTE.length],
  }));

  const messagesThisWindow = messageSeries.reduce((sum, v) => sum + v, 0);

  return (
    <div className="px-6 py-8 lg:px-10">
      <h1 className="font-display text-3xl tracking-[-0.01em] text-fg">Dashboard</h1>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-soft">
        Content overview · live site updates within a minute of saving
      </p>

      {/* Stat cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {RESOURCES.map((resource, index) => (
          <Link
            key={resource.key}
            href={`/admin/${resource.key}`}
            className="admin-card admin-float group rounded-3xl border border-line bg-ink-raised p-5 hover:border-accent/40"
          >
            <div className="flex items-center justify-between">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-2xl ${CHIP_HUES[index % CHIP_HUES.length]}`}
              >
                <AdminIcon name={resource.key} className="h-4.5 w-4.5" />
              </span>
              <span
                aria-hidden="true"
                className="text-fg-soft/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent"
              >
                →
              </span>
            </div>
            <p className="mt-5 font-display text-4xl tabular-nums text-fg">
              {counts[resource.key] ?? '—'}
            </p>
            <p className="mt-1 text-sm text-fg-soft">{resource.label}</p>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <section className="admin-float rounded-3xl border border-line bg-ink-raised p-6 lg:col-span-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h2 className="font-display text-xl tracking-tight text-fg">Inbound activity</h2>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-soft">
                Last {DAYS} days
              </p>
            </div>
            <p className="text-sm text-fg-soft">
              <span className="font-display text-2xl tabular-nums text-fg">
                {messages ? messagesThisWindow : '—'}
              </span>{' '}
              messages
            </p>
          </div>
          <div className="mt-5">
            <AreaChart
              labels={labels}
              series={[
                { label: 'Contact messages', color: '#d97a2e', values: messageSeries },
                { label: 'Newsletter signups', color: '#8b5cf6', values: subscriberSeries },
              ]}
            />
          </div>
        </section>

        <section className="admin-float rounded-3xl border border-line bg-ink-raised p-6">
          <h2 className="font-display text-xl tracking-tight text-fg">Posts by category</h2>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-soft">
            Published writing
          </p>
          <div className="mt-6">
            {donutSlices.length > 0 ? (
              <DonutChart slices={donutSlices} centerLabel="posts" />
            ) : (
              <p className="py-12 text-center text-sm text-fg-soft">No posts yet.</p>
            )}
          </div>
        </section>
      </div>

      {/* Content mix + quick tiles */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <section className="admin-float rounded-3xl border border-line bg-ink-raised p-6">
          <h2 className="font-display text-xl tracking-tight text-fg">Content by type</h2>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-soft">
            Everything published to the site
          </p>
          <div className="mt-5">
            <BarList data={contentBars} />
          </div>
        </section>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <Link
            href="/admin/inbox"
            className="admin-card admin-float group flex flex-1 items-center justify-between rounded-3xl border border-line bg-ink-raised p-6 hover:border-accent/40"
          >
            <div className="flex items-center gap-4">
              <span className="admin-gradient admin-glow flex h-11 w-11 items-center justify-center rounded-2xl text-white">
                <AdminIcon name="inbox" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-fg">Contact messages</p>
                <p className="text-sm text-fg-soft">
                  {messages?.length ?? '—'} received · {subscribers?.length ?? '—'} newsletter
                  subscribers
                </p>
              </div>
            </div>
            <span aria-hidden="true" className="text-fg-soft/50 group-hover:text-accent">
              →
            </span>
          </Link>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="admin-card admin-float group flex flex-1 items-center justify-between rounded-3xl border border-line bg-ink-raised p-6 hover:border-accent/40"
          >
            <div className="flex items-center gap-4">
              <span className="admin-gradient admin-glow flex h-11 w-11 items-center justify-center rounded-2xl text-white">
                <AdminIcon name="eye" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-fg">View the live site</p>
                <p className="text-sm text-fg-soft">Opens in a new tab</p>
              </div>
            </div>
            <span aria-hidden="true" className="text-fg-soft/50 group-hover:text-accent">
              ↗
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
