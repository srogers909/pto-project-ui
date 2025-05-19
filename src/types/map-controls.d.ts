declare module 'map-controls' {
  export interface MapControlsOptions {
    container: HTMLElement;
    mapSrc: string;
    initialZoom?: number;
    minZoom?: number;
    maxZoom?: number;
    showControls?: boolean;
    controlsPosition?: string;
  }

  export interface MapPosition {
    x: number;
    y: number;
  }

  export type MapEventListener = (data: any) => void;

  export class MapControls {
    constructor(options: MapControlsOptions);
    
    on(event: 'zoom', callback: (level: number) => void): void;
    on(event: 'pan', callback: (position: MapPosition) => void): void;
    on(event: 'load', callback: () => void): void;
    on(event: 'error', callback: (error: Error) => void): void;
    
    zoomIn(): void;
    zoomOut(): void;
    panTo(x: number, y: number): void;
    reset(): void;
    showControls(): void;
    hideControls(): void;
  }
}
