import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#0B0F1A',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ width: 72, height: 8, background: '#4f46e5', borderRadius: 4, display: 'flex' }} />
        <div style={{ marginTop: 40, fontSize: 88, fontWeight: 600, letterSpacing: '-0.02em', display: 'flex' }}>
          Metaxia
        </div>
        <div style={{ marginTop: 20, fontSize: 32, color: 'rgba(255,255,255,0.65)', display: 'flex' }}>
          {site.description}
        </div>
      </div>
    ),
    { ...size },
  );
}
