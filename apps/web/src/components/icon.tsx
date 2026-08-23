import type { ReactNode } from 'react';

export type IconKey = 'cloud' | 'code' | 'shield' | 'phone' | 'spark' | 'chart';

const paths: Record<IconKey, ReactNode> = {
  cloud: (
    <path
      d="M7.5 18.5h9a3.75 3.75 0 0 0 .5-7.47 5.25 5.25 0 0 0-10.13-1.9A4.25 4.25 0 0 0 7.5 18.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  code: (
    <path
      d="m9 8-4.5 4L9 16m6-8 4.5 4L15 16m-3-9-2 14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  shield: (
    <path
      d="M12 3.5 5 6v5.5c0 4.2 2.94 7.6 7 8.5 4.06-.9 7-4.3 7-8.5V6l-7-2.5Zm-2.5 8 1.8 1.8L15.5 9.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  phone: (
    <path
      d="M8.2 4.5h2.1l1 3.3-1.7 1.5a10.5 10.5 0 0 0 4.6 4.6l1.5-1.7 3.3 1v2.1c0 1-.85 1.8-1.85 1.7-6.1-.6-10.9-5.4-11.5-11.5-.1-1 .7-1.85 1.7-1.85Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  spark: (
    <path
      d="M12 3.5 13.6 9.5 19.5 11.2 13.6 12.9 12 19 10.4 12.9 4.5 11.2 10.4 9.5 12 3.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  ),
  chart: (
    <path
      d="M5 19V9.5M12 19V5m7 14v-7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
};

export function Icon({ name, className = 'h-5 w-5' }: { name: string; className?: string }) {
  const key = (name in paths ? name : 'spark') as IconKey;
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      {paths[key]}
    </svg>
  );
}
