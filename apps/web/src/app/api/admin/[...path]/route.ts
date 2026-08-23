import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL ?? 'http://localhost:4000';

const ALLOWED_ROOTS = new Set([
  'auth',
  'admin',
  'services',
  'case-studies',
  'posts',
  'team',
  'jobs',
  'pricing',
  'faq',
  'testimonials',
]);

async function proxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  if (path.some((seg) => seg === '' || seg === '.' || seg === '..')) {
    return NextResponse.json({ message: 'not found' }, { status: 404 });
  }
  if (!ALLOWED_ROOTS.has(path[0])) {
    return NextResponse.json({ message: 'not found' }, { status: 404 });
  }
  const target = `${API_URL}/${path.join('/')}`;
  const init: RequestInit = {
    method: req.method,
    headers: {
      'content-type': 'application/json',
      ...(req.headers.get('authorization') ? { authorization: req.headers.get('authorization')! } : {}),
    },
  };
  if (req.method !== 'GET' && req.method !== 'DELETE') init.body = await req.text();
  try {
    const res = await fetch(target, init);
    return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
  } catch {
    return NextResponse.json({ message: 'service unavailable' }, { status: 503 });
  }
}

export { proxy as GET, proxy as POST, proxy as PATCH, proxy as DELETE };
