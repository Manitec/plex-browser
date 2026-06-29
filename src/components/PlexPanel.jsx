'use client';
import React from 'react';

function proxyImage(url) {
  if (!url) return null;
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

export default function PlexPanel({ currentUrl, pageMeta, onClose }) {
  const [prompt, setPrompt]     = React.useState('');
  const [response, setResponse] = React.useState(null);
  const [thinking, setThinking] = React.useState(false);
  const [err, setErr]           = React.useState(null);
  const [observeResult, setObserveResult] = React.useState(null);
  const [observing, setObserving]         = React.useState(false);

  React.useEffect(() => {
    setResponse(null); setErr(null); setPrompt('');
    setObserveResult(null);
  }, [currentUrl]);

  // Ask Plex — vision path (OG image) via /api/see → /api/observe
  const askPlex = async () => {
    if (!currentUrl) return;
    setThinking(true); setErr(null); setResponse(null);
    try {
      const res = await fetch('/api/see', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: currentUrl,
          title: pageMeta?.title || null,
          imageUrl: pageMeta?.image || null,
          pageText: pageMeta?.description || null,
          prompt: prompt.trim() || null,
          source: 'plex-browser',
          sessionId: 'joe',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Plex error');
      setResponse(data.response);
    } catch (e) { setErr(e.message); }
    finally { setThinking(false); }
  };

  // Plex Observe — text/URL context path, also via /api/see → /api/observe
  const observePage = async () => {
    if (!currentUrl) return;
    setObserving(true); setObserveResult(null);
    try {
      const res = await fetch('/api/see', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: currentUrl,
          title: pageMeta?.title || '',
          pageText: pageMeta?.description || '',
          source: 'plex-browser',
          sessionId: 'joe',
        }),
      });
      const data = await res.json();
      if (data.response) setObserveResult(data.response);
      else throw new Error(data.error || 'No response');
    } catch (e) { setObserveResult('Error: ' + e.message); }
    finally { setObserving(false); }
  };

  const proxiedImage = proxyImage(pageMeta?.image);

  return (
    <aside className="w-72 flex-shrink-0 bg-gray-900 border-l border-gray-800 flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-emerald-400">
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <span className="text-sm font-semibold text-white">Plex sees</span>
        </div>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-400 transition-colors p-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {pageMeta && (
        <div className="px-3 py-2.5 border-b border-gray-800/60">
          {proxiedImage && (
            <img src={proxiedImage} alt="page preview"
              className="w-full h-28 object-cover rounded-md mb-2"
              onError={e => { e.target.style.display = 'none'; }}
            />
          )}
          {pageMeta.title && <p className="text-xs text-gray-200 font-medium leading-snug line-clamp-2">{pageMeta.title}</p>}
          {pageMeta.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-snug">{pageMeta.description}</p>}
        </div>
      )}

      <div className="px-3 py-3 border-b border-gray-800/60">
        <textarea
          value={prompt} onChange={e => setPrompt(e.target.value)}
          placeholder="Ask Plex something about this page… (optional)"
          rows={2}
          className="w-full bg-gray-800 border border-gray-700 rounded text-xs text-gray-200 placeholder-gray-600 px-2.5 py-2 resize-none focus:outline-none focus:border-emerald-500/60 transition-colors"
        />
        <button onClick={askPlex} disabled={thinking || !currentUrl}
          className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400 text-xs font-medium rounded transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {thinking
            ? <><svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Plex is seeing…</>
            : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>Ask Plex</>
          }
        </button>

        <button onClick={observePage} disabled={observing || !currentUrl}
          className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 hover:border-violet-500/60 text-violet-400 text-xs font-medium rounded transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {observing
            ? <><svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Observing…</>
            : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="2"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>Plex Observe</>
          }
        </button>
        {observeResult && (
          <div className="mt-2 text-xs text-violet-300 bg-violet-950/40 border border-violet-800/40 rounded p-2 leading-relaxed">{observeResult}</div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        {err && <p className="text-xs text-red-400 bg-red-950/40 border border-red-800/40 rounded p-2">{err}</p>}
        {!response && !thinking && !err && (
          <p className="text-xs text-gray-700 text-center mt-6 leading-relaxed">
            {currentUrl ? 'Press Ask Plex to let her see this page.' : 'Navigate somewhere first.'}
          </p>
        )}
        {response && <div className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">{response}</div>}
      </div>
    </aside>
  );
}
