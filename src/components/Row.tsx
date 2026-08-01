import { useEffect, useRef, useState } from 'react';
import { FC } from 'react';
import { fetchMovies, getImageUrl } from '../services/tmdb';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import HoverCard from './HoverCard';

interface RowProps {
  title: string;
  fetchUrl: string;
  showBadges?: boolean;
  mediaType?: 'movie' | 'tv';
}

const Row: FC<RowProps> = ({ title, fetchUrl, showBadges = false, mediaType = 'movie' }) => {
  const [movies, setMovies] = useState<any[]>([]);
  const [hovered, setHovered] = useState<{ movie: any; rect: DOMRect } | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<number | null>(null);
  const { setStreamingItem } = useApp();

  useEffect(() => {
    fetchMovies(fetchUrl).then(data => { if (data) setMovies(data); });
  }, [fetchUrl]);

  const scroll = (dir: 'left' | 'right') => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir === 'left' ? -700 : 700, behavior: 'smooth' });
    }
  };

  const onMouseEnter = (movie: any, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    hoverTimer.current = window.setTimeout(() => {
      setHovered({ movie, rect });
    }, 500);
  };

  const onMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  return (
    <div className="row">
      <h2 className="row-title">{title}</h2>
      <div className="row-scroll-wrap">
        <button className="row-scroll-btn row-scroll-left" onClick={() => scroll('left')}>
          <ChevronLeft size={20} />
        </button>
        <div className="row-posters" ref={rowRef}>
          {movies.map((movie, index) =>
            movie.backdrop_path ? (
              <div
                key={movie.id}
                className="poster-card"
                onMouseEnter={e => onMouseEnter(movie, e)}
                onMouseLeave={onMouseLeave}
                onClick={() => setStreamingItem({ ...movie, type: mediaType })}
              >
                <img
                  src={getImageUrl(movie.backdrop_path, 'w500')}
                  alt={movie.name || movie.title}
                  className="poster-img"
                />
                {showBadges && index < 3 && (
                  <div className="top-10-badge">TOP<br />10</div>
                )}
                {showBadges && (index % 2 === 0 || index === 3) && (
                  <div className="n-badge">N</div>
                )}
                <div className="card-overlay">
                  <h3 className="card-title">{movie.title || movie.name}</h3>
                </div>
              </div>
            ) : null
          )}
        </div>
        <button className="row-scroll-btn row-scroll-right" onClick={() => scroll('right')}>
          <ChevronRight size={20} />
        </button>
      </div>

      {hovered && (
        <HoverCard
          movie={hovered.movie}
          mediaType={mediaType}
          anchorRect={hovered.rect}
          onClose={() => setHovered(null)}
        />
      )}
    </div>
  );
};

export default Row;
