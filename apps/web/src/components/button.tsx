import Link from 'next/link';
import type { AnchorHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'ghost';

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: ButtonVariant;
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-tight transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white hover:bg-[#4338ca]',
  ghost:
    'border border-white/20 text-white hover:border-white/40 hover:bg-white/5 data-[on-light=true]:border-ink/15 data-[on-light=true]:text-ink data-[on-light=true]:hover:bg-ink/5',
};

export function Button({ href, variant = 'primary', className = '', children, ...rest }: ButtonProps) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </Link>
  );
}
