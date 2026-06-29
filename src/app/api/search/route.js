import { NextResponse } from 'next/server';

// Scrapes DuckDuckGo HTML lite for clean JSON results — no API key needed
async function ddgSearch(query) {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`DDG returned ${res.status}`);
  const html = await res.text();

  const results = [];
  // Parse result blocks: <div class="result"> ... </div>
  const blockRe = /<div class="result[^"]*"[^>]*>(.*?)<\/div>\s*<\/div>/gs;
  const titleRe = /<a[^>]+class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i;
  const snippetRe = /<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>/i;

  let block;
  while ((block = blockRe.exec(html)) !== null && results.length < 10) {
    const chunk = block[1];
    const titleMatch = titleRe.exec(chunk);
    const snippetMatch = snippetRe.exec(chunk);
    if (!titleMatch) continue;

    // DDG wraps URLs — extract the actual ud= param
    let href = titleMatch[1];
    try {
      const uddUrl = new URL('https://duckduckgo.com' + href);
      const uddParam = uddUrl.searchParams.get('uddg') || uddUrl.searchParams.get('u3') || uddUrl.searchParams.get('u');
      if (uddParam) href = decodeURIComponent(uddParam);
    } catch { /* use raw href */ }

    const title = titleMatch[2].replace(/<[^>]+>/g, '').trim();
    const snippet = snippetMatch ? snippetMatch[1].replace(/<[^>]+>/g, '').trim() : '';

    if (title && href.startsWith('http')) {
      results.push({ title, url: href, description: snippet });
    }
  }
  return results;
}

export async function GET(request) {
  const q = new URL(request.url).searchParams.get('q');
  if (!q) return NextResponse.json({ error: 'q param required' }, { status: 400 });
  try {
    const results = await ddgSearch(q);
    return NextResponse.json({ results, source: 'ddg', query: q });
  } catch (err) {
    return NextResponse.json({ error: err.message, results: [] }, { status: 502 });
  }
}

export async function POST(request) {
  const { query, engine } = await request.json().catch(() => ({}));
  if (!query) return NextResponse.json({ error: 'query required' }, { status: 400 });

  // Plex engine — proxy to plex-sable Tavily search
  if (engine === 'plex') {
    try {
      const res = await fetch('https://plex-sable.vercel.app/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
        signal: AbortSignal.timeout(12000),
      });
      const data = await res.json();
      // Tavily returns [{title, url, content, score}] — normalise to our shape
      const results = Array.isArray(data)
        ? data.map(r => ({ title: r.title, url: r.url, description: r.content ?? '' }))
        : [];
      return NextResponse.json({ results, source: 'plex', query });
    } catch (err) {
      return NextResponse.json({ error: err.message, results: [] }, { status: 502 });
    }
  }

  // Default — DDG
  try {
    const results = await ddgSearch(query);
    return NextResponse.json({ results, source: 'ddg', query });
  } catch (err) {
    return NextResponse.json({ error: err.message, results: [] }, { status: 502 });
  }
}
