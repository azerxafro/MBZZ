import { useEffect, useState } from 'react';
import { Play, Plus, Check, Volume2, VolumeX } from 'lucide-react';
import { fetchMovies, fetchDetails, getImageUrl, getYouTubeKey } from '../services/tmdb';
import { useApp } from '../context/AppContext';

const Hero = () => {
  const [movie, setMovie] = useState<any>(null);
  const [details, setDetails] = useState<any>(null);
  const [muted, setMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const { setStreamingItem, addToList, removeFromList, isInList } = useApp();

  useEffect(() => {
    const getHeroMovie = async () => {
      const movies = await fetchMovies('/trending/all/week');
      if (movies?.length) {
        const pick = movies[Math.floor(Math.random() * Math.min(5, movies.length))];
        setMovie(pick);
        const type = pick.media_type === 'tv' ? 'tv' : 'movie';
        const d = await fetchDetails(type, pick.id);
        setDetails(d);
        // Show video after 2s
        setTimeout(() => setShowVideo(true), 2000);
      }
    };
    getHeroMovie();
  }, []);

  if (!movie) return <div className="hero" />;

  const videoKey = details ? getYouTubeKey(details.videos) : null;
  const type = movie.media_type === 'tv' ? 'tv' : 'movie';
  const inList = isInList(movie.id);

  return (
    <div className="hero">
      <div
        className="hero-bg"
        style={{ backgroundImage: `url(${getImageUrl(movie.backdrop_path)})` }}
      />

      {showVideo && videoKey && (
        <iframe
          className="hero-video"
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&loop=1&playlist=${videoKey}&modestbranding=1&showinfo=0`}
          allow="autoplay; encrypted-media"
          title="hero-video"
        />
      )}

      <div className="hero-content">
        <div className="series-tag">
          <span className="n-icon">N</span>
          <span>{type === 'tv' ? 'SERIES' : 'FILM'}</span>
        </div>
        <h1 className="hero-title">{movie.title || movie.name}</h1>

        <div className="hero-actions" style={{ marginBottom: '20px' }}>
          <button className="btn btn-primary" onClick={() => setStreamingItem({ ...movie, type })}>
            <Play fill="black" size={18} /> PLAY
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => inList ? removeFromList(movie.id) : addToList(movie)}
          >
            {inList ? <Check size={18} /> : <Plus size={18} />}
            {inList ? 'SAVED' : 'MY LIST'}
          </button>
        </div>

        <p className="hero-desc">
          {movie.overview?.length > 150 ? movie.overview.slice(0, 150) + '...' : movie.overview}
        </p>

        <div className="hero-meta">
          <span>HDR</span>
          <span>{(movie.release_date || movie.first_air_date || '2077').split('-')[0]}</span>
          <span>{details?.number_of_seasons ? `${details.number_of_seasons} Season${details.number_of_seasons > 1 ? 's' : ''}` : '1 Season'}</span>
          <span>4K</span>
        </div>
      </div>

      {/* Volume toggle */}
      {showVideo && videoKey && (
        <button className="hero-mute-btn" onClick={() => setMuted(m => !m)}>
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}

      <div style={{
        position: 'absolute', right: '40px', bottom: '150px',
        border: '1px solid var(--border-color)', padding: '2px 5px',
        fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)'
      }}>R</div>
    </div>
  );
};

export default Hero;
