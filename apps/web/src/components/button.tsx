import Link from 'next/link';
import type { ReactNode } from 'react';
import { Magnetic } from '@/components/motion/magnetic';

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  size?: 'md' | 'lg';
  /** Adds the magnetic cursor pull. Reserve for primary calls to action. */
  magnetic?: boolean;
  className?: string;
}

const variants = {
  primary:
    'bg-accent text-white hover:bg-accent-strong shadow-[0_0_32px_-12px_var(--color-accent)]',
  ghost:
    'border border-line-strong text-fg hover:border-fg/40 hover:bg-fg/5',
} as const;

const sizes = {
  md: 'px-5 py-2.5 text-sm sm:px-6 sm:py-3',
  lg: 'px-6 py-3 text-sm sm:px-8 sm:py-4 sm:text-base',
} as const;

export function Button({
  href,
  children,
  variant = 'primary',
  size = 'md',
  magnetic = false,
  className = '',
}: ButtonProps) {
  const link = (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2.5 rounded-full font-medium tracking-tight transition-colors duration-300 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      <span>{children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="none"
        className="h-3.5 w-3.5 -translate-x-0.5 transition-transform duration-300 ease-out group-hover:translate-x-0.5"
      >
        <path
          d="M2 8h11M9 3.5 13.5 8 9 12.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );

  return magnetic ? <Magnetic>{link}</Magnetic> : link;
}
