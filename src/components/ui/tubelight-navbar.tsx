import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavItem {
  name: string;
  url: string;
  icon: typeof X;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
  onItemClick?: (url: string) => void;
}

export function NavBar({ items, className, onItemClick }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name);

  useEffect(() => {
    // Prepare a list of section objects from items
    const sections = items
      .filter((item) => item.url.startsWith('#'))
      .map((item) => {
        const id = item.url.slice(1);
        return {
          id,
          name: item.name,
          element: document.getElementById(id),
        };
      })
      .filter((section) => section.element !== null);

    if (sections.length === 0) return;

    // Use a finely spaced threshold for a smoother update.
    const thresholds = Array.from({ length: 101 }, (_, i) => i / 100);

    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let newActive = activeTab;
        // Look through each entry to determine which section is most visible.
        entries.forEach((entry) => {
          const section = sections.find((sec) => sec.element === entry.target);
          if (section && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            newActive = section.name;
          }
        });
        setActiveTab(newActive);
      },
      { threshold: thresholds },
    );

    sections.forEach((section) => {
      if (section.element) {
        observer.observe(section.element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [items, activeTab]);

  const handleClick = (item: NavItem) => {
    setActiveTab(item.name);
    if (onItemClick) {
      onItemClick(item.url);
    }
  };

  return (
    <div className={cn('flex-1 flex justify-center', className)}>
      <div className="flex items-center gap-3 bg-gray-900/50 border border-gray-800/50 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;
          return (
            <button
              key={item.name}
              onClick={() => handleClick(item)}
              className={cn(
                'relative cursor-pointer text-sm font-semibold px-4 py-2 rounded-full transition-colors',
                'text-gray-400 hover:text-white',
                isActive && 'text-white',
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-blue-500/5 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
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
  );
}
