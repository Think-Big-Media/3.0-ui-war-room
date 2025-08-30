import React from 'react';
import usaPoliticalMap from '../../assets/usa-political-map.svg';

const InteractivePoliticalMap: React.FC = () => {

  return (
    <div className="relative w-full h-full">
      <img 
        src={usaPoliticalMap}
        alt="USA Political Map"
        className="w-full h-full object-contain"
        style={{
          filter: 'invert(1) brightness(0.8) contrast(1.2)'
        }}
      />
    </div>
  );
};

export default InteractivePoliticalMap;