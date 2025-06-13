import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Home, Lightbulb, Brain, Workflow, Users, HelpCircle, FileText } from 'lucide-react';
import Logo from '../Logo';
import { NavBar } from '../ui/tubelight-navbar';

const Navbar = () => {
  const handleBookCall = useCallback(() => {
    window.open('https://calendly.com/yoniinsell/30min', '_blank');
  }, []);
  
  const navItems = [
    { name: 'Home', url: '#home', icon: Home },
    { name: 'Services', url: '#services', icon: Lightbulb },
    { name: 'Why Us', url: '#why-us', icon: Brain },
    { name: 'Process', url: '#process', icon: Workflow },
    { name: 'Team', url: '#team', icon: Users },
    { name: 'Q&A', url: '#faq', icon: HelpCircle },
    { name: 'Case Studies', url: '/case-studies', icon: FileText }
  ];
  
  const handleNavigation = (url: string) => {
    if (url.startsWith('#')) {
      const element = document.getElementById(url.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = url;
    }
  };
  
  const handleLogoClick = () => {
    // Check if we're on the case studies page
    if (window.location.href.includes('case-studies')) {
      // Go to home page
      window.location.href = '/';
    } else {
      // We're on the main page - try multiple approaches to scroll to top
      
      // First approach: use window.scrollTo with smooth behavior
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // As a fallback, also try scrolling to the home section
      const homeSection = document.getElementById('home');
      if (homeSection) {
        homeSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      <nav className="relative w-full h-20 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-center justify-between">
          <button
            onClick={handleLogoClick}
            className="relative z-50 shrink-0"
          >
            <Logo />
          </button>
          <NavBar 
            items={navItems} 
            onItemClick={handleNavigation}
          />
          <motion.button
            onClick={handleBookCall}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium shrink-0
            hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center gap-2
            border border-transparent hover:border-purple-500/50"
          >
            Book a Call
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </nav>
    </header>
  );
};

export default React.memo(Navbar);