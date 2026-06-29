import { NextRequest, NextResponse } from "next/server";

const PLEX_SABLE_OBSERVE = "https://plex-sable.vercel.app/api/observe";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

/**
 * /api/see — plex-browser
 *
 * Thin forwarder to plex-sable /api/observe.
 * Accepts both JSON (text/url context) and multipart (image uploads).
 * plex-sable handles model routing, Firestore logging, and sediment.
 *
 * JSON body:
 *   { url, title?, pageText?, selectedText?, prompt?, imageUrl?, source?, sessionId?, silent? }
 *
 * Multipart form:
 *   url, title, pageText, selectedText, prompt, imageUrl, image (File), source, sessionId, silent
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") ?? "";

    const upstreamRes = await fetch(PLEX_SABLE_OBSERVE, {
      method: "POST",
      headers: contentType ? { "content-type": contentType } : {},
      body: req.body,
      // @ts-expect-error duplex required for streaming body passthrough
      duplex: "half",
    });

    const data = await upstreamRes.json();
    return NextResponse.json(data, { status: upstreamRes.status, headers: CORS });
  } catch (err: any) {
    const detail = err?.message ?? String(err);
    console.error("plex-browser /api/see error:", detail);
    return NextResponse.json(
      { error: "Could not reach Plex", detail },
      { status: 502, headers: CORS }
    );
  }
}
