import Link from 'next/link';
import { Container } from '@/components/container';
import { Button } from '@/components/button';
import { navLinks } from '@/lib/site';

export function SiteHeader() {
  return (
    <header className="grid-signature sticky top-0 z-50 border-b border-white/10 bg-ink/95 backdrop-blur">
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-medium tracking-tight text-white">
          Metaxia
          <span className="h-1.5 w-1.5 rotate-45 bg-accent" aria-hidden="true" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href="/contact" variant="primary">
            Let&rsquo;s Talk
          </Button>
        </div>

        <details className="group relative lg:hidden">
          <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-white/20 text-white [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Open menu</span>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </summary>
          <div className="absolute right-0 top-14 w-56 rounded-2xl border border-white/10 bg-ink p-4 shadow-none">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <Button href="/contact" variant="primary" className="mt-3 w-full">
              Let&rsquo;s Talk
            </Button>
          </div>
        </details>
      </Container>
    </header>
  );
}
