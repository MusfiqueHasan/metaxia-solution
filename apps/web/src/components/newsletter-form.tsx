'use client';

import { useState, type FormEvent } from 'react';

type FormState = 'idle' | 'sending' | 'sent' | 'error';

function toMessages(message: unknown): string[] {
  if (Array.isArray(message)) return message.map(String);
  if (typeof message === 'string' && message.length > 0) return [message];
  return ['Something went wrong. Please try again.'];
}

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<string[]>([]);

  const sending = state === 'sending';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('sending');
    setErrors([]);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setState('sent');
        return;
      }

      const data = await res.json().catch(() => ({}));
      setErrors(toMessages(data.message));
      setState('error');
    } catch {
      setErrors(['We could not reach the server. Please try again.']);
      setState('error');
    }
  }

  if (state === 'sent') {
    return <p className="mt-4 text-sm leading-relaxed text-white/70">You&rsquo;re in. Watch your inbox.</p>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-4">
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={sending}
          placeholder="you@company.com"
          className="w-full min-w-0 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={sending}
          className="shrink-0 rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? 'Sending…' : 'Sign up'}
        </button>
      </div>

      <div aria-live="polite">
        {state === 'error' ? (
          <ul className="mt-3 flex flex-col gap-1 text-xs text-rose-300">
            {errors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </form>
  );
}
