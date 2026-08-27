import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

/**
 * Runtime fallback for /projects/* images. Next only serves public/ assets
 * that existed at build time, so admin uploads landing after the build
 * would 404 in production — this route streams them from disk instead.
 * Files present at build time are still served statically and never
 * reach this handler.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  // No separators, no traversal — a bare filename only.
  if (!/^[a-zA-Z0-9._-]+$/.test(name) || name.includes('..')) {
    return NextResponse.json({ message: 'not found' }, { status: 404 });
  }

  const ext = path.extname(name).toLowerCase();
  const type = CONTENT_TYPES[ext];
  if (!type) return NextResponse.json({ message: 'not found' }, { status: 404 });

  try {
    const data = await readFile(path.join(process.cwd(), 'public', 'projects', name));
    return new NextResponse(new Uint8Array(data), {
      headers: {
        'content-type': type,
        'cache-control': 'public, max-age=3600',
      },
    });
  } catch {
    return NextResponse.json({ message: 'not found' }, { status: 404 });
  }
}
