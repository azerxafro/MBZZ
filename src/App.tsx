import React from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Row from './components/Row';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app-container">
      <div className="top-status">
        <span>NETFLIX_OS v2.077</span>
        <span>NIGHT CITY, 2077 22:07</span>
      </div>
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <Hero />
        <div className="rows-container">
          <Row title="Continue Watching >" fetchUrl="/movie/top_rated" subtitle="left" />
          <Row title="New & Hot >" fetchUrl="/movie/popular" showBadges={true} />
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
