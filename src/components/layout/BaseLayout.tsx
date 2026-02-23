import React, { Suspense, lazy, useRef } from 'react';
import Navbar from './Navbar';
import BackgroundGradient from '../common/BackgroundGradient';

const Footer = lazy(() => import('./Footer/Footer'));

export const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen flex flex-col relative w-full">
      <BackgroundGradient>
        {/* Content */}
        <div className="relative flex-1 flex flex-col z-10 w-full">
          <Navbar />

          <main ref={mainRef} className="flex-1 w-full">
            {children}
          </main>

          <Suspense fallback={<div className="h-24" aria-hidden="true" />}>
            <Footer />
          </Suspense>
        </div>
      </BackgroundGradient>
    </div>
  );
};

export default BaseLayout;
