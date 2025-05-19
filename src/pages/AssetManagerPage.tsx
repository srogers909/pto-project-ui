import React from 'react';
import AssetManagerComponent from '../components/AssetManagerComponent';
import '../styles/AssetManagerPage.css';

/**
 * Page component for the asset manager
 */
const AssetManagerPage: React.FC = () => {
  return (
    <div className="asset-manager-page">
      <h1>Asset Manager</h1>
      <p>
        Use this tool to manage game assets. You can generate placeholder assets for development
        and replace them with final assets when they are ready.
      </p>
      <AssetManagerComponent />
    </div>
  );
};

export default AssetManagerPage;
