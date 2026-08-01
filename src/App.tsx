import './index.css';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StreamingModal from './components/StreamingModal';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import TVShowsPage from './pages/TVShowsPage';
import MoviesPage from './pages/MoviesPage';
import NewAndHotPage from './pages/NewAndHotPage';
import MyListPage from './pages/MyListPage';
import SearchPage from './pages/SearchPage';
import Row from './components/Row';

const Clock = () => {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  return <span>{time}</span>;
};

const PageContent = () => {
  const { currentPage } = useApp();
  switch (currentPage) {
    case 'home':       return <HomePage />;
    case 'tvshows':    return <TVShowsPage />;
    case 'movies':     return <MoviesPage />;
    case 'newandhot':  return <NewAndHotPage />;
    case 'mylist':     return <MyListPage />;
    case 'search':     return <SearchPage />;
    case 'comingsoon': return (
      <div className="page-wrapper" style={{ paddingTop: 100 }}>
        <div className="rows-container">
          <div className="empty-state">
            <div className="empty-icon">◉</div>
            <div className="empty-title">COMING SOON</div>
            <div className="empty-sub">Upcoming titles streaming to Night City</div>
          </div>
          <Row title="Upcoming Movies ›" fetchUrl="/movie/upcoming" mediaType="movie" />
        </div>
      </div>
    );
    case 'games': return (
      <div className="page-wrapper" style={{ paddingTop: 100 }}>
        <div className="rows-container">
          <div className="empty-state">
            <div className="empty-icon">◈</div>
            <div className="empty-title">GAMES</div>
            <div className="empty-sub">Neural gaming implants required — feature coming soon</div>
          </div>
        </div>
      </div>
    );
    case 'categories': return (
      <div className="page-wrapper" style={{ paddingTop: 100 }}>
        <div className="rows-container">
          <Row title="Action ›" fetchUrl="/discover/movie?with_genres=28&sort_by=popularity.desc" />
          <Row title="Sci-Fi ›" fetchUrl="/discover/movie?with_genres=878&sort_by=popularity.desc" />
          <Row title="Horror ›" fetchUrl="/discover/movie?with_genres=27&sort_by=popularity.desc" />
          <Row title="Comedy ›" fetchUrl="/discover/movie?with_genres=35&sort_by=popularity.desc" />
          <Row title="Romance ›" fetchUrl="/discover/movie?with_genres=10749&sort_by=popularity.desc" />
          <Row title="Animation ›" fetchUrl="/discover/tv?with_genres=16&sort_by=popularity.desc" mediaType="tv" />
          <Row title="Crime ›" fetchUrl="/discover/movie?with_genres=80&sort_by=popularity.desc" />
          <Row title="Documentary ›" fetchUrl="/discover/movie?with_genres=99&sort_by=popularity.desc" />
        </div>
      </div>
    );
    default: return <HomePage />;
  }
};

const AppShellInner = () => {
  return (
    <>
      <div className="app-container">
        <div className="top-status">
          <span>NETFLIX_OS v2.077</span>
          <span>NIGHT CITY, 2077 &nbsp; <Clock /></span>
        </div>
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <PageContent />
          <Footer />
        </div>
      </div>
      <StreamingModal />
    </>
  );
};

const AppShell = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">NETFLIX</div>
        <div className="loading-bar-wrap">
          <div className="loading-bar" />
        </div>
        <div className="loading-text">CONNECTING TO NEURAL STREAM...</div>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  return (
    <AppProvider>
      <AppShellInner />
    </AppProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;
