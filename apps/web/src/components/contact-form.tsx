'use client';

import { useState, type FormEvent } from 'react';

type FormState = 'idle' | 'sending' | 'sent' | 'error';

interface Fields {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const emptyFields: Fields = { name: '', email: '', phone: '', message: '' };

const inputClass =
  'mt-2.5 w-full rounded-2xl border border-line-strong bg-ink px-4.5 py-3 text-sm text-fg placeholder:text-fg-soft/50 transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_4px_var(--color-accent-soft)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60';

const labelClass =
  'font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-fg-soft';

function toMessages(message: unknown): string[] {
  if (Array.isArray(message)) return message.map(String);
  if (typeof message === 'string' && message.length > 0) return [message];
  return ['Something went wrong. Please try again.'];
}

export function ContactForm() {
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [state, setState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<string[]>([]);

  const sending = state === 'sending';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('sending');
    setErrors([]);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: fields.name,
          email: fields.email,
          phone: fields.phone || undefined,
          message: fields.message,
        }),
      });

      if (res.ok) {
        setState('sent');
        return;
      }

      const data = await res.json().catch(() => ({}));
      setErrors(toMessages(data.message));
      setState('error');
    } catch {
      setErrors(['We could not reach the server. Please try again in a moment.']);
      setState('error');
    }
  }

  if (state === 'sent') {
    return (
      <div
        className="rounded-[2rem] bg-gradient-to-br from-accent/40 via-line to-accent/20 p-px"
        aria-live="polite"
      >
        <div className="relative overflow-clip rounded-[calc(2rem-1px)] bg-ink-raised p-10 text-center lg:p-14">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-[70px]"
          />
          <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 bg-accent-soft text-accent">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
              <path
                d="M5 12.5 9.5 17 19 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h3 className="relative mt-7 font-display text-3xl tracking-[-0.01em] text-fg">
            Message received.
          </h3>
          <p className="relative mx-auto mt-4 max-w-sm text-sm leading-relaxed text-fg-soft">
            Thanks for reaching out — a founder will read this today and reply within one
            business day with concrete next steps.
          </p>
          <p className="relative mt-8 font-mono text-[10px] uppercase tracking-[0.24em] text-fg-soft/60">
            Step 1 of 3 — done
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] bg-gradient-to-br from-accent/40 via-line to-accent/20 p-px">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="relative overflow-clip rounded-[calc(2rem-1px)] bg-ink-raised p-8 lg:p-10"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-[70px]"
        />

        <div className="relative flex items-baseline justify-between gap-4">
          <h3 className="font-display text-2xl tracking-[-0.01em] text-fg">
            Start the conversation
          </h3>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-fg-soft/60 sm:block">
            ~2 min
          </span>
        </div>
        <p className="relative mt-2 text-sm text-fg-soft">
          Rough ideas welcome — we'll help you shape the brief.
        </p>

        <div className="relative mt-8 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className={labelClass}>
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              value={fields.name}
              onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
              disabled={sending}
              className={inputClass}
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label htmlFor="contact-email" className={labelClass}>
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={fields.email}
              onChange={(e) => setFields((f) => ({ ...f, email: e.target.value }))}
              disabled={sending}
              className={inputClass}
              placeholder="jane@company.com"
            />
          </div>
        </div>

        <div className="relative mt-5">
          <label htmlFor="contact-phone" className={labelClass}>
            Phone <span className="normal-case tracking-normal text-fg-soft/60">· optional</span>
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={fields.phone}
            onChange={(e) => setFields((f) => ({ ...f, phone: e.target.value }))}
            disabled={sending}
            className={inputClass}
            placeholder="+880 1XXX-XXXXXX"
          />
        </div>

        <div className="relative mt-5">
          <label htmlFor="contact-message" className={labelClass}>
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            value={fields.message}
            onChange={(e) => setFields((f) => ({ ...f, message: e.target.value }))}
            disabled={sending}
            className={`${inputClass} resize-none`}
            placeholder="Tell us about the project, timeline, and what you're trying to solve."
          />
        </div>

        <div className="relative mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={sending}
            className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-accent px-8 py-3.5 text-sm font-medium tracking-tight text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? 'Sending…' : 'Send message'}
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </button>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-soft/60">
            Replies within 1 business day
          </p>
        </div>

        <div aria-live="polite" className="relative mt-5">
          {state === 'error' ? (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3">
              <ul className="flex flex-col gap-1 text-sm text-rose-300">
                {errors.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </form>
    </div>
  );
}
