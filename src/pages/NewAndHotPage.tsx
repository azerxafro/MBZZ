import Row from '../components/Row';

const NewAndHotPage = () => (
  <div className="page-wrapper">
    <div className="page-hero-banner" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg)` }}>
      <div className="page-hero-overlay" />
      <h1 className="page-hero-title">NEW & HOT</h1>
    </div>
    <div className="rows-container">
      <Row title="Trending This Week ›" fetchUrl="/trending/all/week" showBadges />
      <Row title="Trending Today ›" fetchUrl="/trending/all/day" showBadges />
      <Row title="Upcoming Movies ›" fetchUrl="/movie/upcoming" mediaType="movie" />
      <Row title="New TV Shows ›" fetchUrl="/tv/airing_today" mediaType="tv" />
    </div>
  </div>
);
export default NewAndHotPage;
