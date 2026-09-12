import React, { Suspense, lazy } from 'react';
import Navbar from './Navbar';
import BackgroundGradient from '../common/BackgroundGradient';
import AgentLauncher from '../AgentLauncher';

const Footer = lazy(() => import('./Footer/Footer'));

const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative w-full">
      <BackgroundGradient>
        <div className="relative flex-1 flex flex-col z-10 w-full">
          <Navbar />

          <main className="flex-1 w-full">
            {children}
          </main>
          <div
            className="block md:hidden h-16 pointer-events-none bg-gradient-to-b from-transparent to-bg/70 mobile-safe-pb"
            aria-hidden="true"
          />

          <Suspense fallback={<div className="h-24" aria-hidden="true" />}>
            <Footer />
          </Suspense>

          <AgentLauncher />
        </div>
      </BackgroundGradient>
    </div>
  );
};

export default BaseLayout;
