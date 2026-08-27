import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const API_URL = process.env.API_URL ?? 'http://localhost:4000';

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

const MAX_BYTES = 8 * 1024 * 1024;

/**
 * Admin image upload. The bearer token is validated against a guarded API
 * endpoint before anything touches disk; files land in public/projects and
 * the returned path plugs straight into previewImage/photoUrl fields.
 */
export async function POST(req: NextRequest) {
  const authorization = req.headers.get('authorization');
  if (!authorization) return NextResponse.json({ message: 'unauthorized' }, { status: 401 });

  // Validate the admin token by asking the API for a guarded resource.
  try {
    const check = await fetch(`${API_URL}/admin/contact-submissions`, {
      headers: { authorization },
    });
    if (check.status === 401) {
      return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ message: 'auth service unavailable' }, { status: 503 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ message: 'no file provided' }, { status: 400 });
  }

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json(
      { message: 'only jpeg, png, webp, or gif images are allowed' },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ message: 'file exceeds the 8MB limit' }, { status: 400 });
  }

  const base = (file.name.replace(/\.[^.]+$/, '') || 'upload')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  const filename = `${base || 'upload'}-${Date.now().toString(36)}${ext}`;

  const dir = path.join(process.cwd(), 'public', 'projects');
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: `/projects/${filename}` }, { status: 201 });
}
