import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Bell, ChevronDown, LogOut, User } from 'lucide-react';
import SearchBar from './SearchBar';
import { useState } from 'react';

const Navbar = () => {
  const { currentPage, setCurrentPage } = useApp();
  const { user, signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks: { label: string; page: any }[] = [
    { label: 'HOME', page: 'home' },
    { label: 'TV SHOWS', page: 'tvshows' },
    { label: 'MOVIES', page: 'movies' },
    { label: 'NEW & HOT', page: 'newandhot' },
    { label: 'MY LIST', page: 'mylist' },
  ];

  return (
    <div className="navbar">
      <div className="nav-links">
        {navLinks.map(({ label, page }) => (
          <a
            key={page}
            className={`nav-link ${currentPage === page ? 'active' : ''}`}
            onClick={() => setCurrentPage(page)}
          >
            {label}
          </a>
        ))}
      </div>
      <div className="nav-right">
        <SearchBar />
        <span className="kids-text">KIDS</span>
        <div className="notification">
          <Bell className="nav-icon" size={20} />
          <span className="notif-badge">3</span>
        </div>
        <div className="profile-menu-wrap" style={{ position: 'relative' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
            onClick={() => setProfileOpen(p => !p)}
          >
            <div className="profile-avatar">
              <User size={16} />
            </div>
            <ChevronDown className="nav-icon" size={16} />
          </div>
          {profileOpen && (
            <div className="profile-dropdown">
              <div className="profile-email">{user?.email}</div>
              <button className="profile-signout" onClick={signOut}>
                <LogOut size={14} /> DISCONNECT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
