import React, { useEffect, useState } from 'react';
import { fetchMovies, getImageUrl } from '../services/tmdb';

interface RowProps {
  title: string;
  fetchUrl: string;
  subtitle?: 'left' | 'none';
  showBadges?: boolean;
}

const Row: React.FC<RowProps> = ({ title, fetchUrl, subtitle = 'none', showBadges = false }) => {
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    const getMovies = async () => {
      const data = await fetchMovies(fetchUrl);
      if (data) {
        setMovies(data);
      }
    };
    getMovies();
  }, [fetchUrl]);

  return (
    <div className="row">
      <h2 className="row-title">{title}</h2>
      <div className="row-posters">
        {movies.map((movie, index) => (
          movie.backdrop_path && (
            <div key={movie.id} className="poster-card">
              <img 
                src={getImageUrl(movie.backdrop_path, 'w500')} 
                alt={movie.name || movie.title} 
                className="poster-img"
              />
              {showBadges && index < 3 && <div className="top-10-badge">TOP<br/>10</div>}
              {showBadges && (index % 2 === 0 || index === 3) && <div className="n-badge">N</div>}
              
              <div className="card-overlay">
                <h3 className="card-title">{movie.title || movie.name}</h3>
                {subtitle === 'left' && <span className="card-subtitle">S1:E{index + 1}</span>}
                {subtitle === 'left' && index === 1 && <span className="card-subtitle-right">2h 43m left</span>}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default Row;
