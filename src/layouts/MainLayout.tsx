import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <div className="main-layout">
      <header className="header">
        <nav className="nav">
          <div className="logo">PTO Project Alpha</div>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/map">Map</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </nav>
      </header>
      <main className="content">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} PTO Project Alpha. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
