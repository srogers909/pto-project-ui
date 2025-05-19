/**
 * AssetManager - Handles loading, managing, and replacing game assets
 */
import { AssetManifest, Asset } from '../utils/placeholderGenerator';

interface Texture {
  id: string;
  path: string;
}

export default class AssetManager {
  manifest: AssetManifest;
  textures: { [key: string]: Texture };
  app: any; // PIXI application reference

  constructor() {
    this.manifest = {};
    this.textures = {};
    this.app = null;
  }

  /**
   * Initialize the asset manager with a PIXI application
   * @param {any} app - The PIXI application instance
   */
  initialize(app: any): void {
    this.app = app;
  }

  /**
   * Load the asset manifest file
   * @returns {Promise<AssetManifest>} - Resolves when manifest is loaded
   */
  async loadManifest(): Promise<AssetManifest> {
    try {
      const response = await fetch('/assets/manifest.json');
      this.manifest = await response.json();
      return this.manifest;
    } catch (error) {
      console.error('Failed to load asset manifest:', error);
      throw error;
    }
  }

  /**
   * Generate placeholder assets for development
   * @returns {Promise<boolean>} - Resolves when all placeholders are generated
   */
  async generatePlaceholders(): Promise<boolean> {
    if (!this.app) {
      throw new Error('AssetManager must be initialized with a PIXI application before generating placeholders');
    }

    const promises: Promise<any>[] = [];

    // Process each category in the manifest
    Object.keys(this.manifest).forEach(category => {
      Object.keys(this.manifest[category]).forEach(assetId => {
        const asset = this.manifest[category][assetId];
        promises.push(this.generatePlaceholder(category, assetId, asset));
      });
    });

    await Promise.all(promises);
    return true;
  }

  /**
   * Generate a single placeholder asset
   * @param {string} category - Asset category
   * @param {string} assetId - Asset ID
   * @param {Asset} asset - Asset data from manifest
   * @returns {Promise<File>} - Resolves when placeholder is generated
   */
  async generatePlaceholder(category: string, assetId: string, asset: Asset): Promise<File> {
    // Create a temporary canvas for generating the placeholder
    const canvas = document.createElement('canvas');
    canvas.width = asset.width;
    canvas.height = asset.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Fill with a color based on category and asset type
    let color: string;
    switch (category) {
      case 'ships':
        if (assetId.includes('battleship')) color = '#FF0000'; // Red
        else if (assetId.includes('carrier')) color = '#0000FF'; // Blue
        else if (assetId.includes('cruiser')) color = '#00FF00'; // Green
        else if (assetId.includes('destroyer')) color = '#FFFF00'; // Yellow
        else if (assetId.includes('submarine')) color = '#800080'; // Purple
        else color = '#CCCCCC'; // Gray
        break;
      case 'aircraft':
        if (assetId.includes('fighter')) color = '#FF0000'; // Red
        else if (assetId.includes('bomber')) color = '#0000FF'; // Blue
        else if (assetId.includes('torpedo')) color = '#00FF00'; // Green
        else color = '#CCCCCC'; // Gray
        break;
      case 'map':
        if (assetId === 'pacific') color = '#0077BE'; // Ocean blue
        else if (assetId.includes('base_naval')) color = '#0000FF'; // Blue
        else if (assetId.includes('base_army')) color = '#008000'; // Green
        else color = '#CCCCCC'; // Gray
        break;
      case 'ui':
        color = '#444444'; // Dark gray
        break;
      case 'effects':
        if (assetId.includes('explosion')) color = '#FF4500'; // Orange-red
        else if (assetId.includes('cannon')) color = '#FFFF00'; // Yellow
        else color = '#CCCCCC'; // Gray
        break;
      default:
        color = '#CCCCCC'; // Gray
    }

    // Fill background
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, asset.width, asset.height);

    // Add a border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, asset.width - 4, asset.height - 4);

    // Add text label
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `${Math.max(12, asset.height / 8)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Format the text to fit
    let text = assetId;
    if (asset.width < 200 && text.length > 10) {
      // Split long text for small assets
      const parts = text.split('_');
      text = parts.join('\n');
    }
    
    // Handle multi-line text
    if (text.includes('\n')) {
      const lines = text.split('\n');
      const lineHeight = Math.max(12, asset.height / 8) * 1.2;
      const startY = asset.height / 2 - (lines.length - 1) * lineHeight / 2;
      
      lines.forEach((line, index) => {
        ctx.fillText(line, asset.width / 2, startY + index * lineHeight);
      });
    } else {
      ctx.fillText(text, asset.width / 2, asset.height / 2);
    }

    // For animation frames, add frame indicators
    if (asset.frames) {
      const frameWidth = asset.width / asset.frames;
      for (let i = 0; i < asset.frames; i++) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.strokeRect(i * frameWidth, 0, frameWidth, asset.height);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px Arial';
        ctx.fillText(`${i+1}`, i * frameWidth + frameWidth / 2, 10);
      }
    }

    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          reject(new Error('Failed to create blob from canvas'));
          return;
        }

        try {
          // Create a File object from the blob
          const file = new File([blob], asset.current.split('/').pop() || 'placeholder.png', { type: 'image/png' });
          
          // In a real application, you would upload this file to your server
          // For now, we'll just log it and pretend it was saved
          console.log(`Generated placeholder for ${category}/${assetId}:`, file);
          
          // In a real app, you'd do something like:
          // await this.uploadPlaceholder(file, asset.current);
          
          resolve(file);
        } catch (error) {
          reject(error);
        }
      }, 'image/png');
    });
  }

  /**
   * Load all assets based on the manifest
   * @returns {Promise<{[key: string]: Texture}>} - Resolves when all assets are loaded
   */
  async loadAllAssets(): Promise<{[key: string]: Texture}> {
    if (!this.app) {
      throw new Error('AssetManager must be initialized with a PIXI application before loading assets');
    }

    // Create a list of all assets to load
    const assetsToLoad: {id: string; path: string}[] = [];
    
    // Process each category in the manifest
    Object.keys(this.manifest).forEach(category => {
      Object.keys(this.manifest[category]).forEach(assetId => {
        const asset = this.manifest[category][assetId];
        // Use current path (placeholder or final)
        assetsToLoad.push({
          id: `${category}_${assetId}`,
          path: asset.current
        });
      });
    });
    
    // Load all assets
    return new Promise((resolve) => {
      // In a real implementation, you would use PIXI.Loader
      // For now, we'll simulate loading
      console.log('Loading assets:', assetsToLoad);
      
      // Simulate loading time
      setTimeout(() => {
        // Pretend all assets are loaded
        assetsToLoad.forEach(asset => {
          // In a real implementation, this would be a PIXI.Texture
          this.textures[asset.id] = {
            id: asset.id,
            path: asset.path
          };
        });
        
        resolve(this.textures);
      }, 1000);
    });
  }

  /**
   * Get a texture by category and asset ID
   * @param {string} category - Asset category
   * @param {string} assetId - Asset ID
   * @returns {Texture} - The texture
   */
  getTexture(category: string, assetId: string): Texture {
    const id = `${category}_${assetId}`;
    return this.textures[id];
  }

  /**
   * Replace a placeholder asset with a final asset
   * @param {string} category - Asset category
   * @param {string} assetId - Asset ID
   * @param {File} file - The new asset file
   * @returns {Promise<boolean>} - Resolves when asset is replaced
   */
  async replaceAsset(category: string, assetId: string, file: File): Promise<boolean> {
    const asset = this.manifest[category]?.[assetId];
    
    if (!asset) {
      throw new Error(`Asset not found: ${category}/${assetId}`);
    }
    
    if (asset.replaced) {
      console.warn(`Asset already replaced: ${category}/${assetId}`);
    }
    
    // In a real implementation, you would upload the file to your server
    // and update the asset path in the manifest
    console.log(`Replacing asset ${category}/${assetId} with file:`, file);
    
    // Update the manifest
    asset.current = asset.final;
    asset.replaced = true;
    
    // Update the texture
    const id = `${category}_${assetId}`;
    
    // In a real implementation, you would load the new texture
    // For now, we'll just update the path
    this.textures[id] = {
      id,
      path: asset.final
    };
    
    // Save the updated manifest
    this.saveManifest();
    
    return true;
  }

  /**
   * Replace all assets in a category
   * @param {string} category - Asset category
   * @returns {Promise<boolean[]>} - Resolves when all assets in the category are replaced
   */
  async replaceCategory(category: string): Promise<boolean[]> {
    const assets = this.manifest[category];
    
    if (!assets) {
      throw new Error(`Category not found: ${category}`);
    }
    
    const promises: Promise<boolean>[] = [];
    
    Object.keys(assets).forEach(assetId => {
      const asset = assets[assetId];
      
      if (!asset.replaced) {
        // In a real implementation, you would load the final asset
        // For now, we'll just update the manifest
        asset.current = asset.final;
        asset.replaced = true;
        
        // Update the texture
        const id = `${category}_${assetId}`;
        this.textures[id] = {
          id,
          path: asset.final
        };
        
        promises.push(Promise.resolve(true));
      }
    });
    
    // Save the updated manifest
    this.saveManifest();
    
    return Promise.all(promises);
  }

  /**
   * Replace all assets
   * @returns {Promise<boolean[][]>} - Resolves when all assets are replaced
   */
  async replaceAllAssets(): Promise<boolean[][]> {
    const promises: Promise<boolean[]>[] = [];
    
    Object.keys(this.manifest).forEach(category => {
      promises.push(this.replaceCategory(category));
    });
    
    return Promise.all(promises);
  }

  /**
   * Save the updated manifest
   * @returns {Promise<boolean>} - Resolves when manifest is saved
   */
  saveManifest(): Promise<boolean> {
    // In a real implementation, you would save the manifest to the server
    console.log('Saving manifest:', this.manifest);
    
    // For now, we'll just log it
    return Promise.resolve(true);
  }
}
