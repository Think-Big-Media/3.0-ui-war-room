/**
 * War Room Home Page - Builder.io Integration
 * This page renders content from Builder.io CMS
 */

import React from 'react';
import { BuilderContent } from '../components/BuilderContent';

const HomePage: React.FC = () => {
  // Builder.io API key from environment
  const builderApiKey = import.meta.env.VITE_BUILDER_IO_KEY || '8686f311497044c0932b7d2247296478';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header with Logo */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <img 
                src="/images/WarRoom_Logo_White.png" 
                alt="War Room" 
                className="h-10 w-auto"
              />
              <span className="ml-3 text-white text-xl font-bold">War Room 3.0</span>
            </div>
            <nav className="flex space-x-6">
              <a href="#dashboard" className="text-white/80 hover:text-white transition">
                Dashboard
              </a>
              <a href="#settings" className="text-white/80 hover:text-white transition">
                Settings
              </a>
              <a href="https://builder.io" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition">
                Builder
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Builder.io Content Area */}
      <main className="flex-1">
        {builderApiKey ? (
          <BuilderContent 
            modelName="page"
            apiKey={builderApiKey}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 text-center">
              <h1 className="text-4xl font-bold text-white mb-4">
                Welcome to War Room 3.0
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Crisis Management Platform - V2 Development Environment
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/5 backdrop-blur p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Builder.io Ready</h3>
                  <p className="text-white/70">Visual CMS integration configured</p>
                </div>
                <div className="bg-white/5 backdrop-blur p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Mock Services</h3>
                  <p className="text-white/70">Frontend-first development</p>
                </div>
                <div className="bg-white/5 backdrop-blur p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">API Bridge</h3>
                  <p className="text-white/70">Ready for Leap.new/Encore</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-md border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-white/60 text-sm">
            War Room 3.0 - V2 Development Environment - Clean Implementation
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;