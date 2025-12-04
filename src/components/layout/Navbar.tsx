'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import Logo from '../Logo';
import { cn } from '../../lib/utils'; // make sure this exists
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { name: 'Home', url: '#home' },
  { name: 'Services', url: '#services' },
  { name: 'Why Us', url: '#why-us' },
  { name: 'Process', url: '#process' },
  { name: 'Team', url: '#team' },
  { name: 'Q&A', url: '#faq' },
  { name: 'Case Studies', url: '/case-studies' },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(navItems[0].name);

  useEffect(() => {
    navItems.map((item) =>
      location.pathname == item.url ? setActiveTab(item.name) : setActiveTab(navItems[0].name),
    );
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== '/') return;

    const sections = navItems
      .filter((i) => i.url.startsWith('#'))
      .map((i) => {
        const el = document.getElementById(i.url.slice(1));
        return { ...i, element: el };
      })
      .filter((s) => s.element);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = sections.find((s) => s.element === entry.target);
            if (section) {
              setActiveTab(section.name);
            }
          }
        });
      },
      {
        root: null,
        threshold: 0.3,
        rootMargin: '0px 0px -10% 0px',
      },
    );

    sections.forEach((s) => s.element && observer.observe(s.element));
    return () => observer.disconnect();
  }, [location.pathname]);

  const handleNavigation = useCallback(
    (url: string, name: string) => {
      setActiveTab(name);
      setIsMenuOpen(false);

      if (url.startsWith('#')) {
        const el = document.getElementById(url.slice(1));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (location.pathname !== '/') {
          navigate('/');
          setTimeout(() => {
            const target = document.getElementById(url.slice(1));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 300);
        }
      } else {
        navigate(url);
      }
    },
    [navigate, location.pathname],
  );

  const handleBookCall = useCallback(() => {
    window.open('https://calendly.com/yoni-insell-twosteps/30min', '_blank');
    setIsMenuOpen(false);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => handleNavigation('/#home', 'Home')}
          className="flex items-center focus:outline-none"
        >
          <Logo />
        </button>

        {/* Desktop Nav */}
        <div className="hidden lg:flex flex-1 justify-center">
          <div className="flex items-center gap-3 bg-gray-900/50 border border-gray-800/50 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
            {navItems.map((item) => {
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.url, item.name)}
                  className={cn(
                    'relative cursor-pointer text-sm font-semibold px-4 py-2 rounded-full transition-colors',
                    'text-gray-400 hover:text-white',
                    isActive && 'text-white',
                  )}
                >
                  <span className="hidden md:inline">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="lamp"
                      className="absolute inset-0 w-full bg-blue-500/5 rounded-full -z-10"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-t-full">
                        <div className="absolute w-12 h-6 bg-blue-500/20 rounded-full blur-md -top-2 -left-2" />
                        <div className="absolute w-8 h-6 bg-blue-500/20 rounded-full blur-md -top-1" />
                        <div className="absolute w-4 h-4 bg-blue-500/20 rounded-full blur-sm top-0 left-2" />
                      </div>
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA (Desktop) */}
        <div className="hidden lg:flex">
          <motion.button
            onClick={handleBookCall}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-lg text-sm font-medium shadow hover:shadow-blue-500/25 transition-all flex items-center gap-2"
          >
            Book a Call
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      <LazyMotion features={domAnimation}>
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black z-40 lg:hidden"
                onClick={() => setIsMenuOpen(false)}
              />

              {/* Drawer Panel */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed inset-y-0 right-0 w-screen max-w-sm bg-black/95 h-fit p-6 flex flex-col space-y-6 z-50 lg:hidden"
              >
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.url, item.name)}
                    className={`text-lg font-medium text-left ${
                      activeTab === item.name ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {item.name}
                    {activeTab === item.name && (
                      <div className="w-6 h-1 bg-blue-500 rounded-full mt-1">
                        <div className="absolute w-12 h-6 bg-blue-500/20 rounded-full blur-md -top-2 -left-2" />
                        <div className="absolute w-8 h-6 bg-blue-500/20 rounded-full blur-md -top-1" />
                        <div className="absolute w-4 h-4 bg-blue-500/20 rounded-full blur-sm top-0 left-2" />
                      </div>
                    )}
                  </button>
                ))}

                <motion.button
                  onClick={handleBookCall}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 shadow hover:shadow-purple-500/25 transition-all"
                >
                  <span>Book a Call</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </LazyMotion>
    </header>
  );
};

export default Navbar;
