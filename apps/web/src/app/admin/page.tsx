'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { setToken } from '@/lib/admin';
import { adminInput, adminLabel, AdminIcon } from '@/components/admin/ui';
import { Starfield } from '@/components/motion/starfield';
import type { LoginResponse } from '@metaxia/shared';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof data.message === 'string' ? data.message : 'Login failed.');
      }
      setToken((data as LoginResponse).accessToken);
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-svh lg:grid-cols-[1.1fr_1fr]">
      {/* Left: the brand side — starfield, drifting sphere, wordmark, pitch */}
      <section className="grain relative hidden overflow-hidden border-r border-line bg-[#0b1220] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Starfield />
        <div aria-hidden="true" className="bg-dots absolute inset-0" />
        <div aria-hidden="true" className="aurora aurora--a" />
        <div
          aria-hidden="true"
          className="orb-3d drift-slow absolute right-[10%] top-[18%] h-48 w-48"
        />
        <div
          aria-hidden="true"
          className="plane-grid plane-grid--floor"
        />

        <p className="relative flex items-center gap-2 font-display text-2xl tracking-tight text-white">
          Metaxia
          <span className="h-1.5 w-1.5 rotate-45 bg-accent" aria-hidden="true" />
        </p>

        <div className="relative">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
            Mission control
          </p>
          <h1 className="mt-5 max-w-md font-display text-5xl leading-[1.05] tracking-[-0.01em] text-white">
            Everything the site shows,{' '}
            <em className="text-sky-300">run from here.</em>
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
            Case studies, services, writing, the team, and every inbound message — published to
            the live site within a minute of saving.
          </p>
        </div>

        <p className="relative font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
          Metaxia Solutions · content operations
        </p>
      </section>

      {/* Right: the sign-in */}
      <section className="flex items-center justify-center bg-ink px-6 py-16">
        <form onSubmit={handleSubmit} className="w-full max-w-sm" noValidate>
          <p className="flex items-center gap-2 font-display text-xl tracking-tight text-fg lg:hidden">
            Metaxia <span className="h-1.5 w-1.5 rotate-45 bg-accent" aria-hidden="true" />
          </p>

          <h2 className="mt-8 font-display text-3xl tracking-[-0.01em] text-fg lg:mt-0">
            Sign in
          </h2>
          <p className="mt-2 text-sm text-fg-soft">Use your admin credentials to continue.</p>

          <div className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className={adminLabel}>
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@metaxia.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                className={`mt-2 ${adminInput}`}
              />
            </div>

            <div>
              <label htmlFor="password" className={adminLabel}>
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                className={`mt-2 ${adminInput}`}
              />
            </div>
          </div>

          <div aria-live="polite" className="mt-4 min-h-5">
            {error ? (
              <p className="flex items-center gap-2 text-sm text-rose-400">
                <AdminIcon name="warning" className="h-4 w-4" /> {error}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="admin-gradient admin-glow mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
            <span aria-hidden="true">→</span>
          </button>

          <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-fg-soft/60">
            Authorized staff only
          </p>
        </form>
      </section>
    </main>
  );
}
