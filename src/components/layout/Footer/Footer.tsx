'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Facebook,
  Linkedin,
  Instagram,
  MessageSquareText,
  Mic,
  LayoutDashboard,
  Code2,
  X as XIcon,
} from 'lucide-react';
import LegalModal from './LegalModal';
import Logo from '../../Logo';
import clsx from 'clsx';
import { useLocation, useNavigate } from 'react-router-dom';

const navigation = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Process', href: '#process' },
  { label: 'Team', href: '#team' },
  { label: 'Q&A', href: '#faq' },
  { label: 'Case Studies', href: '/case-studies' },
];

const solutions = [
  {
    label: 'AI Chat Agents',
    icon: MessageSquareText,
    href: '/#services',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    label: 'AI Voice Agents',
    icon: Mic,
    href: '/#services',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    label: 'CRM Development',
    icon: LayoutDashboard,
    href: '/#services',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    label: 'Custom SaaS',
    icon: Code2,
    href: '/#services',
    gradient: 'from-green-500 to-emerald-500',
  },
];

const contact = [
  {
    icon: MapPin,
    text: 'Tel Aviv, Israel',
    href: 'https://maps.google.com',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    icon: Mail,
    text: 'yoniinsell@gmail.com',
    href: 'mailto:yoniinsell@gmail.com',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Phone,
    text: '+972 54 4831148',
    href: 'tel:+972544831148',
    gradient: 'from-amber-500 to-orange-500',
  },
];

const social = [
  { icon: Facebook, href: '#', label: 'Facebook', gradient: 'from-blue-500 to-indigo-500' },
  { icon: XIcon, href: '#', label: 'X (Twitter)', gradient: 'from-purple-500 to-indigo-500' },
  {
    icon: Linkedin,
    href: 'https://www.linkedin.com/company/two-steps-ai/',
    label: 'LinkedIn',
    gradient: 'from-blue-600 to-blue-800',
  },
  {
    icon: Instagram,
    href: 'https://www.instagram.com/twostepsai?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    label: 'Instagram',
    gradient: 'from-purple-500 to-pink-500',
  },
];

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLegal, setSelectedLegal] = useState<string | null>(null);

  const handleBookCall = () => {
    window.open('https://calendly.com/yoni-insell-twosteps/30min', '_blank', 'noopener,noreferrer');
  };

  const handleClick = (href: string) => {
    if (href.startsWith('/#')) {
      const element = document.getElementById(href.replace('/#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleNavigation = (href: string) => {
    if (href.startsWith('#')) {
      const el = document.getElementById(href.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const target = document.getElementById(href.slice(1));
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    } else {
      navigate(href);
    }
  };

  return (
    <footer className="relative mt-auto bg-gradient-to-b from-[#080B1A] to-black">
      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Company Info */}
          <div className="lg:col-span-4 space-y-10">
            <div className="w-auto mb-2">
              <Logo className="w-52 h-auto" />
            </div>
            <div className="space-y-6">
              <p className="text-white max-w-sm">
                <span className="font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Always Be Ahead
                </span>
                <br />
                We craft custom AI solutions, turning complex challenges into seamless automation
              </p>
            </div>
            <div className="flex space-x-4">
              {social.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href === '#' ? undefined : item.href}
                  target={item.href === '#' ? undefined : '_blank'}
                  rel={item.href === '#' ? undefined : 'noopener noreferrer'}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={clsx(
                    'w-10 h-10 rounded-xl bg-gradient-to-r p-[1px] group cursor-pointer',
                    item.gradient,
                  )}
                  aria-label={item.label}
                  onClick={(e) => item.href === '#' && e.preventDefault()}
                >
                  <div className="w-full h-full rounded-xl bg-gray-900 hover:bg-gray-800 flex items-center justify-center transition-all duration-300">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                </motion.a>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBookCall}
              className="px-8 py-3.5 rounded-xl font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center gap-2 group"
            >
              Book a Call
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>

          {/* Navigation & Solutions */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-16">
            {/* Navigation */}
            <div>
              <h3 className="text-lg font-semibold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Navigation
              </h3>
              <ul className="space-y-4">
                {navigation.map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => handleNavigation(item.href)}
                      className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-base group flex items-center gap-2"
                    >
                      <span className="relative">
                        {item.label}
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-400 transition-all duration-300 group-hover:w-full" />
                      </span>
                      <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h3 className="text-lg font-semibold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Solutions
              </h3>
              <ul className="space-y-6">
                {solutions.map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => handleClick(item.href)}
                      className="flex items-center gap-3 group w-full text-left"
                    >
                      <div
                        className={clsx(
                          'w-10 h-10 rounded-xl bg-gradient-to-r p-[1px] group-hover:scale-110 transition-transform duration-300 shrink-0',
                          item.gradient,
                        )}
                      >
                        <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <span className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                        <span className="relative flex items-center">
                          <span className="relative">
                            {item.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-400 transition-all duration-300 group-hover:w-full" />
                          </span>
                          <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="text-lg font-semibold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Contact Us
            </h3>
            <ul className="space-y-5">
              {contact.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="flex items-center gap-3 group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div
                      className={clsx(
                        'w-10 h-10 rounded-xl bg-gradient-to-r p-[1px] group-hover:scale-110 transition-transform duration-300',
                        item.gradient,
                      )}
                    >
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
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Two Steps. All Rights Reserved.
            </p>
            <div className="flex items-center space-x-8">
              {['privacy', 'terms', 'cookies'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedLegal(type)}
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm capitalize"
                >
                  {type === 'terms'
                    ? 'Terms of Service'
                    : `${type.charAt(0).toUpperCase() + type.slice(1)} Policy`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legal Modals */}
      <LegalModal type={selectedLegal} onClose={() => setSelectedLegal(null)} />
    </footer>
  );
};

export default Footer;
