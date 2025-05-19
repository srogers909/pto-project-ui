import React from 'react';
import MapComponent from '../components/map/MapComponent';
import { useMapStore } from '../store/mapStore';

const MapPage: React.FC = () => {
  const { zoom, position, setZoom, setPosition, resetState } = useMapStore();

  const handleZoom = (level: number) => {
    setZoom(level);
  };

  const handlePan = (pos: { x: number, y: number }) => {
    setPosition(pos);
  };

  return (
    <div className="map-page">
      <h1>Map Example</h1>
      <div className="map-info">
        <p>Current Zoom: {zoom.toFixed(2)}</p>
        <p>Current Position: X: {position.x.toFixed(2)}, Y: {position.y.toFixed(2)}</p>
        <button className="btn btn-secondary" onClick={resetState}>Reset Map</button>
      </div>
      <MapComponent
        mapSrc="/assets/world-map.txt"
        fallbackSrc="/assets/map-placeholder.txt"
        initialZoom={zoom}
        onZoom={handleZoom}
        onPan={handlePan}
      />
      <div className="map-instructions">
        <h3>Instructions</h3>
        <ul>
          <li>Use mouse wheel or pinch gesture to zoom in/out</li>
          <li>Click and drag to pan the map</li>
          <li>Use the controls in the bottom-right corner (if enabled)</li>
        </ul>
      </div>
    </div>
  );
};

export default MapPage;
