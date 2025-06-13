import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Mail, MapPin, Phone, Facebook, Linkedin, Instagram, X as XIcon } from 'lucide-react';
import Logo from '../Logo';
import LegalModal from '../Footer/LegalModal';

const NavButton = ({ label, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className="text-left text-gray-400 hover:text-blue-400 transition-colors duration-300 text-base group flex items-center gap-2 relative"
    >
      <span className="relative">
        {label}
        <span 
          className={`absolute -bottom-1 left-0 h-px bg-blue-400 transition-all duration-300 ${
            isHovered ? 'w-full' : 'w-0'
          }`}
        />
      </span>
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ 
          width: isHovered ? 16 : 0,
          opacity: isHovered ? 1 : 0
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut"
        }}
        className="overflow-hidden flex items-center"
      >
        <ArrowRight className="w-4 h-4 flex-shrink-0 text-blue-400" />
      </motion.div>
    </motion.button>
  );
};

const navigation = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Process', href: '#process' },
  { label: 'Team', href: '#team' },
  { label: 'Q&A', href: '#faq' },
  { label: 'Case Studies', href: '/case-studies' }
];

const contact = [
  { 
    icon: MapPin, 
    text: "Tel Aviv, Israel",
    href: "https://maps.google.com",
    gradient: "from-blue-500 to-indigo-500"
  },
  { 
    icon: Mail, 
    text: "yoniinsell@gmail.com",
    href: "mailto:yoniinsell@gmail.com",
    gradient: "from-purple-500 to-pink-500"
  },
  { 
    icon: Phone, 
    text: "+972 54 4831148",
    href: "tel:+972544831148",
    gradient: "from-amber-500 to-orange-500"
  }
];

const social = [
  { icon: Facebook, href: "#", label: "Facebook", gradient: "from-blue-500 to-indigo-500" },
  { icon: XIcon, href: "#", label: "X (Twitter)", gradient: "from-purple-500 to-indigo-500" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/two-steps-ai/", label: "LinkedIn", gradient: "from-blue-600 to-blue-800" },
  { icon: Instagram, href: "https://www.instagram.com/twostepsai?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==", label: "Instagram", gradient: "from-purple-500 to-pink-500" }
];

const MobileFooter = () => {
  const [email, setEmail] = useState('');
  const [selectedLegal, setSelectedLegal] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    setEmail('');
  };

  const handleBookCall = () => {
    window.open('https://calendly.com/yoniinsell/30min', '_blank');
  };

  const scrollToSection = (sectionId) => {
    const scrollToElement = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        const navHeight = 56;
        const elementTop = element.offsetTop;
        const offsetPosition = elementTop - navHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    };

    if (location.pathname === '/') {
      setTimeout(scrollToElement, 50);
    } else {
      navigate('/');
      setTimeout(scrollToElement, 100);
    }
  };

  const handleNavigation = (href) => {
    const sectionMatch = href.match(/#(.+)$/);
    
    if (sectionMatch) {
      const sectionId = sectionMatch[1];
      scrollToSection(sectionId);
    } else if (href.startsWith('/')) {
      navigate(href);
      // Ensure scroll to top for case studies
      if (href === '/case-studies') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    } else {
      window.open(href, '_blank');
    }
  };

  return (
    <footer className="relative mt-auto bg-gradient-to-b from-[#080B1A] to-black">
      {/* Newsletter Section */}
      <div className="relative border-b border-gray-800/50">
        <div className="px-4 py-8">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 backdrop-blur-sm">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />
            <div className="relative">
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Stay Ahead with AI Updates
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Get the latest AI insights and updates delivered straight to your inbox.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Subscribe
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="px-4 py-8">
        {/* Logo & Description */}
        <div className="mb-8">
          <Logo />
          <p className="mt-4 text-gray-400 text-sm">
            <span className="font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Always Be Ahead.
            </span>{' '}
            We craft custom AI solutions, turning complex challenges into seamless automation.
          </p>
        </div>

        {/* Contact Info */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
          <ul className="space-y-4">
            {contact.map((item, index) => (
              <li key={index}>
                <a 
                  href={item.href}
                  className="flex items-center gap-3 group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${item.gradient} p-[1px] group-hover:scale-110 transition-transform duration-300`}>
                    <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <span className="text-gray-400 group-hover:text-blue-400 transition-colors duration-300">
                    {item.text}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-white mb-4">Navigation</h4>
          <ul className="grid grid-cols-2 gap-4">
            {navigation.map((item) => (
              <NavButton
                key={item.label}
                label={item.label}
                onClick={() => handleNavigation(item.href)}
              />
            ))}
          </ul>
        </div>

        {/* Social Links */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            {social.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                whileTap={{ scale: 0.95 }}
                className={`w-10 h-10 rounded-xl bg-gradient-to-r ${item.gradient} p-[1px] group`}
                aria-label={item.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-full h-full rounded-xl bg-gray-900 hover:bg-gray-800 flex items-center justify-center transition-all duration-300">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleBookCall}
          className="w-full px-8 py-3.5 rounded-xl font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2 mb-8"
        >
          Book a Call
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800/50">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setSelectedLegal('privacy')}
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm relative group"
              >
                <span className="relative">
                  Privacy Policy
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-400 transition-all duration-300 group-hover:w-full" />
                </span>
              </button>
              <button
                onClick={() => setSelectedLegal('terms')}
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm relative group"
              >
                <span className="relative">
                  Terms of Service
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-400 transition-all duration-300 group-hover:w-full" />
                </span>
              </button>
              <button
                onClick={() => setSelectedLegal('cookies')}
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm relative group"
              >
                <span className="relative">
                  Cookies Policy
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-400 transition-all duration-300 group-hover:w-full" />
                </span>
              </button>
            </div>
            <p className="text-gray-400 text-sm text-center">
              © {new Date().getFullYear()} Two Steps. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
      
      {/* Legal Modals */}
      <LegalModal
        type={selectedLegal}
        onClose={() => setSelectedLegal(null)}
      />
    </footer>
  );
};

export default MobileFooter;