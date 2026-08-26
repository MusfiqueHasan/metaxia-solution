import Link from 'next/link';
import { Container } from '@/components/container';
import { NewsletterForm } from '@/components/newsletter-form';
import { site, footerLinks } from '@/lib/site';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="blueprint relative overflow-hidden border-t border-line bg-ink text-fg">
      <Container className="relative py-20 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[1.6fr_1fr_1fr_1.4fr]">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 font-display text-2xl font-medium tracking-tight"
            >
              Metaxia
              <span className="h-1.5 w-1.5 rotate-45 bg-accent" aria-hidden="true" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-fg-soft">{site.description}</p>
            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.25em] text-fg-soft/70">
              Dhaka · Remote · Worldwide
            </p>
          </div>

          <FooterColumn heading="Company" links={footerLinks.company} />
          <FooterColumn heading="Resources" links={footerLinks.resources} />

          <div>
            <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-fg-soft">
              Newsletter
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-fg-soft">
              Notes on shipping software, sent occasionally.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-line pt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-soft/80 sm:flex-row sm:items-center">
          <p>&copy; {year} Metaxia Solutions</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="transition-colors hover:text-fg">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-fg">
              Terms
            </Link>
          </div>
        </div>
      </Container>

      {/* Oversized wordmark bleeding off the bottom edge — the site signs itself. */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none overflow-hidden"
      >
        <p className="-mb-[0.26em] whitespace-nowrap text-center font-display text-[22vw] font-medium leading-none tracking-tight text-fg/[0.045]">
          Metaxia
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-fg-soft">
        {heading}
      </h3>
      <ul className="mt-5 flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="link-rule text-sm text-fg-soft transition-colors hover:text-fg"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
