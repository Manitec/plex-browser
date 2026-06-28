import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  if (!url) return new NextResponse('url required', { status: 400 });
  try {
    const res = await fetch(decodeURIComponent(url), {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(10000),
    });
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const body = await res.arrayBuffer();
    return new NextResponse(body, {
      headers: { 'Content-Type': contentType, 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=3600' },
    });
  } catch { return new NextResponse('fetch failed', { status: 502 }); }
}
