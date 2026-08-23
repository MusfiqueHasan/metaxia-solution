'use client';

import { useEffect } from 'react';
import { Container } from '@/components/container';
import { Button } from '@/components/button';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] items-center bg-surface py-24">
      <Container className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Error</p>
        <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          Something went wrong
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink-soft">
          We hit an unexpected error. Try again, or head back to the homepage.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-full border border-ink/15 px-6 py-3 text-sm font-medium tracking-tight text-ink transition-colors hover:bg-ink/5"
          >
            Try again
          </button>
          <Button href="/" variant="primary">
            Back to home
          </Button>
        </div>
      </Container>
    </main>
  );
}
