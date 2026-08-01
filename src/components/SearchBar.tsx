import { useEffect, useRef, useState } from 'react';
import { searchMulti, getImageUrl } from '../services/tmdb';
import { useApp } from '../context/AppContext';
import { Search, X } from 'lucide-react';

const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useApp();
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { setStreamingItem } = useApp();

  useEffect(() => {
    if (!searchQuery.trim()) { setResults([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      const res = await searchMulti(searchQuery);
      setResults(res.filter((r: any) => r.backdrop_path || r.poster_path).slice(0, 8));
      setLoading(false);
    }, 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="search-wrap" ref={ref}>
      <div className={`search-box ${open ? 'open' : ''}`}>
        <Search size={16} className="search-icon" />
        <input
          className="search-input"
          placeholder="SEARCH TITLES..."
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
        {searchQuery && (
          <button className="search-clear" onClick={() => { setSearchQuery(''); setResults([]); }}>
            <X size={14} />
          </button>
        )}
      </div>

      {open && searchQuery && (
        <div className="search-dropdown">
          {loading && <div className="search-status">SCANNING NEURAL NET...</div>}
          {!loading && results.length === 0 && <div className="search-status">NO SIGNAL FOUND</div>}
          {results.map(r => (
            <div
              key={r.id}
              className="search-result"
              onClick={() => {
                setStreamingItem({ ...r, type: r.media_type === 'tv' ? 'tv' : 'movie' });
                setOpen(false);
                setSearchQuery('');
              }}
            >
              <img
                src={getImageUrl(r.backdrop_path || r.poster_path, 'w200')}
                className="search-result-thumb"
                alt=""
              />
              <div className="search-result-info">
                <div className="search-result-title">{r.title || r.name}</div>
                <div className="search-result-meta">
                  <span className="search-type-badge">{r.media_type?.toUpperCase()}</span>
                  {(r.release_date || r.first_air_date)?.split('-')[0]}
                  {r.vote_average ? ` • ⭐ ${r.vote_average.toFixed(1)}` : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
