import Link from 'next/link';
import { Container } from '@/components/container';
import { site, footerLinks } from '@/lib/site';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="grid-signature border-t border-white/10 bg-ink text-white">
      <Container className="py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          <div>
            <Link href="/" className="flex items-center gap-2 font-display text-xl font-medium tracking-tight">
              Metaxia
              <span className="h-1.5 w-1.5 rotate-45 bg-accent" aria-hidden="true" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">{site.description}</p>
          </div>

          <FooterColumn heading="Company" links={footerLinks.company} />
          <FooterColumn heading="Resources" links={footerLinks.resources} />

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Newsletter</h3>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Notes on shipping software, sent occasionally.
            </p>
            {/* Wired up as a client component in Task 13. */}
            <form className="mt-4 flex gap-2" aria-disabled="true">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                disabled
                placeholder="you@company.com"
                className="w-full min-w-0 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled
                className="shrink-0 rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Sign up
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row sm:items-center">
          <p>&copy; {year} Metaxia Solutions. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">{heading}</h3>
      <ul className="mt-4 flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-white/70 transition-colors hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
