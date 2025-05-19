/**
 * Local implementation of the map-controls library
 * This serves as a placeholder until the actual library is available
 */

export interface MapControlsOptions {
  container: HTMLElement;
  mapSrc: string;
  fallbackSrc?: string;
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
  private container: HTMLElement;
  private mapSrc: string;
  private fallbackSrc?: string;
  private zoom: number;
  private minZoom: number;
  private maxZoom: number;
  private showControls: boolean;
  private controlsPosition: string;
  private eventHandlers: Record<string, Function[]> = {};
  private mapElement: HTMLImageElement | null = null;

  constructor(options: MapControlsOptions) {
    this.container = options.container;
    this.mapSrc = options.mapSrc;
    this.fallbackSrc = options.fallbackSrc;
    this.zoom = options.initialZoom || 1;
    this.minZoom = options.minZoom || 0.5;
    this.maxZoom = options.maxZoom || 3;
    this.showControls = options.showControls !== undefined ? options.showControls : true;
    this.controlsPosition = options.controlsPosition || 'bottom-right';

    this.init();
  }

  private init() {
    // Clear container
    this.container.innerHTML = '';
    
    // Create map element
    this.mapElement = document.createElement('img');
    this.mapElement.style.width = '100%';
    this.mapElement.style.height = '100%';
    this.mapElement.style.objectFit = 'contain';
    this.mapElement.style.transform = `scale(${this.zoom})`;
    this.mapElement.style.transition = 'transform 0.3s ease';
    
    // Handle image loading errors
    this.mapElement.onerror = () => {
      console.warn(`Failed to load map image: ${this.mapSrc}`);
      if (this.fallbackSrc) {
        console.log(`Using fallback image: ${this.fallbackSrc}`);
        this.mapElement!.src = this.fallbackSrc;
        
        // Add another error handler for the fallback image
        this.mapElement!.onerror = () => {
          console.error(`Failed to load fallback image: ${this.fallbackSrc}`);
          this.createPlaceholder();
          this.triggerEvent('error', 'Failed to load map image and fallback');
        };
      } else {
        // Create a simple placeholder if no fallback is provided
        this.createPlaceholder();
        this.triggerEvent('error', 'Failed to load map image');
      }
    };
    
    // Set the image source to trigger loading
    this.mapElement.src = this.mapSrc;
    
    this.container.appendChild(this.mapElement);
    
    // Add controls if enabled
    if (this.showControls) {
      this.createControls();
    }
    
    // Add event listeners
    this.setupEventListeners();
    
    // Trigger load event
    this.mapElement.onload = () => {
      this.triggerEvent('load', null);
    };
  }
  
  private createPlaceholder() {
    if (!this.mapElement) return;
    
    // Remove the image element
    this.mapElement.remove();
    
    // Create a placeholder div
    const placeholder = document.createElement('div');
    placeholder.style.width = '100%';
    placeholder.style.height = '100%';
    placeholder.style.backgroundColor = '#f0f0f0';
    placeholder.style.display = 'flex';
    placeholder.style.justifyContent = 'center';
    placeholder.style.alignItems = 'center';
    placeholder.style.color = '#666';
    placeholder.style.fontFamily = 'Arial, sans-serif';
    placeholder.style.fontSize = '16px';
    placeholder.textContent = 'Map image not available';
    
    this.container.appendChild(placeholder);
  }
  
  private createControls() {
    const controlsContainer = document.createElement('div');
    controlsContainer.style.position = 'absolute';
    
    // Position the controls
    switch (this.controlsPosition) {
      case 'top-left':
        controlsContainer.style.top = '10px';
        controlsContainer.style.left = '10px';
        break;
      case 'top-right':
        controlsContainer.style.top = '10px';
        controlsContainer.style.right = '10px';
        break;
      case 'bottom-left':
        controlsContainer.style.bottom = '10px';
        controlsContainer.style.left = '10px';
        break;
      case 'bottom-right':
      default:
        controlsContainer.style.bottom = '10px';
        controlsContainer.style.right = '10px';
        break;
    }
    
    controlsContainer.style.display = 'flex';
    controlsContainer.style.flexDirection = 'column';
    controlsContainer.style.gap = '5px';
    controlsContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    controlsContainer.style.padding = '5px';
    controlsContainer.style.borderRadius = '4px';
    
    // Zoom in button
    const zoomInBtn = document.createElement('button');
    zoomInBtn.textContent = '+';
    zoomInBtn.style.width = '30px';
    zoomInBtn.style.height = '30px';
    zoomInBtn.addEventListener('click', () => this.zoomIn());
    
    // Zoom out button
    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.textContent = '-';
    zoomOutBtn.style.width = '30px';
    zoomOutBtn.style.height = '30px';
    zoomOutBtn.addEventListener('click', () => this.zoomOut());
    
    // Reset button
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'R';
    resetBtn.style.width = '30px';
    resetBtn.style.height = '30px';
    resetBtn.addEventListener('click', () => this.reset());
    
    controlsContainer.appendChild(zoomInBtn);
    controlsContainer.appendChild(zoomOutBtn);
    controlsContainer.appendChild(resetBtn);
    
    this.container.appendChild(controlsContainer);
  }
  
  private setupEventListeners() {
    // Mouse wheel for zooming
    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        this.zoomIn();
      } else {
        this.zoomOut();
      }
    });
    
    // Mouse drag for panning
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    
    this.container.addEventListener('mousedown', (e) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      this.container.style.cursor = 'grabbing';
    });
    
    window.addEventListener('mousemove', (e) => {
      if (isDragging && this.mapElement) {
        const deltaX = e.clientX - lastX;
        const deltaY = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        
        // Simple pan implementation
        const position = { x: deltaX, y: deltaY };
        this.triggerEvent('pan', position);
      }
    });
    
    window.addEventListener('mouseup', () => {
      isDragging = false;
      this.container.style.cursor = 'grab';
    });
  }

  public on(event: string, callback: Function) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(callback);
    return this;
  }

  public zoomIn() {
    if (this.zoom < this.maxZoom) {
      this.zoom *= 1.2;
      if (this.mapElement) {
        this.mapElement.style.transform = `scale(${this.zoom})`;
      }
      this.triggerEvent('zoom', this.zoom);
    }
    return this;
  }

  public zoomOut() {
    if (this.zoom > this.minZoom) {
      this.zoom /= 1.2;
      if (this.mapElement) {
        this.mapElement.style.transform = `scale(${this.zoom})`;
      }
      this.triggerEvent('zoom', this.zoom);
    }
    return this;
  }

  public panTo(x: number, y: number) {
    const position = { x, y };
    this.triggerEvent('pan', position);
    return this;
  }

  public reset() {
    this.zoom = 1;
    if (this.mapElement) {
      this.mapElement.style.transform = `scale(${this.zoom})`;
    }
    this.triggerEvent('zoom', this.zoom);
    this.triggerEvent('pan', { x: 0, y: 0 });
    return this;
  }

  public displayControls() {
    this.showControls = true;
    this.init();
    return this;
  }

  public hideControls() {
    this.showControls = false;
    this.init();
    return this;
  }

  private triggerEvent(event: string, data: any) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach(handler => handler(data));
    }
  }
}
