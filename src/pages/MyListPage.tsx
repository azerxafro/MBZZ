import { useApp } from '../context/AppContext';
import { getImageUrl } from '../services/tmdb';
import { Play, Trash2 } from 'lucide-react';

const MyListPage = () => {
  const { myList, removeFromList, setStreamingItem } = useApp();

  return (
    <div className="page-wrapper">
      <div className="page-hero-banner" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0010 100%)' }}>
        <div className="page-hero-overlay" />
        <h1 className="page-hero-title">MY LIST</h1>
        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 8, fontSize: '0.85rem' }}>
          {myList.length} TITLE{myList.length !== 1 ? 'S' : ''} SAVED
        </p>
      </div>
      <div className="rows-container">
        {myList.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⊘</div>
            <div className="empty-title">YOUR LIST IS EMPTY</div>
            <div className="empty-sub">Browse titles and hit + to save them here</div>
          </div>
        ) : (
          <div className="mylist-grid">
            {myList.map(item => (
              <div key={item.id} className="mylist-card">
                <img
                  src={getImageUrl(item.backdrop_path || item.poster_path, 'w500')}
                  alt={item.title || item.name}
                  className="mylist-img"
                />
                <div className="mylist-overlay">
                  <button className="mylist-play" onClick={() => setStreamingItem({ ...item, type: item.media_type === 'tv' ? 'tv' : 'movie' })}>
                    <Play fill="black" size={18} />
                  </button>
                  <button className="mylist-remove" onClick={() => removeFromList(item.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="mylist-title">{item.title || item.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default MyListPage;
