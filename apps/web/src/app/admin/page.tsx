'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { setToken } from '@/lib/admin';
import { adminLabel, AdminIcon } from '@/components/admin/ui';
import { Starfield } from '@/components/motion/starfield';
import type { LoginResponse } from '@metaxia/shared';

const fieldShell =
  'flex items-center gap-3 rounded-2xl border border-line-strong bg-white px-4 transition-[border-color,box-shadow] duration-200 focus-within:border-accent focus-within:shadow-[0_0_0_4px_var(--color-accent-soft)]';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      {/* Left: the brand side — night sky in the site's own palette */}
      <section className="grain relative hidden overflow-hidden bg-[#0a0c14] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Starfield />
        <div aria-hidden="true" className="bg-dots absolute inset-0" />
        <div
          aria-hidden="true"
          className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-[#e5793a]/14 blur-[110px]"
        />
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#f0b35e]/10 blur-[100px]"
        />
        <div
          aria-hidden="true"
          className="orb-3d drift-slow absolute right-[10%] top-[18%] h-48 w-48"
        />
        <div aria-hidden="true" className="plane-grid plane-grid--floor" />

        <p className="relative flex items-center gap-2 font-display text-2xl tracking-tight text-white">
          Metaxia
          <span className="h-1.5 w-1.5 rotate-45 bg-[#e5793a]" aria-hidden="true" />
        </p>

        <div className="relative">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-[#f0b35e]">
            Mission control
          </p>
          <h1 className="mt-5 max-w-md font-display text-5xl leading-[1.05] tracking-[-0.01em] text-white">
            Everything the site shows,{' '}
            <em className="text-[#f0b35e]">run from here.</em>
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
            Case studies, services, writing, the team, and every inbound message — published to
            the live site within a minute of saving.
          </p>
          <div className="mt-8 flex items-center gap-3">
            {['Content', 'Team', 'Inbox'].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-300 backdrop-blur"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        <p className="relative font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
          Metaxia Solutions · content operations
        </p>
      </section>

      {/* Right: the sign-in card */}
      <section className="relative flex items-center justify-center overflow-hidden bg-ink px-6 py-16">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/10 blur-[90px]"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-[#f0b35e]/10 blur-[90px]"
        />

        <form
          onSubmit={handleSubmit}
          noValidate
          className="admin-float relative w-full max-w-md rounded-[2rem] border border-line bg-ink-raised p-8 sm:p-10"
        >
          <div className="flex items-center gap-3">
            <span className="admin-gradient admin-glow flex h-11 w-11 items-center justify-center rounded-2xl font-display text-lg text-white">
              M
            </span>
            <div>
              <p className="font-display text-lg leading-tight tracking-tight text-fg">Metaxia</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-fg-soft">
                Admin console
              </p>
            </div>
          </div>

          <h2 className="mt-8 font-display text-3xl tracking-[-0.01em] text-fg">Welcome back</h2>
          <p className="mt-2 text-sm text-fg-soft">Sign in with your admin credentials.</p>

          <div className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className={adminLabel}>
                Email
              </label>
              <div className={`mt-2 ${fieldShell}`}>
                <AdminIcon name="mail" className="h-4 w-4 shrink-0 text-fg-soft/60" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@metaxia.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                  className="w-full bg-transparent py-3 text-sm text-fg outline-none placeholder:text-fg-soft/50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className={adminLabel}>
                Password
              </label>
              <div className={`mt-2 ${fieldShell}`}>
                <AdminIcon name="lock" className="h-4 w-4 shrink-0 text-fg-soft/60" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={submitting}
                  className="w-full bg-transparent py-3 text-sm text-fg outline-none placeholder:text-fg-soft/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="shrink-0 text-fg-soft/60 transition-colors hover:text-accent"
                >
                  <AdminIcon name="eye" className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div aria-live="polite" className="mt-4 min-h-5">
            {error ? (
              <p className="flex items-center gap-2 text-sm text-rose-500">
                <AdminIcon name="warning" className="h-4 w-4" /> {error}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="admin-gradient admin-glow mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
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
