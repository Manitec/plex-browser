'use client';
import React from 'react';

export default function Toolbar({
  inputValue, setInputValue, currentUrl, loading,
  canBack, canFwd, goBack, goForward, handleReset, handleSubmit, navigate,
  searchEngine, setSearchEngine, plexOpen, setPlexOpen,
  history, historyIndex,
}) {
  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10 shadow-lg">
      <div className="w-full px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center gap-1 sm:gap-2 mb-2">
          {/* Logo */}
          <div className="flex items-center gap-1.5 mr-2 flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-emerald-400">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span className="font-bold text-sm tracking-tight text-white">PLEX</span>
          </div>

          <NavBtn onClick={goBack}    disabled={!canBack}  title="Back"><i className="fas fa-arrow-left text-xs" /></NavBtn>
          <NavBtn onClick={goForward} disabled={!canFwd}   title="Forward"><i className="fas fa-arrow-right text-xs" /></NavBtn>
          <NavBtn onClick={() => currentUrl && navigate(currentUrl)} disabled={!currentUrl || loading} title="Reload">
            {loading ? <i className="fas fa-spinner fa-spin text-xs" /> : <i className="fas fa-redo text-xs" />}
          </NavBtn>
          <NavBtn onClick={handleReset} title="Home"><i className="fas fa-home text-xs" /></NavBtn>

          <div className="flex-1" />

          <select
            value={searchEngine} onChange={e => setSearchEngine(e.target.value)}
            className="text-xs border border-gray-700 rounded px-1.5 py-1 bg-gray-800 text-gray-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="google">Google</option>
            <option value="bing">Bing</option>
            <option value="duckduckgo">DDG</option>
            <option value="perplexity">Perplexity</option>
            <option value="brave">Brave</option>
          </select>

          <button
            onClick={() => setPlexOpen(o => !o)}
            title={plexOpen ? 'Close Plex panel' : 'Ask Plex about this page'}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
              plexOpen
                ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            Plex
          </button>

          {currentUrl && (
            <button
              onClick={() => window.open(currentUrl, '_blank', 'noopener,noreferrer')}
              className="px-2 py-1 text-xs bg-gray-800 text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded transition-colors"
              title="Open in real tab"
            >
              <i className="fas fa-external-link-alt" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            {currentUrl && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none">
                <i className="fas fa-lock text-xs" />
              </span>
            )}
            <input
              type="text" value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onFocus={e => e.target.select()}
              placeholder="Enter URL or search…"
              className={`w-full bg-gray-800 border border-gray-700 rounded-full py-1.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all ${currentUrl ? 'pl-8 pr-4' : 'px-4'}`}
              autoComplete="off" spellCheck={false}
            />
          </div>
          <button
            type="submit" disabled={loading || !inputValue.trim()}
            className="px-5 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-semibold text-sm rounded-full transition-colors flex-shrink-0"
          >Go</button>
        </form>

        {currentUrl && (
          <div className="mt-1.5 flex items-center text-xs text-gray-500 gap-1 overflow-hidden">
            <span className="truncate">{currentUrl}</span>
            <span className="flex-shrink-0 ml-auto text-gray-600">
              {history.length > 0 && `${historyIndex + 1} / ${history.length}`}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}

function NavBtn({ onClick, disabled, title, children }) {
  return (
    <button onClick={onClick} disabled={disabled} title={title}
      className={`p-2 rounded-lg text-sm transition-colors ${
        disabled ? 'text-gray-700 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`}
    >{children}</button>
  );
}
