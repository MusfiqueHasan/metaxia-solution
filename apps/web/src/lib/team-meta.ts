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
