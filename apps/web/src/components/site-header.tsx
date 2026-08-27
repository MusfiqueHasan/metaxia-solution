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

  useEffect(() => {
    const onScroll = () => setRaised(window.scrollY > 40);
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

  const pill = raised && !open;

  // The admin panel runs its own chrome.
  if (pathname.startsWith('/admin')) return null;

  return (
    // The header morphs: full-width and transparent at the top of the page,
    // shrinking into a centered floating pill once scrolling starts. The
    // overlay menu lives OUTSIDE the pill (a backdrop-filtered element would
    // otherwise become the containing block for the fixed overlay).
    <header className="fixed inset-x-0 top-0 z-50 px-4">
      {/* Every animated property here interpolates (lengths, radius, colors)
          — no keyword values like max-w-fit, which snap instead of tween. */}
      <div
        className={`mx-auto flex w-full items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          pill
            ? 'mt-3 h-14 max-w-[36rem] rounded-full border border-line-strong bg-ink/85 px-6 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl'
            : 'mt-0 h-[4.5rem] max-w-6xl rounded-[2rem] border border-transparent bg-transparent px-2 shadow-none lg:px-4'
        }`}
      >
        <Link
          href="/"
          className={`relative z-50 flex items-center gap-2 font-display tracking-tight text-fg transition-all duration-500 ${
            pill ? 'text-lg' : 'text-xl'
          }`}
        >
          Metaxia
          <span className="h-1.5 w-1.5 rotate-45 bg-accent" aria-hidden="true" />
        </Link>

        <nav
          className={`hidden items-center transition-[gap] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:flex ${
            pill ? 'gap-5' : 'gap-8'
          }`}
          aria-label="Primary"
        >
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`link-rule font-medium transition-colors duration-300 ${
                  pill ? 'text-[13px]' : 'text-sm'
                } ${active ? 'text-fg' : 'text-fg-soft hover:text-fg'}`}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Button href="/contact" magnetic className={pill ? '!px-5 !py-2 !text-[13px]' : ''}>
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
      </div>

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
                <span className="font-display text-4xl tracking-[-0.01em] text-fg transition-colors group-hover:text-accent">
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
