import Link from 'next/link';
import { Container } from '@/components/container';
import { Button } from '@/components/button';

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] items-center bg-surface py-24">
      <Container className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">404</p>
        <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink-soft">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
        </p>
        <div className="mt-8 flex justify-center">
          <Button href="/" variant="primary">
            Back to home
          </Button>
        </div>
      </Container>
    </main>
  );
}
