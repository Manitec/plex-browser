'use client';
export default function Viewport({ iframeRef, iframeSrc, error, loading, onLoad, onError, emptyState }) {
  return (
    <div className="flex-1 flex flex-col min-w-0">
      {error && (
        <div className="mx-3 mt-3 p-3 bg-red-950 border border-red-800 text-red-400 rounded-lg text-sm">
          <i className="fas fa-exclamation-triangle mr-2" />{error}
        </div>
      )}
      {!iframeSrc && !loading && !error && emptyState}
      {iframeSrc && (
        <iframe
          ref={iframeRef} src={iframeSrc}
          className="flex-1 w-full border-0 bg-white"
          title="plex-browser viewport"
          sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          onLoad={onLoad} onError={onError}
        />
      )}
    </div>
  );
}
