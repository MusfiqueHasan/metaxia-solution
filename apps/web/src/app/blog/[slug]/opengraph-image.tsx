import { ImageResponse } from 'next/og';
import { getPost } from '@/lib/api';
import { site } from '@/lib/site';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

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
        <div style={{ width: 72, height: 8, background: '#e5793a', borderRadius: 4, display: 'flex' }} />
        {post ? (
          <>
            <div
              style={{
                marginTop: 40,
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#e5793a',
                display: 'flex',
              }}
            >
              {post.category}
            </div>
            <div
              style={{
                marginTop: 20,
                fontSize: 60,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                display: 'flex',
              }}
            >
              {post.title}
            </div>
          </>
        ) : (
          <div style={{ marginTop: 40, fontSize: 88, fontWeight: 600, letterSpacing: '-0.02em', display: 'flex' }}>
            Metaxia
          </div>
        )}
        <div style={{ marginTop: 'auto', fontSize: 28, color: 'rgba(255,255,255,0.6)', display: 'flex' }}>
          {site.name}
        </div>
      </div>
    ),
    { ...size },
  );
}
