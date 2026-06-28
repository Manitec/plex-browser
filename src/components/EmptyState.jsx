'use client';
const QUICK_LINKS = [
  { label: 'Google',      url: 'https://www.google.com',               icon: 'fa-magnifying-glass' },
  { label: 'Perplexity',  url: 'https://www.perplexity.ai',            icon: 'fa-star' },
  { label: 'GitHub',      url: 'https://github.com/Manitec',           icon: 'fa-code-branch' },
  { label: 'Vercel',      url: 'https://vercel.com/manitecs-projects', icon: 'fa-triangle' },
  { label: 'HuggingFace', url: 'https://huggingface.co',               icon: 'fa-robot' },
];
export default function EmptyState({ onNavigate }) {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" className="mx-auto mb-5 text-gray-700">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="1"/>
        </svg>
        <h2 className="text-xl font-bold text-white mb-1">plex-browser</h2>
        <p className="text-sm text-gray-500 mb-6">Browse the web. Ask Plex what she sees.</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {QUICK_LINKS.map(({ label, url, icon }) => (
            <button key={label} onClick={() => onNavigate(url)}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 border border-gray-800 hover:border-emerald-500/50 hover:text-white text-gray-400 text-xs rounded-lg transition-colors"
            ><i className={`fas ${icon} text-xs`} />{label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
