import { NextResponse } from 'next/server';

export async function POST(request) {
  let url;
  try { ({ url } = await request.json()); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'text/html' },
      signal: AbortSignal.timeout(10000),
    });
    const html = await res.text();
    const get = (pattern) => { const m = html.match(pattern); return m ? m[1] : null; };
    const title =
      get(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
      get(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i) ||
      get(/<title[^>]*>([^<]+)<\/title>/i) || null;
    const description =
      get(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
      get(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) || null;
    const image =
      get(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      get(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) || null;
    return NextResponse.json({ title, description, image });
  } catch { return NextResponse.json({ title: null, description: null, image: null }); }
}
