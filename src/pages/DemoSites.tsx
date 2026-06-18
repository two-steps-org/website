'use client';
import { useEffect } from 'react';

function DemoSites() {
  const demoSiteUrl = import.meta.env.VITE_DEMO_SITE_URL || 'http://localhost:3000';

  useEffect(() => {
     window.location.replace(demoSiteUrl);  
  }, [demoSiteUrl]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Redirecting to demo sites...</p>
      </div>
    </div>
  );
}

export default DemoSites;