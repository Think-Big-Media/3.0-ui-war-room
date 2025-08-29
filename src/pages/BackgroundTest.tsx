import React from 'react';

const BackgroundTest: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-8 p-12 bg-black/50 backdrop-blur-md rounded-2xl border border-white/20">
        <h1 className="text-5xl font-bold text-white">
          Tactical Camouflage Background
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl">
          This page demonstrates the tactical camouflage background extracted from Magic Path.
          The background is now integrated into your War Room 3.0 UI.
        </p>
        <div className="flex gap-4 justify-center">
          <div className="px-6 py-3 bg-green-600/80 text-white rounded-lg font-semibold">
            Background Active
          </div>
          <div className="px-6 py-3 bg-white/10 text-white rounded-lg border border-white/20">
            60% Opacity
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundTest;