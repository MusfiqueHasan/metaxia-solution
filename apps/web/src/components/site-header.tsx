'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Container } from '@/components/container';
import { Button } from '@/components/button';
import { navLinks } from '@/lib/site';

export function SiteHeader() {
  const [raised, setRaised] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const onAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    const onScroll = () => setRaised(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the overlay on navigation and lock body scroll while it is open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    // NOTE: backdrop-blur is deliberately dropped while the overlay menu is
    // open — a backdrop-filtered ancestor becomes the containing block for
    // fixed descendants, which would clamp the full-screen menu to the
    // header's own height.
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ${
        open
          ? 'border-b border-line bg-ink'
          : raised || onAdmin
            ? 'border-b border-line bg-ink/85 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
      }`}
    >
      <Container className="flex h-[4.5rem] items-center justify-between">
        <Link
          href="/"
          className="relative z-50 flex items-center gap-2 font-display text-xl font-medium tracking-tight text-fg"
        >
          Metaxia
          <span className="h-1.5 w-1.5 rotate-45 bg-accent" aria-hidden="true" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`link-rule text-sm font-medium transition-colors duration-300 ${
                  active ? 'text-fg' : 'text-fg-soft hover:text-fg'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Button href="/contact" magnetic>
            Let&rsquo;s Talk
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-menu"
          className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full border border-line-strong text-fg lg:hidden"
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span className="relative block h-3 w-4" aria-hidden="true">
            <span
              className={`absolute left-0 top-0 h-px w-4 bg-current transition-transform duration-300 ${
                open ? 'translate-y-[5.5px] rotate-45' : ''
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-px w-4 bg-current transition-opacity duration-300 ${
                open ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-px w-4 bg-current transition-transform duration-300 ${
                open ? '-translate-y-[5.5px] -rotate-45' : ''
              }`}
            />
          </span>
        </button>
      </Container>

      {/* Full-screen overlay menu (mobile / tablet) */}
      <div
        id="site-menu"
        className={`fixed inset-0 z-40 flex flex-col bg-ink transition-opacity duration-500 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!open}
      >
        <Container className="flex flex-1 flex-col justify-center">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                tabIndex={open ? 0 : -1}
                className="group flex items-baseline gap-4 py-3"
                style={{
                  transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${80 + index * 55}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${80 + index * 55}ms`,
                  opacity: open ? 1 : 0,
                  transform: open ? 'none' : 'translateY(1.25rem)',
                }}
              >
                <span className="font-mono text-xs text-fg-soft">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-4xl font-medium tracking-tight text-fg transition-colors group-hover:text-accent">
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>
          <div
            className="mt-10"
            style={{
              transition: 'opacity 0.5s ease 0.45s',
              opacity: open ? 1 : 0,
            }}
          >
            <Button href="/contact" size="lg">
              Let&rsquo;s Talk
            </Button>
          </div>
        </Container>
      </div>
    </header>
  );
}
