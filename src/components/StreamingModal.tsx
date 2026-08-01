import { useEffect, useState } from 'react';
import { fetchDetails, getImageUrl, getYouTubeKey } from '../services/tmdb';
import { useApp } from '../context/AppContext';
import { X, Plus, Check, Play, Star, Clock } from 'lucide-react';

const StreamingModal = () => {
  const { streamingItem, setStreamingItem, addToList, removeFromList, isInList } = useApp();
  const [details, setDetails] = useState<any>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!streamingItem) { setDetails(null); setPlaying(false); return; }
    fetchDetails(streamingItem.type || 'movie', streamingItem.id).then(d => {
      setDetails(d);
    });
  }, [streamingItem]);

  if (!streamingItem) return null;

  const inList = isInList(streamingItem.id);
  const videoKey = details ? getYouTubeKey(details.videos) : null;
  const genres = details?.genres?.map((g: any) => g.name).join(' • ') || '';
  const rating = streamingItem.vote_average?.toFixed(1);
  const year = (streamingItem.release_date || streamingItem.first_air_date || '').split('-')[0];
  const runtime = details?.runtime
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
    : details?.number_of_seasons
    ? `${details.number_of_seasons} Season${details.number_of_seasons > 1 ? 's' : ''}`
    : '';
  const cast = details?.credits?.cast?.slice(0, 5).map((c: any) => c.name).join(', ') || '';

  return (
    <div className="modal-overlay" onClick={() => setStreamingItem(null)}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setStreamingItem(null)}>
          <X size={20} />
        </button>

        {/* Video / Backdrop */}
        <div className="modal-video-wrap">
          {playing && videoKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&controls=1&modestbranding=1`}
              allow="autoplay; encrypted-media; fullscreen"
              className="modal-iframe"
              title="stream"
              allowFullScreen
            />
          ) : (
            <>
              <img
                src={getImageUrl(streamingItem.backdrop_path, 'original')}
                className="modal-backdrop-img"
                alt=""
              />
              <div className="modal-backdrop-overlay" />
              <div className="modal-play-center">
                <button className="modal-play-big" onClick={() => setPlaying(true)}>
                  <Play fill="black" size={30} />
                </button>
              </div>
              <div className="modal-title-overlay">
                <h1 className="modal-hero-title">{streamingItem.title || streamingItem.name}</h1>
              </div>
            </>
          )}
        </div>

        {/* Info */}
        <div className="modal-info">
          <div className="modal-actions-row">
            <button className="btn btn-primary" onClick={() => setPlaying(true)}>
              <Play fill="black" size={16} /> PLAY
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => inList ? removeFromList(streamingItem.id) : addToList(streamingItem)}
            >
              {inList ? <Check size={16} /> : <Plus size={16} />}
              {inList ? 'REMOVE' : 'MY LIST'}
            </button>
          </div>

          <div className="modal-meta-row">
            {rating && <span className="modal-badge modal-rating"><Star size={12} fill="currentColor" /> {rating}</span>}
            {year && <span className="modal-badge">{year}</span>}
            {runtime && <span className="modal-badge"><Clock size={12} /> {runtime}</span>}
            <span className="modal-badge modal-hdr">HDR</span>
            <span className="modal-badge">4K</span>
          </div>

          {streamingItem.overview && (
            <p className="modal-overview">{streamingItem.overview}</p>
          )}

          <div className="modal-details-grid">
            {genres && <div className="modal-detail-row"><span className="modal-detail-label">GENRES:</span> {genres}</div>}
            {cast && <div className="modal-detail-row"><span className="modal-detail-label">CAST:</span> {cast}</div>}
          </div>

          {/* Related / More Episodes placeholder */}
          {details?.seasons?.length > 0 && (
            <div className="modal-seasons">
              <div className="modal-section-title">SEASONS</div>
              <div className="modal-seasons-list">
                {details.seasons.filter((s: any) => s.season_number > 0).map((s: any) => (
                  <div key={s.id} className="modal-season-chip">
                    S{s.season_number} • {s.episode_count} eps
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StreamingModal;
