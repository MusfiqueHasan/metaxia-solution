import { Container } from '@/components/container';
import { Button } from '@/components/button';

export function ContactCta() {
  return (
    <section className="grid-signature border-t border-white/10 bg-ink py-24 text-white lg:py-28">
      <Container className="flex flex-col items-center text-center">
        <h2 className="max-w-2xl font-display text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">
          Let&rsquo;s build what&rsquo;s next.
        </h2>
        <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
          Tell us where you&rsquo;re headed — the full conversation starts on the contact page.
        </p>
        <div className="mt-9">
          <Button href="/contact" variant="primary">
            Let&rsquo;s Talk
          </Button>
        </div>
      </Container>
    </section>
  );
}
