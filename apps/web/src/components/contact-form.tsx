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
  'mt-2 w-full rounded-xl border border-line-strong bg-ink px-4 py-2.5 text-sm text-fg placeholder:text-fg-soft/60 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60';

const labelClass = 'text-sm font-medium text-fg';

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
      <div className="rounded-3xl border border-line bg-ink-raised p-8 lg:p-10" aria-live="polite">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path
              d="M5 12.5 9.5 17 19 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h3 className="mt-6 font-display text-xl font-medium tracking-tight text-fg">
          Message sent.
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-fg-soft">
          Thanks for reaching out — a member of our team will reply within one business day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-line bg-ink-raised p-8 lg:p-10"
    >
      <div className="grid gap-5 sm:grid-cols-2">
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

      <div className="mt-5">
        <label htmlFor="contact-phone" className={labelClass}>
          Phone <span className="font-normal text-fg-soft">(optional)</span>
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
          placeholder="+1 (555) 000-0000"
        />
      </div>

      <div className="mt-5">
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

      <button
        type="submit"
        disabled={sending}
        className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium tracking-tight text-white transition-colors duration-150 hover:bg-accent-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {sending ? 'Sending…' : 'Send message'}
      </button>

      <div aria-live="polite" className="mt-5">
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
  );
}
