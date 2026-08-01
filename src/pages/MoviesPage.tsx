import Row from '../components/Row';

const MoviesPage = () => (
  <div className="page-wrapper">
    <div className="page-hero-banner" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/s16H6tpK2utvwpaez7C579EmSp1.jpg)` }}>
      <div className="page-hero-overlay" />
      <h1 className="page-hero-title">MOVIES</h1>
    </div>
    <div className="rows-container">
      <Row title="Now Playing ›" fetchUrl="/movie/now_playing" mediaType="movie" />
      <Row title="Popular Movies ›" fetchUrl="/movie/popular" showBadges mediaType="movie" />
      <Row title="Top Rated ›" fetchUrl="/movie/top_rated" mediaType="movie" />
      <Row title="Action ›" fetchUrl="/discover/movie?with_genres=28&sort_by=popularity.desc" />
      <Row title="Thriller ›" fetchUrl="/discover/movie?with_genres=53&sort_by=popularity.desc" />
      <Row title="Horror ›" fetchUrl="/discover/movie?with_genres=27&sort_by=popularity.desc" />
      <Row title="Comedy ›" fetchUrl="/discover/movie?with_genres=35&sort_by=popularity.desc" />
    </div>
  </div>
);
export default MoviesPage;
