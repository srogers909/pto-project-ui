import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <h1>Welcome to PTO Project Alpha</h1>
      <p>
        This is a React.js UI scaffolding project with Webpack, Babel, SCSS, Zustand for state management,
        React Router, Jest for testing, and integration with the map-controls library.
      </p>
      <div className="cta-buttons">
        <Link to="/map" className="btn btn-primary">View Map</Link>
        <Link to="/about" className="btn btn-secondary">About Project</Link>
      </div>
      <div className="features">
        <h2>Features</h2>
        <ul>
          <li>React.js with TypeScript</li>
          <li>Custom Webpack & Babel setup</li>
          <li>SCSS for styling</li>
          <li>Zustand for state management</li>
          <li>IndexedDB for long-term state storage</li>
          <li>React Router for navigation</li>
          <li>Jest for unit testing</li>
          <li>Map controls integration</li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
