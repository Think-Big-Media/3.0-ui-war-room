/**
 * Privacy Policy Page
 * Privacy policy and data handling information
 */

import React from 'react';
import { BuilderContent } from '../components/BuilderContent';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <BuilderContent 
        modelName="privacy-policy"
        apiKey={import.meta.env.VITE_BUILDER_IO_KEY}
      />
    </div>
  );
};

export default Privacy;