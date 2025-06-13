import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const MobileHeader = () => {
  return (
    <header className="pt-16 bg-black/95 backdrop-blur-xl border-b border-gray-800/50">
      <div className="px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-white">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>
        <img src="/two-steps-logo.png" alt="Two Steps" className="h-8" />
      </div>
      <div className="px-4 pb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Case Studies
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Discover how we've helped businesses transform with AI
        </p>
      </div>
    </header>
  );
}

export default MobileHeader;