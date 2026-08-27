import type { CSSProperties } from 'react';

/** Portrait photos per team slug (files in public/projects). */
export const TEAM_PHOTOS: Record<string, string> = {
  'musfique-hasan': '/projects/founder.jpeg',
  'efter-jahan-ema': '/projects/co-founder.png',
};

/**
 * Per-portrait framing fixes. Efter's photo is a full upper-body cutout on a
 * transparent background — the circle gets a white fill and the image zooms
 * to a head-and-shoulders crop so both portraits read at the same distance.
 */
export const TEAM_PHOTO_FRAME: Record<
  string,
  { circle?: CSSProperties; img?: CSSProperties }
> = {
  'efter-jahan-ema': {
    circle: { backgroundColor: '#ffffff' },
    img: { transform: 'scale(1.6)', transformOrigin: '50% 14%' },
  },
};

export interface ProfileExperience {
  role: string;
  org: string;
  period: string;
}

export interface TeamProfile {
  experience: ProfileExperience[];
  skills: { label: string; value: number }[];
  quote: string;
}

/* Editable profile extras (placeholder facts — adjust freely). */
export const TEAM_PROFILE: Record<string, TeamProfile> = {
  'musfique-hasan': {
    experience: [
      { role: 'Founder & CTO', org: 'Metaxia Solutions', period: '2024 — present' },
      { role: 'Lead Engineer', org: 'Enterprise SaaS', period: '2020 — 2024' },
      { role: 'Software Engineer', org: 'Fintech platforms', period: '2016 — 2020' },
    ],
    skills: [
      { label: 'Cloud architecture', value: 90 },
      { label: 'Backend systems', value: 88 },
      { label: 'AI integration', value: 76 },
    ],
    quote: 'The systems worth building are the ones still running quietly two years later.',
  },
  'efter-jahan-ema': {
    experience: [
      { role: 'Co-Founder & CEO', org: 'Metaxia Solutions', period: '2024 — present' },
      { role: 'Full-Stack Developer', org: 'Product studios & platforms', period: '2021 — 2024' },
      { role: 'Frontend Developer', org: 'Agency engagements', period: '2019 — 2021' },
    ],
    skills: [
      { label: 'Full-stack delivery', value: 92 },
      { label: 'Product engineering', value: 85 },
      { label: 'Interface implementation', value: 82 },
    ],
    quote: 'Every case study on this site shipped because someone owned it end to end.',
  },
};

export const SOCIAL_ICONS = [
  {
    key: 'x',
    label: 'X',
    path: 'M4 4l7.2 9.3L4.4 20h2.1l5.6-5.6L16.8 20H20l-7.5-9.7L18.9 4h-2.1l-5.1 5.1L7.2 4H4z',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    path: 'M13.5 20v-6.5H16l.5-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.7V20h2.8z',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    path: 'M6.5 8.8H3.7V20h2.8V8.8zM5.1 7.6a1.66 1.66 0 1 0 0-3.3 1.66 1.66 0 0 0 0 3.3zM20.3 13.9c0-3.1-1.7-4.6-3.9-4.6-1.8 0-2.6 1-3 1.7V8.8h-2.8V20h2.8v-5.9c0-1.6.8-2.5 2-2.5s1.9.9 1.9 2.5V20h3v-6.1z',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    path: 'M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6zm0 6.2a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8zM16.4 4H7.6A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4zm2.2 12.4a2.2 2.2 0 0 1-2.2 2.2H7.6a2.2 2.2 0 0 1-2.2-2.2V7.6a2.2 2.2 0 0 1 2.2-2.2h8.8a2.2 2.2 0 0 1 2.2 2.2v8.8zM17 6.6a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8z',
  },
];
