import React, { useState, useEffect } from 'react';
import AssetManager from '../services/AssetManager';
import AssetReplacer from './AssetReplacer';
import { generatePlaceholderImage, AssetManifest } from '../utils/placeholderGenerator';

/**
 * Component that initializes the AssetManager and provides the AssetReplacer UI
 */
const AssetManagerComponent: React.FC = () => {
  const [assetManager, setAssetManager] = useState<AssetManager | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingPlaceholders, setGeneratingPlaceholders] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<{ total: number; completed: number }>({ total: 0, completed: 0 });

  useEffect(() => {
    const initAssetManager = async () => {
      try {
        setLoading(true);
        
        // Create and initialize the asset manager
        const manager = new AssetManager();
        
        // Create a temporary PIXI application (or mock it)
        const tempApp = {
          renderer: {
            extract: {
              canvas: () => document.createElement('canvas')
            }
          }
        };
        
        manager.initialize(tempApp as any);
        
        // Load the manifest
        await manager.loadManifest();
        
        setAssetManager(manager);
        setLoading(false);
      } catch (err) {
        console.error('Failed to initialize asset manager:', err);
        setError('Failed to initialize asset manager. Check the console for details.');
        setLoading(false);
      }
    };
    
    initAssetManager();
  }, []);

  /**
   * Generate placeholder images for all assets in the manifest
   */
  const handleGeneratePlaceholders = async () => {
    if (!assetManager) return;
    
    try {
      setGeneratingPlaceholders(true);
      
      // Count total assets
      let totalAssets = 0;
      const manifest = assetManager.manifest as AssetManifest;
      Object.keys(manifest).forEach(category => {
        totalAssets += Object.keys(manifest[category]).length;
      });
      
      setGenerationProgress({ total: totalAssets, completed: 0 });
      
      // Generate placeholders for all assets
      let completed = 0;
      
      for (const category in manifest) {
        for (const assetId in manifest[category]) {
          const asset = manifest[category][assetId];
          
          try {
            // Generate the placeholder image
            const blob = await generatePlaceholderImage(category, assetId, asset.width, asset.height);
            
            // In a real application, you would upload this blob to your server
            // For now, we'll just log it
            console.log(`Generated placeholder for ${category}/${assetId}:`, blob);
            
            // Update progress
            completed++;
            setGenerationProgress({ total: totalAssets, completed });
          } catch (err) {
            console.error(`Failed to generate placeholder for ${category}/${assetId}:`, err);
          }
        }
      }
      
      setGeneratingPlaceholders(false);
    } catch (err) {
      console.error('Failed to generate placeholders:', err);
      setError('Failed to generate placeholders. Check the console for details.');
      setGeneratingPlaceholders(false);
    }
  };

  /**
   * Handle asset replacement
   */
  const handleAssetReplaced = (category: string, assetId: string) => {
    console.log(`Asset replaced: ${category}/${assetId}`);
    // You might want to update the UI or notify other components
  };

  if (loading) {
    return <div>Loading asset manager...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => setError(null)}>Dismiss</button>
      </div>
    );
  }

  if (!assetManager) {
    return <div>Asset manager not initialized</div>;
  }

  return (
    <div className="asset-manager-component">
      <div className="actions">
        <button 
          onClick={handleGeneratePlaceholders}
          disabled={generatingPlaceholders}
        >
          Generate Placeholder Assets
        </button>
      </div>
      
      {generatingPlaceholders && (
        <div className="progress">
          <p>Generating placeholders: {generationProgress.completed} / {generationProgress.total}</p>
          <progress value={generationProgress.completed} max={generationProgress.total} />
        </div>
      )}
      
      <AssetReplacer 
        assetManager={assetManager}
        onAssetReplaced={handleAssetReplaced}
      />
    </div>
  );
};

export default AssetManagerComponent;
