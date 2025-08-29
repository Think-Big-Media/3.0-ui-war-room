import React from 'react';

interface TacticalCamouflageBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  opacity?: number;
}

const TacticalCamouflageBackground: React.FC<TacticalCamouflageBackgroundProps> = ({ 
  className = '', 
  children,
  opacity = 0.9 
}) => {
  return (
    <div className={className || 'fixed inset-0'}>
      {/* Camouflage Background */}
      <div className="absolute inset-0">
        {/* Base camouflage pattern */}
        <div 
          className="absolute inset-0" 
          style={{
            opacity: opacity,
            background: '#1a202c',
            backgroundImage: 'radial-gradient(circle at 20% 30%, #2d3748 0%, transparent 50%), radial-gradient(circle at 80% 20%, #4a5568 0%, transparent 50%), radial-gradient(circle at 40% 70%, #1a202c 0%, transparent 50%), radial-gradient(circle at 90% 80%, #2d3748 0%, transparent 50%), radial-gradient(circle at 10% 90%, #4a5568 0%, transparent 50%), radial-gradient(circle at 70% 10%, #1a202c 0%, transparent 50%), radial-gradient(circle at 60% 50%, #2d3748 0%, transparent 50%), linear-gradient(135deg, #1a202c 0%, #2d3748 25%, #4a5568 50%, #2d3748 75%, #1a202c 100%)',
            backgroundSize: '200px 200px, 300px 300px, 250px 250px, 180px 180px, 220px 220px, 280px 280px, 160px 160px, 100% 100%'
          }} 
        />
        
        {/* Overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-transparent to-gray-800/30" />
        
        {/* Subtle texture overlay */}
        <div 
          className="absolute inset-0 opacity-10" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} 
        />
      </div>

      {/* Content */}
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
};

export default TacticalCamouflageBackground;