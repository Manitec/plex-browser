import { NextResponse } from 'next/server';

// Placeholder — wire to your preferred AI model (Groq, OpenRouter, etc)
export async function POST(request) {
  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { pageUrl, pageTitle, imageUrl, prompt } = body;
  if (!pageUrl) return NextResponse.json({ error: 'pageUrl required' }, { status: 400 });

  // TODO: replace with real AI call
  const contextPrompt = [
    prompt ? `User asks: ${prompt}` : 'Summarize this page for me.',
    `Page title: ${pageTitle || 'unknown'}`,
    `URL: ${pageUrl}`,
    imageUrl ? `OG image: ${imageUrl}` : null,
  ].filter(Boolean).join('\n');

  // Stub response — replace with fetch to Groq/OpenRouter/plex-sable
  return NextResponse.json({
    response: `[Plex /api/see stub]\n\nContext received:\n${contextPrompt}\n\nWire this route to your AI backend.`,
  });
}
