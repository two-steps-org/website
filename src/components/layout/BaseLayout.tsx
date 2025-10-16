import { useRef } from 'react';
import Footer from './Footer/Footer';
import Navbar from './Navbar';
import ParticleBackground from '../ParticleBackground';

export const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden w-full">
      {/* Background */}
      <div className="fixed inset-0">
        <ParticleBackground />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      </div>

      {/* Content */}
      <div className="relative flex-1 flex flex-col z-10 w-full">
        <Navbar />

        <main ref={mainRef} className="flex-1 w-full">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default BaseLayout;
