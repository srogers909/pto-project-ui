import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <h1>About PTO Project Alpha</h1>
      <p>
        This project demonstrates a modern React.js application with custom configuration
        and integration with the map-controls library.
      </p>
      
      <section className="about-section">
        <h2>Project Structure</h2>
        <p>
          The project follows a modular structure with separate directories for components,
          pages, layouts, hooks, store, services, and styles.
        </p>
        <ul>
          <li><strong>components/</strong> - Reusable UI components</li>
          <li><strong>pages/</strong> - Page components for different routes</li>
          <li><strong>layouts/</strong> - Layout components for page structure</li>
          <li><strong>hooks/</strong> - Custom React hooks</li>
          <li><strong>store/</strong> - Zustand store for state management</li>
          <li><strong>services/</strong> - Service modules like IndexedDB</li>
          <li><strong>styles/</strong> - SCSS styles with variables and mixins</li>
          <li><strong>types/</strong> - TypeScript type definitions</li>
          <li><strong>utils/</strong> - Utility functions</li>
        </ul>
      </section>
      
      <section className="about-section">
        <h2>Technologies Used</h2>
        <ul>
          <li><strong>React.js</strong> - UI library</li>
          <li><strong>TypeScript</strong> - Type-safe JavaScript</li>
          <li><strong>Webpack</strong> - Module bundler</li>
          <li><strong>Babel</strong> - JavaScript compiler</li>
          <li><strong>SCSS</strong> - CSS preprocessor</li>
          <li><strong>Zustand</strong> - State management</li>
          <li><strong>IndexedDB</strong> - Client-side storage</li>
          <li><strong>React Router</strong> - Routing</li>
          <li><strong>Jest</strong> - Testing framework</li>
          <li><strong>Map Controls</strong> - Custom map library</li>
        </ul>
      </section>
      
      <section className="about-section">
        <h2>Map Controls Integration</h2>
        <p>
          The project integrates with the map-controls library, which provides functionality
          for map panning and zooming. The state of the map (zoom level and position) is
          managed using Zustand and persisted in IndexedDB for long-term storage.
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
