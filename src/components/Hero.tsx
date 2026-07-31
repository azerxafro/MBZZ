import React, { useEffect, useState } from 'react';
import { Play, Plus } from 'lucide-react';
import { fetchMovies, getImageUrl } from '../services/tmdb';

const Hero = () => {
  const [movie, setMovie] = useState<any>(null);

  useEffect(() => {
    const getHeroMovie = async () => {
      const movies = await fetchMovies('/trending/all/week');
      if (movies && movies.length > 0) {
        setMovie(movies[0]);
      }
    };
    getHeroMovie();
  }, []);

  if (!movie) return <div className="hero"></div>;

  return (
    <div className="hero">
      <div 
        className="hero-bg" 
        style={{ backgroundImage: `url(${getImageUrl(movie.backdrop_path)})` }}
      ></div>
      
      <div className="hero-content">
        <div className="series-tag">
          <span className="n-icon">N</span>
          <span>SERIES</span>
        </div>
        <h1 className="hero-title">{movie.title || movie.name || movie.original_name}</h1>
        
        <div className="hero-actions" style={{marginBottom: '20px'}}>
          <button className="btn btn-primary">
            <Play fill="black" size={18} /> PLAY
          </button>
          <button className="btn btn-secondary">
            <Plus size={18} /> MY LIST
          </button>
        </div>

        <p className="hero-desc">
          {movie.overview?.length > 150 ? movie.overview.slice(0, 150) + '...' : movie.overview}
        </p>

        <div className="hero-meta">
          <span>HDR</span>
          <span>{movie.release_date ? movie.release_date.split('-')[0] : (movie.first_air_date ? movie.first_air_date.split('-')[0] : '2077')}</span>
          <span>1 Season</span>
          <span>4K</span>
        </div>
      </div>
      
      <div style={{position: 'absolute', right: '40px', bottom: '150px', border: '1px solid var(--border-color)', padding: '2px 5px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)'}}>
        R
      </div>
    </div>
  );
};

export default Hero;
