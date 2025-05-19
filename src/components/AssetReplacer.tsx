import React, { useState, useEffect } from 'react';
import AssetManager from '../services/AssetManager';
import { AssetManifest } from '../utils/placeholderGenerator';
import '../styles/AssetReplacer.css';

interface AssetReplacerProps {
  assetManager: AssetManager;
  onAssetReplaced?: (category: string, assetId: string) => void;
}

const AssetReplacer: React.FC<AssetReplacerProps> = ({ assetManager, onAssetReplaced }) => {
  const [manifest, setManifest] = useState<AssetManifest>({});
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Load the manifest when the component mounts
    const loadManifest = async () => {
      try {
        setLoading(true);
        const manifest = await assetManager.loadManifest();
        setManifest(manifest);
        
        // Set the first category as active
        const categories = Object.keys(manifest);
        if (categories.length > 0) {
          setActiveCategory(categories[0]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to load manifest:', error);
        setMessage('Failed to load asset manifest');
        setLoading(false);
      }
    };
    
    loadManifest();
  }, [assetManager]);

  // Handle file selection for asset replacement
  const handleFileSelect = async (category: string, assetId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }
    
    const file = files[0];
    
    try {
      setMessage(`Replacing ${category}/${assetId}...`);
      await assetManager.replaceAsset(category, assetId, file);
      setMessage(`Successfully replaced ${category}/${assetId}`);
      
      // Update the manifest in state
      const updatedManifest = { ...manifest };
      updatedManifest[category][assetId].replaced = true;
      setManifest(updatedManifest);
      
      // Notify parent component
      if (onAssetReplaced) {
        onAssetReplaced(category, assetId);
      }
    } catch (error) {
      console.error('Failed to replace asset:', error);
      setMessage(`Failed to replace ${category}/${assetId}`);
    }
  };

  // Handle replacing all assets in a category
  const handleReplaceCategory = async (category: string) => {
    try {
      setMessage(`Replacing all assets in ${category}...`);
      await assetManager.replaceCategory(category);
      setMessage(`Successfully replaced all assets in ${category}`);
      
      // Update the manifest in state
      const updatedManifest = { ...manifest };
      Object.keys(updatedManifest[category]).forEach(assetId => {
        updatedManifest[category][assetId].replaced = true;
      });
      setManifest(updatedManifest);
      
      // Notify parent component for each asset
      if (onAssetReplaced) {
        Object.keys(manifest[category]).forEach(assetId => {
          onAssetReplaced(category, assetId);
        });
      }
    } catch (error) {
      console.error('Failed to replace category:', error);
      setMessage(`Failed to replace all assets in ${category}`);
    }
  };

  // Handle replacing all assets
  const handleReplaceAll = async () => {
    try {
      setMessage('Replacing all assets...');
      await assetManager.replaceAllAssets();
      setMessage('Successfully replaced all assets');
      
      // Update the manifest in state
      const updatedManifest = { ...manifest };
      Object.keys(updatedManifest).forEach(category => {
        Object.keys(updatedManifest[category]).forEach(assetId => {
          updatedManifest[category][assetId].replaced = true;
        });
      });
      setManifest(updatedManifest);
      
      // Notify parent component for each asset
      if (onAssetReplaced) {
        Object.keys(manifest).forEach(category => {
          Object.keys(manifest[category]).forEach(assetId => {
            onAssetReplaced(category, assetId);
          });
        });
      }
    } catch (error) {
      console.error('Failed to replace all assets:', error);
      setMessage('Failed to replace all assets');
    }
  };

  if (loading) {
    return <div>Loading asset manifest...</div>;
  }

  return (
    <div className="asset-replacer">
      <h2>Asset Replacement</h2>
      
      {message && (
        <div className="message">
          {message}
          <button onClick={() => setMessage('')}>Clear</button>
        </div>
      )}
      
      <div className="category-tabs">
        {Object.keys(manifest).map(category => (
          <button
            key={category}
            className={category === activeCategory ? 'active' : ''}
            onClick={() => setActiveCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="category-actions">
        <button onClick={() => handleReplaceCategory(activeCategory)}>
          Replace All {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
        </button>
        <button onClick={handleReplaceAll}>Replace All Assets</button>
      </div>
      
      <div className="asset-list">
        {activeCategory && manifest[activeCategory] && Object.keys(manifest[activeCategory]).map(assetId => {
          const asset = manifest[activeCategory][assetId];
          return (
            <div key={assetId} className={`asset-item ${asset.replaced ? 'replaced' : ''}`}>
              <div className="asset-preview">
                <img
                  src={asset.current}
                  alt={assetId}
                  style={{ width: '100px', height: 'auto' }}
                />
              </div>
              
              <div className="asset-info">
                <div className="asset-name">{assetId}</div>
                <div className="asset-description">{asset.description}</div>
                <div className="asset-dimensions">
                  {asset.width}x{asset.height}
                </div>
                <div className="asset-status">
                  {asset.replaced ? 'Replaced' : 'Placeholder'}
                </div>
              </div>
              
              <div className="asset-actions">
                <label className="replace-button">
                  {asset.replaced ? 'Update' : 'Replace'}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileSelect(activeCategory, assetId, e)}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>
      
    </div>
  );
};

export default AssetReplacer;
