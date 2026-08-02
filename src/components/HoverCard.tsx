import { useEffect, useState, useRef } from 'react';
import { fetchDetails, getImageUrl } from '../services/tmdb';
import { useApp } from '../context/AppContext';
import { Play, Plus, Check, X, Info } from 'lucide-react';

interface HoverCardProps {
  movie: any;
  mediaType?: 'movie' | 'tv';
  onClose: () => void;
  anchorRect: DOMRect;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const HoverCard = ({ movie, mediaType = 'movie', onClose, anchorRect, onMouseEnter, onMouseLeave }: HoverCardProps) => {
  const { addToList, removeFromList, isInList, setStreamingItem } = useApp();
  const [details, setDetails] = useState<any>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const inList = isInList(movie.id);
  const type = movie.media_type === 'tv' || mediaType === 'tv' ? 'tv' : 'movie';

  useEffect(() => {
    fetchDetails(type, movie.id).then(setDetails);
  }, [movie.id, type]);

  // Position card
  const style: React.CSSProperties = (() => {
    const vw = window.innerWidth;
    const cardW = 380;
    let left = anchorRect.left + anchorRect.width / 2 - cardW / 2;
    if (left < 270) left = 270;
    if (left + cardW > vw - 10) left = vw - cardW - 10;
    const top = anchorRect.top - 20;
    return { position: 'fixed', top, left, width: cardW, zIndex: 1000 };
  })();

  const genres = details?.genres?.slice(0, 3).map((g: any) => g.name) || [];
  const runtime = details?.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : details?.episode_run_time?.[0] ? `${details.episode_run_time[0]}m/ep` : '';
  const rating = movie.vote_average?.toFixed(1);
  const year = (movie.release_date || movie.first_air_date || '').split('-')[0];

  return (
    <>
      <div className="hovercard" style={style} ref={cardRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <div className="hovercard-media">
          <img src={getImageUrl(movie.backdrop_path, 'w500')} className="hovercard-thumb" alt="" />
          <div className="hovercard-media-overlay" />
          <button className="hovercard-close" onClick={onClose}><X size={14} /></button>
        </div>

        <div className="hovercard-body">
          <div className="hovercard-actions">
            <button className="hc-btn hc-play" onClick={() => { setStreamingItem({ ...movie, type }); onClose(); }}>
              <Play fill="black" size={16} /> PLAY
            </button>
            <button className="hc-btn hc-list" onClick={() => inList ? removeFromList(movie.id) : addToList(movie)}>
              {inList ? <Check size={16} /> : <Plus size={16} />}
            </button>
            <button className="hc-btn hc-info" onClick={() => { setStreamingItem({ ...movie, type }); onClose(); }}>
              <Info size={16} />
            </button>
          </div>

          <div className="hovercard-title">{movie.title || movie.name}</div>

          <div className="hovercard-meta">
            {rating && <span className="hc-rating">⭐ {rating}</span>}
            {year && <span>{year}</span>}
            {runtime && <span>{runtime}</span>}
          </div>

          {movie.overview && (
            <p className="hovercard-desc">
              {movie.overview.length > 120 ? movie.overview.slice(0, 120) + '…' : movie.overview}
            </p>
          )}

          {genres.length > 0 && (
            <div className="hovercard-genres">
              {genres.map((g: string) => (
                <span key={g} className="hc-genre">{g}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HoverCard;
