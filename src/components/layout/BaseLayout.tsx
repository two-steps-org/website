import React, { Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import BackgroundGradient from '../common/BackgroundGradient';
import { BookCallProvider } from '../BookCall/BookCallProvider';

const Footer = lazy(() => import('./Footer/Footer'));

const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <BookCallProvider>
      <div className="min-h-screen flex flex-col relative w-full">
        <BackgroundGradient pathname={pathname}>
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

          </div>
        </BackgroundGradient>
      </div>
    </BookCallProvider>
  );
};

export default BaseLayout;
