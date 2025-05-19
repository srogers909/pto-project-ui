import React, { useEffect, useRef, useState } from 'react';
import { MapControls } from '../../utils/map-controls';

interface MapComponentProps {
  mapSrc: string;
  fallbackSrc?: string;
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  showControls?: boolean;
  controlsPosition?: string;
  onZoom?: (level: number) => void;
  onPan?: (position: { x: number, y: number }) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  mapSrc,
  fallbackSrc,
  initialZoom = 1,
  minZoom = 0.5,
  maxZoom = 3,
  showControls = true,
  controlsPosition = 'bottom-right',
  onZoom,
  onPan
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapControlsRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Create a placeholder directly in the component
  const renderPlaceholder = () => {
    return (
      <div 
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          color: '#666',
          border: '2px dashed #ccc',
          borderRadius: '4px',
          padding: '20px',
          textAlign: 'center'
        }}
      >
        <h3>Map Placeholder</h3>
        <p>The map image could not be loaded</p>
        <div style={{ marginTop: '10px', fontSize: '24px' }}>📍</div>
      </div>
    );
  };

  // Force error state for testing
  useEffect(() => {
    // Simulate an error loading the map after a short delay
    const timeoutId = setTimeout(() => {
      setError('Failed to load map image');
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    // This effect is kept for reference but won't run due to the error simulation above
    if (containerRef.current && !error) {
      try {
        // Initialize map controls
        mapControlsRef.current = new MapControls({
          container: containerRef.current,
          mapSrc,
          fallbackSrc,
          initialZoom,
          minZoom,
          maxZoom,
          showControls,
          controlsPosition
        });

        // Set up event listeners
        if (onZoom) {
          mapControlsRef.current.on('zoom', onZoom);
        }

        if (onPan) {
          mapControlsRef.current.on('pan', onPan);
        }
        
        // Listen for load event
        mapControlsRef.current.on('load', () => {
          setMapLoaded(true);
          setIsLoading(false);
        });
      } catch (e) {
        console.error('Error initializing map controls:', e);
        setError('Failed to initialize map controls');
        setIsLoading(false);
      }
    }

    // Cleanup function
    return () => {
      if (mapControlsRef.current) {
        // Any cleanup method if available
        // mapControlsRef.current.destroy();
      }
    };
  }, [mapSrc, initialZoom, minZoom, maxZoom, showControls, controlsPosition, onZoom, onPan, error]);

  if (error) {
    return renderPlaceholder();
  }

  if (isLoading) {
    return (
      <div className="map-container map-loading">
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <div className="map-container">
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default MapComponent;
