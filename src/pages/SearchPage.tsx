import { useEffect, useState } from 'react';
import { searchMulti, getImageUrl } from '../services/tmdb';
import { useApp } from '../context/AppContext';
import { Play, Plus, Check } from 'lucide-react';

const SearchPage = () => {
  const { searchQuery, setStreamingItem, addToList, removeFromList, isInList } = useApp();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) { setResults([]); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      const res = await searchMulti(searchQuery);
      setResults(res.filter((r: any) => r.backdrop_path || r.poster_path));
      setLoading(false);
    }, 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  return (
    <div className="page-wrapper" style={{ paddingTop: 100 }}>
      <div className="rows-container">
        <div className="search-page-header">
          <span className="row-title">SEARCH RESULTS</span>
          {searchQuery && <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            FOR: "{searchQuery}" — {results.length} FOUND
          </span>}
        </div>
        {loading && <div className="empty-state"><div className="empty-sub">SCANNING NEURAL NET...</div></div>}
        {!loading && searchQuery && results.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">⊘</div>
            <div className="empty-title">NO SIGNAL FOUND</div>
            <div className="empty-sub">Try a different search term</div>
          </div>
        )}
        {!loading && !searchQuery && (
          <div className="empty-state">
            <div className="empty-icon">◈</div>
            <div className="empty-title">ENTER SEARCH TERM</div>
            <div className="empty-sub">Use the search bar in the top navbar</div>
          </div>
        )}
        <div className="mylist-grid">
          {results.map(r => {
            const inList = isInList(r.id);
            return (
              <div key={r.id} className="mylist-card">
                <img
                  src={getImageUrl(r.backdrop_path || r.poster_path, 'w500')}
                  alt={r.title || r.name}
                  className="mylist-img"
                />
                <div className="mylist-overlay">
                  <button className="mylist-play" onClick={() => setStreamingItem({ ...r, type: r.media_type === 'tv' ? 'tv' : 'movie' })}>
                    <Play fill="black" size={18} />
                  </button>
                  <button className="mylist-remove" onClick={() => inList ? removeFromList(r.id) : addToList(r)}>
                    {inList ? <Check size={16} /> : <Plus size={16} />}
                  </button>
                </div>
                <div className="mylist-title">{r.title || r.name}</div>
                <div className="mylist-meta">
                  <span className="search-type-badge">{r.media_type?.toUpperCase()}</span>
                  {(r.release_date || r.first_air_date)?.split('-')[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default SearchPage;
