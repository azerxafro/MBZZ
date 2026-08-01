import Row from '../components/Row';

const TVShowsPage = () => (
  <div className="page-wrapper">
    <div className="page-hero-banner" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/9faGSFi5jam6pDWGRevORbr3ESt.jpg)` }}>
      <div className="page-hero-overlay" />
      <h1 className="page-hero-title">TV SHOWS</h1>
    </div>
    <div className="rows-container">
      <Row title="Popular TV Shows ›" fetchUrl="/tv/popular" mediaType="tv" />
      <Row title="Top Rated ›" fetchUrl="/tv/top_rated" mediaType="tv" />
      <Row title="On Air Tonight ›" fetchUrl="/tv/on_the_air" mediaType="tv" />
      <Row title="Crime & Drama ›" fetchUrl="/discover/tv?with_genres=80&sort_by=popularity.desc" mediaType="tv" />
      <Row title="Sci-Fi & Fantasy ›" fetchUrl="/discover/tv?with_genres=10765&sort_by=popularity.desc" mediaType="tv" />
      <Row title="Animation ›" fetchUrl="/discover/tv?with_genres=16&sort_by=popularity.desc" mediaType="tv" />
    </div>
  </div>
);
export default TVShowsPage;
