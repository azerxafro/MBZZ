import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  Home, Search, Calendar, Gamepad2, TrendingUp,
  Tv, Film, Grid, Plus, ChevronRight, LogOut
} from 'lucide-react';

const Sidebar = () => {
  const { currentPage, setCurrentPage } = useApp();
  const { user, signOut } = useAuth();

  const menuItems = [
    { icon: <Home />, label: 'HOME', page: 'home' },
    { icon: <Search />, label: 'SEARCH', page: 'search' },
    { icon: <Calendar />, label: 'COMING SOON', page: 'comingsoon' },
    { icon: <Gamepad2 />, label: 'GAMES', page: 'games' },
    { icon: <TrendingUp />, label: 'NEW & POPULAR', page: 'newandhot' },
    { icon: <Tv />, label: 'TV SHOWS', page: 'tvshows' },
    { icon: <Film />, label: 'MOVIES', page: 'movies' },
    { icon: <Grid />, label: 'CATEGORIES', page: 'categories' },
    { icon: <Plus />, label: 'MY LIST', page: 'mylist' },
  ];

  return (
    <div className="sidebar">
      <div className="brand-logo">NETFLIX</div>

      <div className="menu-section">
        <div className="menu-title">MAIN MENU <ChevronRight size={10} style={{ display: 'inline' }} /></div>
        <ul className="menu-list">
          {menuItems.map(({ icon, label, page }) => (
            <li
              key={page}
              className={`menu-item ${currentPage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page as any)}
            >
              {icon} {label}
            </li>
          ))}
        </ul>
      </div>

      <div className="status-panel">
        <div className="status-title">NETFLIX_STATUS <ChevronRight size={10} /></div>
        <div className="status-text">CONNECTED</div>
        <div className="user-id">{user?.email?.split('@')[0].toUpperCase()} // PREMIUM</div>

        <div className="bandwidth">BANDWIDTH</div>
        <div className="bandwidth-bar">
          {[...Array(7)].map((_, i) => <div key={i} className="bar-segment" />)}
          <div className="bar-segment dim" />
          <span className="bar-text">98%</span>
        </div>

        <button className="sidebar-signout" onClick={signOut}>
          <LogOut size={14} /> DISCONNECT
        </button>
      </div>

      <div className="city-feed">
        <div className="city-feed-title">CITY FEED <ChevronRight size={10} /></div>
        <img
          src="https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=600&auto=format&fit=crop"
          alt="City"
          className="city-image"
        />
        <div className="city-text">
          <span>HEY CHOOM, NEW EPISODES ARE<br />NOW STREAMING.</span>
          <ChevronRight size={12} />
        </div>
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '20px' }}>
        © NETFLIX INC. 2077
      </div>
    </div>
  );
};

export default Sidebar;
