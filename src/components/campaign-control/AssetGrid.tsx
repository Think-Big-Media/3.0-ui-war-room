// Asset Grid Component

import type React from 'react';
import { motion } from 'framer-motion';
import AssetCard from './AssetCard';
import { type Asset } from '../../types/campaign';
import { createLogger } from '../../utils/logger';

const logger = createLogger('AssetGrid');

interface AssetGridProps {
  assets: Asset[];
}

const AssetGrid: React.FC<AssetGridProps> = ({ assets }) => {
  const handleAssetView = (asset: Asset) => {
    logger.info('View asset:', asset.name);
    // Handle asset viewing
  };

  const handleAssetDownload = (asset: Asset) => {
    logger.info('Download asset:', asset.name);
    // Handle asset download
  };

  const handleAssetShare = (asset: Asset) => {
    logger.info('Share asset:', asset.name);
    // Handle asset sharing
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {assets.map((asset) => (
        <AssetCard
          key={asset.id}
          asset={asset}
          onView={handleAssetView}
          onDownload={handleAssetDownload}
          onShare={handleAssetShare}
        />
      ))}
    </motion.div>
  );
};

export default AssetGrid;
