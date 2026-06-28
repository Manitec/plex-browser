'use client';
import React from 'react';
import PlexPanel from '@/components/PlexPanel';
import Toolbar from '@/components/Toolbar';
import Viewport from '@/components/Viewport';
import EmptyState from '@/components/EmptyState';

const SEARCH_ENGINES = {
  google:     (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}`,
  bing:       (q) => `https://www.bing.com/search?q=${encodeURIComponent(q)}`,
  duckduckgo: (q) => `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
  perplexity: (q) => `https://www.perplexity.ai/search?q=${encodeURIComponent(q)}`,
  brave:      (q) => `https://search.brave.com/search?q=${encodeURIComponent(q)}`,
};

function isSearchQuery(input) {
  return !input.includes('.') && !input.startsWith('http');
}

export default function Browser() {
  const [inputValue, setInputValue]     = React.useState('');
  const [currentUrl, setCurrentUrl]     = React.useState('');
  const [iframeSrc, setIframeSrc]       = React.useState('');
  const [loading, setLoading]           = React.useState(false);
  const [error, setError]               = React.useState(null);
  const [history, setHistory]           = React.useState([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);
  const [searchEngine, setSearchEngine] = React.useState('google');
  const [plexOpen, setPlexOpen]         = React.useState(false);
  const [pageMeta, setPageMeta]         = React.useState(null);
  const iframeRef = React.useRef(null);

  React.useEffect(() => {
    if (!currentUrl) { setPageMeta(null); return; }
    fetch('/api/meta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: currentUrl }),
    }).then(r => r.json()).then(setPageMeta).catch(() => setPageMeta(null));
  }, [currentUrl]);

  const navigate = React.useCallback((targetUrl) => {
    if (!targetUrl) return;
    let fullUrl = targetUrl.trim();
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://'))
      fullUrl = 'https://' + fullUrl;
    const proxySrc = `/api/proxy?url=${encodeURIComponent(fullUrl)}`;
    setLoading(true); setError(null);
    setInputValue(fullUrl); setIframeSrc(proxySrc); setCurrentUrl(fullUrl);
    setHistory(prev => { const next = prev.slice(0, historyIndex + 1); next.push(fullUrl); return next; });
    setHistoryIndex(i => i + 1);
  }, [historyIndex]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = inputValue.trim();
    if (!val) return;
    if (isSearchQuery(val)) navigate(SEARCH_ENGINES[searchEngine](val));
    else navigate(val);
  };

  const goBack    = () => { if (historyIndex > 0) navigate(history[historyIndex - 1]); };
  const goForward = () => { if (historyIndex < history.length - 1) navigate(history[historyIndex + 1]); };
  const handleReset = () => {
    setCurrentUrl(''); setIframeSrc(''); setError(null);
    setInputValue(''); setPageMeta(null); setPlexOpen(false); setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <Toolbar
        inputValue={inputValue} setInputValue={setInputValue}
        currentUrl={currentUrl} loading={loading}
        canBack={historyIndex > 0} canFwd={historyIndex < history.length - 1}
        goBack={goBack} goForward={goForward} handleReset={handleReset}
        handleSubmit={handleSubmit} navigate={navigate}
        searchEngine={searchEngine} setSearchEngine={setSearchEngine}
        plexOpen={plexOpen} setPlexOpen={setPlexOpen}
        history={history} historyIndex={historyIndex}
      />
      {loading && (
        <div className="h-0.5 bg-gray-800 relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-y-0 bg-emerald-400 animate-[progress_1.4s_ease-in-out_infinite] w-1/3" />
          <style>{`@keyframes progress{0%{left:-33%}100%{left:100%}}`}</style>
        </div>
      )}
      <main className="flex-1 flex overflow-hidden" style={{ height: 'calc(100vh - 110px)' }}>
        <Viewport
          iframeRef={iframeRef} iframeSrc={iframeSrc}
          error={error} loading={loading}
          onLoad={() => setLoading(false)}
          onError={() => { setLoading(false); setError('Failed to load page.'); }}
          emptyState={<EmptyState onNavigate={navigate} />}
        />
        {plexOpen && (
          <PlexPanel
            currentUrl={currentUrl} pageMeta={pageMeta}
            onClose={() => setPlexOpen(false)}
          />
        )}
      </main>
    </div>
  );
}
