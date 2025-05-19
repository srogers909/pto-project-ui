/**
 * Utility functions for generating placeholder assets
 */

// Define asset types
export interface Asset {
  current: string;
  final: string;
  width: number;
  height: number;
  replaced: boolean;
  description: string;
  frames?: number;
}

export interface AssetCategory {
  [assetId: string]: Asset;
}

export interface AssetManifest {
  [category: string]: AssetCategory;
}

/**
 * Generate a placeholder image for a specific asset
 * @param {string} category - Asset category
 * @param {string} assetId - Asset ID
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {Promise<Blob>} - Resolves with the generated image blob
 */
export function generatePlaceholderImage(
  category: string,
  assetId: string,
  width: number,
  height: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      // Create a canvas for the placeholder
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      // Fill with a color based on category and asset type
      let color;
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
      ctx.fillRect(0, 0, width, height);
      
      // Add a border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(2, 2, width - 4, height - 4);
      
      // Add text label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `${Math.max(12, height / 8)}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Format the text to fit
      let text = assetId;
      if (width < 200 && text.length > 10) {
        // Split long text for small assets
        const parts = text.split('_');
        text = parts.join('\n');
      }
      
      // Handle multi-line text
      if (text.includes('\n')) {
        const lines = text.split('\n');
        const lineHeight = Math.max(12, height / 8) * 1.2;
        const startY = height / 2 - (lines.length - 1) * lineHeight / 2;
        
        lines.forEach((line, index) => {
          ctx.fillText(line, width / 2, startY + index * lineHeight);
        });
      } else {
        ctx.fillText(text, width / 2, height / 2);
      }
      
      // For animation frames, add frame indicators
      if (height > 50 && width > 100) {
        const frames = Math.floor(width / height);
        if (frames > 1) {
          const frameWidth = width / frames;
          for (let i = 0; i < frames; i++) {
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1;
            ctx.strokeRect(i * frameWidth, 0, frameWidth, height);
            
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '10px Arial';
            ctx.fillText(`${i+1}`, i * frameWidth + frameWidth / 2, 10);
          }
        }
      }
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      }, 'image/png');
    } catch (error) {
      reject(error);
    }
  });
}
