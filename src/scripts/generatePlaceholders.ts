/**
 * Script to generate placeholder images for all assets in the manifest
 * 
 * This script is meant to be run from the command line:
 * npx ts-node src/scripts/generatePlaceholders.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { createCanvas } from 'canvas';

// Path to the manifest file
const MANIFEST_PATH = path.join(__dirname, '../../public/assets/manifest.json');

// Root directory for assets
const ASSETS_ROOT = path.join(__dirname, '../../public');

interface Asset {
  current: string;
  final: string;
  width: number;
  height: number;
  replaced: boolean;
  description: string;
  frames?: number;
}

interface Manifest {
  [category: string]: {
    [assetId: string]: Asset;
  };
}

/**
 * Generate a placeholder image and save it to disk
 * @param {string} category - Asset category
 * @param {string} assetId - Asset ID
 * @param {Asset} asset - Asset data from manifest
 */
async function generatePlaceholder(category: string, assetId: string, asset: Asset): Promise<void> {
  console.log(`Generating placeholder for ${category}/${assetId}...`);
  
  // Create a canvas for the placeholder
  const canvas = createCanvas(asset.width, asset.height);
  const ctx = canvas.getContext('2d');
  
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
  
  // Ensure the directory exists
  const outputPath = path.join(ASSETS_ROOT, asset.current);
  const outputDir = path.dirname(outputPath);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  
  console.log(`Saved placeholder to ${outputPath}`);
}

/**
 * Generate all placeholder assets based on the manifest
 */
async function generateAllPlaceholders(): Promise<void> {
  try {
    // Read the manifest
    const manifestData = fs.readFileSync(MANIFEST_PATH, 'utf8');
    const manifest: Manifest = JSON.parse(manifestData);
    
    // Generate placeholders for all assets
    for (const category in manifest) {
      for (const assetId in manifest[category]) {
        const asset = manifest[category][assetId];
        await generatePlaceholder(category, assetId, asset);
      }
    }
    
    console.log('All placeholder assets generated successfully');
  } catch (error) {
    console.error('Failed to generate placeholder assets:', error);
    process.exit(1);
  }
}

// Run the script
generateAllPlaceholders();
