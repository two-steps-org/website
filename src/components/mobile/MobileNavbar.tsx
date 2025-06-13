import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import Logo from '../Logo';
import { useOptimizedScroll } from '../../utils/performance';

const MenuButton = ({ children, onClick, isActive }) => {
  const [isHovered, setIsHovered] = useState(false);
  const textRef = useRef(null);

  return (
    <motion.button
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className="relative text-gray-300 hover:text-white py-2.5 px-3 transition-all duration-300 group flex items-center gap-2"
    >
      <span ref={textRef} className="relative z-10">{children}</span>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 16, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden flex items-center"
          >
            <ArrowRight className="w-4 h-4 flex-shrink-0" />
          </motion.div>
        )}
      </AnimatePresence>
      {isActive && (
        <motion.div
          layoutId="underline"
          className="absolute bottom-1 left-0 h-px bg-white"
          style={{ width: textRef.current ? textRef.current.offsetWidth : 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
};

const menuItems = [
  { label: 'Home', href: 'home' },
  { label: 'Services', href: 'services' },
  { label: 'Why Us', href: 'why-us' },
  { label: 'Process', href: 'process' },
  { label: 'Team', href: 'team' },
  { label: 'Q&A', href: 'faq' },
  { label: 'Case Studies', href: '/case-studies', isExternal: true }
];

const MobileNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Enhanced scroll locking
  useEffect(() => {
    let scrollPosition = 0;
    if (isMenuOpen) {
      scrollPosition = window.pageYOffset;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isMenuOpen]);

  // Section tracking
  const handleScroll = useCallback(() => {
    if (location.pathname !== '/' || isMenuOpen) return;

    const sections = menuItems
      .map((item) => item.href)
      .filter((href) => !href.startsWith('/'));

    const scrollPosition = window.scrollY + window.innerHeight / 3;

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const { top, bottom } = element.getBoundingClientRect();
        const elementTop = top + window.scrollY;
        const elementBottom = bottom + window.scrollY;

        if (
          scrollPosition >= elementTop &&
          scrollPosition <= elementBottom
        ) {
          setActiveSection(section);
          break;
        }
      }
    }
  }, [isMenuOpen, location.pathname]);

  useOptimizedScroll(() => handleScroll());

  useEffect(() => {
    if (location.pathname === '/') {
      handleScroll();
    } else {
      setActiveSection(location.pathname.replace('/', ''));
    }
  }, [location.pathname, handleScroll]);

  const handleBookCall = () => {
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);

    window.open('https://calendly.com/yoniinsell/30min', '_blank');
    setIsMenuOpen(false);
  };

  const handleClick = (href: string) => {
    setIsMenuOpen(false);
    if (href.startsWith('/#')) {
      const element = document.getElementById(href.replace('/#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/90 to-black/85 backdrop-blur-xl" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 opacity-30" />
        <div className="absolute bottom-0 h-px w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      </div>

      <nav className="px-4 py-3 relative">
        <div className="flex items-center justify-between">
          <button
            onClick={() => scrollToSection('home')}
            className="relative z-50 flex items-center -ml-2 p-2"
          >
            <Logo className="h-8 w-auto" />
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative z-50 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-0 top-0 min-h-screen bg-black/95 backdrop-blur-xl pt-20"
          >
            <div className="px-4 py-4 space-y-4">
              {menuItems.map((item) => (
                <div key={item.label} className="relative w-fit">
                  <MenuButton
                    onClick={() => handleClick(item.href)}
                    isActive={activeSection === item.href || (item.isExternal && location.pathname === item.href)}
                  >
                    {item.label}
                  </MenuButton>
                </div>
              ))}

              <motion.button
                onClick={handleBookCall}
                whileTap={{ scale: 0.98 }}
                whileHover={{ gap: '0.75rem' }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                <span>Book a Call</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default MobileNavbar;