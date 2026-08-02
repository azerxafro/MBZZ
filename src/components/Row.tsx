import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import { fetchMovies, getImageUrl } from '../services/tmdb';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import HoverCard from './HoverCard';
import { RowSkeleton } from './Skeleton';

interface RowProps {
  title: string;
  fetchUrl: string;
  showBadges?: boolean;
  mediaType?: 'movie' | 'tv';
}

const Row: FC<RowProps> = ({ title, fetchUrl, showBadges = false, mediaType = 'movie' }) => {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<{ movie: any; rect: DOMRect } | null>(null);
  const rowRef      = useRef<HTMLDivElement>(null);
  const openTimer   = useRef<number | null>(null);   // delay before showing card
  const closeTimer  = useRef<number | null>(null);   // delay before hiding card
  const { setStreamingItem } = useApp();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchMovies(fetchUrl).then(data => {
      if (!cancelled) { setMovies(data ?? []); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [fetchUrl]);

  const scroll = (dir: 'left' | 'right') => {
    rowRef.current?.scrollBy({ left: dir === 'left' ? -700 : 700, behavior: 'smooth' });
  };

  // ── Card mouse handlers ───────────────────────────────────────────────────

  const onCardEnter = (movie: any, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    // Cancel any pending close
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }

    if (hovered) {
      // A card is already open → switch immediately, no delay
      if (openTimer.current) { clearTimeout(openTimer.current); openTimer.current = null; }
      setHovered({ movie, rect });
    } else {
      // No card open → wait 500 ms before showing
      if (openTimer.current) clearTimeout(openTimer.current);
      openTimer.current = window.setTimeout(() => setHovered({ movie, rect }), 500);
    }
  };

  const onCardLeave = () => {
    // Cancel pending open
    if (openTimer.current) { clearTimeout(openTimer.current); openTimer.current = null; }

    // Give 300 ms grace — user might be moving cursor into the hovercard
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setHovered(null), 300);
  };

  // ── HoverCard mouse handlers (keep card alive) ────────────────────────────

  const onHoverCardEnter = () => {
    // Mouse moved into the card — cancel any pending close
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  };

  const onHoverCardLeave = () => {
    // Mouse left the card → close after short delay
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setHovered(null), 200);
  };

  const close = () => {
    if (openTimer.current)  { clearTimeout(openTimer.current);  openTimer.current  = null; }
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    setHovered(null);
  };

  return (
    <div className="row">
      <h2 className="row-title">{title}</h2>
      <div className="row-scroll-wrap">
        {!loading && movies.length > 0 && (
          <button className="row-scroll-btn row-scroll-left" onClick={() => scroll('left')}>
            <ChevronLeft size={20} />
          </button>
        )}

        {loading ? (
          <RowSkeleton />
        ) : (
          <div className="row-posters" ref={rowRef}>
            {movies.map((movie, index) =>
              movie.backdrop_path ? (
                <div
                  key={movie.id}
                  className="poster-card"
                  onMouseEnter={e => onCardEnter(movie, e)}
                  onMouseLeave={onCardLeave}
                  onClick={() => setStreamingItem({ ...movie, type: mediaType })}
                >
                  <img
                    src={getImageUrl(movie.backdrop_path, 'w500')}
                    alt={movie.name || movie.title}
                    className="poster-img"
                    loading="lazy"
                    decoding="async"
                  />
                  {showBadges && index < 3 && <div className="top-10-badge">TOP<br />10</div>}
                  {showBadges && (index % 2 === 0 || index === 3) && <div className="n-badge">N</div>}
                  <div className="card-overlay">
                    <h3 className="card-title">{movie.title || movie.name}</h3>
                  </div>
                </div>
              ) : null
            )}
          </div>
        )}

        {!loading && movies.length > 0 && (
          <button className="row-scroll-btn row-scroll-right" onClick={() => scroll('right')}>
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {hovered && (
        <HoverCard
          movie={hovered.movie}
          mediaType={mediaType}
          anchorRect={hovered.rect}
          onClose={close}
          onMouseEnter={onHoverCardEnter}
          onMouseLeave={onHoverCardLeave}
        />
      )}
    </div>
  );
};

export default Row;
