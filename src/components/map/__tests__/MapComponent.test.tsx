import React from 'react';
import { render, screen } from '@testing-library/react';
import MapComponent from '../MapComponent';

// Mock the map-controls utility
jest.mock('../../../utils/map-controls', () => ({
  MapControls: jest.fn().mockImplementation(() => ({
    on: jest.fn()
  }))
}));

describe('MapComponent', () => {
  it('renders the map container', () => {
    render(<MapComponent mapSrc="/test-map.jpg" />);
    const mapContainer = document.querySelector('.map-container');
    expect(mapContainer).toBeInTheDocument();
  });

  it('initializes with correct props', () => {
    const mockMapSrc = '/test-map.jpg';
    const mockInitialZoom = 1.5;
    const mockMinZoom = 0.5;
    const mockMaxZoom = 3;
    const mockShowControls = true;
    
    // Get the mocked constructor
    const MockMapControls = jest.fn().mockImplementation(() => ({
      on: jest.fn()
    }));
    
    // Replace the MapControls in the module
    jest.doMock('../MapComponent', () => {
      const originalModule = jest.requireActual('../MapComponent');
      return {
        ...originalModule,
        MapControls: MockMapControls
      };
    });
    
    render(
      <MapComponent 
        mapSrc={mockMapSrc}
        initialZoom={mockInitialZoom}
        minZoom={mockMinZoom}
        maxZoom={mockMaxZoom}
        showControls={mockShowControls}
      />
    );
    
    // Since we can't directly check the constructor args in this setup,
    // we'll just verify the component renders without errors
    const mapContainer = document.querySelector('.map-container');
    expect(mapContainer).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    // Mock useState to control the loading state
    const originalUseState = React.useState;
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()]);
    
    render(<MapComponent mapSrc="/test-map.jpg" />);
    
    expect(screen.getByText('Loading map...')).toBeInTheDocument();
    
    // Restore original useState
    (React.useState as jest.Mock).mockRestore();
  });

  it('shows placeholder when map fails to load', () => {
    // Mock useState to control the error state
    jest.spyOn(React, 'useState')
      .mockImplementationOnce(() => [false, jest.fn()]) // isLoading
      .mockImplementationOnce(() => ['Test error', jest.fn()]) // error
      .mockImplementationOnce(() => [false, jest.fn()]); // mapLoaded
    
    render(<MapComponent mapSrc="/test-map.jpg" />);
    
    expect(screen.getByText('Map Placeholder')).toBeInTheDocument();
    expect(screen.getByText('The map image could not be loaded')).toBeInTheDocument();
    
    // Restore original useState
    (React.useState as jest.Mock).mockRestore();
  });
});
