import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="nav-links">
        <a href="#" className="nav-link active">HOME</a>
        <a href="#" className="nav-link">TV SHOWS</a>
        <a href="#" className="nav-link">MOVIES</a>
        <a href="#" className="nav-link">NEW & HOT</a>
        <a href="#" className="nav-link">MY LIST</a>
      </div>
      <div className="nav-right">
        <Search className="nav-icon" size={20} />
        <span className="kids-text">KIDS</span>
        <div className="notification">
          <Bell className="nav-icon" size={20} />
          <span className="notif-badge">3</span>
        </div>
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="Profile" className="profile-pic" />
        <ChevronDown className="nav-icon" size={20} />
      </div>
    </div>
  );
};

export default Navbar;
