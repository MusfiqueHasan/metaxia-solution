import type { ReactNode } from 'react';

export function Container({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-[var(--container-w,72rem)] px-6 lg:px-8 ${className}`}>{children}</div>;
}
