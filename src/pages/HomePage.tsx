import Row from '../components/Row';
import Hero from '../components/Hero';

const HomePage = () => (
  <>
    <Hero />
    <div className="rows-container">
      <Row title="Continue Watching ›" fetchUrl="/movie/top_rated" />
      <Row title="Trending Now ›" fetchUrl="/trending/all/week" />
      <Row title="New & Hot ›" fetchUrl="/movie/popular" showBadges mediaType="movie" />
      <Row title="Top TV Shows ›" fetchUrl="/tv/top_rated" mediaType="tv" />
      <Row title="Action & Adventure ›" fetchUrl="/discover/movie?with_genres=28&sort_by=popularity.desc" />
      <Row title="Sci-Fi ›" fetchUrl="/discover/movie?with_genres=878&sort_by=popularity.desc" />
      <Row title="Anime ›" fetchUrl="/discover/tv?with_genres=16&sort_by=popularity.desc" mediaType="tv" />
    </div>
  </>
);
export default HomePage;
