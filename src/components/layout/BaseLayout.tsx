import React from "react";
import { useRef } from 'react';
import Footer from './Footer/Footer';
import Navbar from './Navbar';
import BackgroundGradient from '../common/BackgroundGradient';

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

          <Footer />
        </div>
      </BackgroundGradient>
    </div>
  );
};

export default BaseLayout;
