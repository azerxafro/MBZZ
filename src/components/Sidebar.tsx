import React from 'react';
import { Home, Search, Calendar, Gamepad2, TrendingUp, Tv, Film, Grid, Plus, ChevronRight } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="brand-logo">NETFLIX</div>
      
      <div className="menu-section">
        <div className="menu-title">MAIN MENU <ChevronRight size={10} style={{display:'inline'}}/></div>
        <ul className="menu-list">
          <li className="menu-item active"><Home /> HOME</li>
          <li className="menu-item"><Search /> SEARCH</li>
          <li className="menu-item"><Calendar /> COMING SOON</li>
          <li className="menu-item"><Gamepad2 /> GAMES</li>
          <li className="menu-item"><TrendingUp /> NEW & POPULAR</li>
          <li className="menu-item"><Tv /> TV SHOWS</li>
          <li className="menu-item"><Film /> MOVIES</li>
          <li className="menu-item"><Grid /> CATEGORIES</li>
          <li className="menu-item"><Plus /> MY LIST</li>
        </ul>
      </div>

      <div className="status-panel">
        <div className="status-title">NETFLIX_STATUS <ChevronRight size={10}/></div>
        <div className="status-text">CONNECTED</div>
        <div className="user-id">USER_2077 // PREMIUM</div>
        
        <div className="bandwidth">BANDWIDTH</div>
        <div className="bandwidth-bar">
          <div className="bar-segment"></div>
          <div className="bar-segment"></div>
          <div className="bar-segment"></div>
          <div className="bar-segment"></div>
          <div className="bar-segment"></div>
          <div className="bar-segment"></div>
          <div className="bar-segment"></div>
          <div className="bar-segment dim"></div>
          <span className="bar-text">98%</span>
        </div>
      </div>

      <div className="city-feed">
        <div className="city-feed-title">CITY FEED <ChevronRight size={10}/></div>
        <img src="https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=600&auto=format&fit=crop" alt="City" className="city-image" />
        <div className="city-text">
          <span>HEY CHOOM, NEW EPISODES ARE<br/>NOW STREAMING.</span>
          <ChevronRight size={12}/>
        </div>
      </div>

      <div style={{fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '20px'}}>
        © NETFLIX INC. 2077
      </div>
    </div>
  );
};

export default Sidebar;
