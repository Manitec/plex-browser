'use client';
import React from 'react';

const SOURCE_LABEL = {
  plex: { label: 'Plex', color: 'text-violet-400', dot: 'bg-violet-400' },
  ddg:  { label: 'DuckDuckGo', color: 'text-orange-400', dot: 'bg-orange-400' },
};

export default function SearchResults({ query, results, source, loading, error, onNavigate }) {
  const meta = SOURCE_LABEL[source] ?? SOURCE_LABEL.ddg;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          <span className="text-sm">
            {source === 'plex' ? 'Plex is searching…' : 'Searching…'}
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-sm mb-1">Search failed</p>
          <p className="text-gray-600 text-xs">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs font-medium ${meta.color} flex items-center gap-1.5`}>
          <span className={`w-1.5 h-1.5 rounded-full ${meta.dot} inline-block`} />
          {meta.label}
        </span>
        <span className="text-xs text-gray-600">— {results.length} results for “{query}”</span>
      </div>

      {results.length === 0 && (
        <p className="text-gray-600 text-sm text-center mt-12">No results found.</p>
      )}

      <ul className="space-y-5">
        {results.map((r, i) => (
          <li key={i}>
            <button
              onClick={() => onNavigate(r.url)}
              className="text-left w-full group"
            >
              <p className="text-xs text-gray-500 truncate mb-0.5">{r.url}</p>
              <p className="text-sm font-medium text-emerald-400 group-hover:text-emerald-300 group-hover:underline leading-snug">
                {r.title}
              </p>
              {r.description && (
                <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-3">{r.description}</p>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
