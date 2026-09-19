import { m, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import Logo from '../Logo';
import { navItems } from '../../data/navItems';
import { drawerPanel, drawerScrim } from '../../utils/motion';
import type { NavbarNavigate } from './useNavbar';

export const NavbarMobileMenu = ({
  isMenuOpen,
  setIsMenuOpen,
  activeTab,
  handleNavigation,
  handleBookCall,
}: {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  activeTab: string;
  handleNavigation: NavbarNavigate;
  handleBookCall: () => void;
}) => (
  <AnimatePresence>
    {isMenuOpen && (
      <>
        <m.div
          {...drawerScrim}
          className="pointer-events-auto fixed inset-0 bg-bg z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />

        <m.div
          {...drawerPanel}
          className="pointer-events-auto fixed inset-y-0 right-0 w-full h-full bg-bg mobile-safe-px flex flex-col z-50 lg:hidden"
          style={{
            // The header row mirrors the fixed bar, so the logo and the
            // close button land exactly where the bar's logo and toggle were.
            paddingTop: 'max(1rem, env(safe-area-inset-top))',
            paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
          }}
        >
          <div className="flex h-16 items-center justify-between">
            <a
              href="/#home"
              onClick={(event) => handleNavigation('/#home', 'Home', event)}
              aria-label="Go to Home"
              className="flex items-center focus:outline-none"
            >
              <Logo />
            </a>

            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
              className="ts-icon-btn inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-line-strong text-ink hover:bg-surface"
            >
              <X className="w-6 h-6 text-ink" />
            </button>
          </div>

          <div className="mt-6 flex-1 min-h-0 flex flex-col">
            <div className="flex flex-col gap-3.5">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  onClick={(event) => handleNavigation(item.url, item.name, event)}
                  className={clsx(
                    'group block text-base font-medium text-left py-3 px-4 rounded-lg transition-colors min-h-[48px]',
                    activeTab === item.name
                      ? 'text-ink bg-ink/5'
                      : 'text-muted hover:text-ink hover:bg-ink/5',
                  )}
                >
                  <span className="relative inline-flex items-center">
                    <span className="relative inline-block">
                      {item.name}
                      {activeTab === item.name && (
                        <span className="absolute left-0 right-0 -bottom-1 h-[2px] bg-ink rounded-full" />
                      )}
                    </span>
                    <ArrowRight
                      className={clsx(
                        'w-4 h-4 ml-2 text-ink transform transition-all duration-300',
                        activeTab === item.name
                          ? 'opacity-100 translate-x-0'
                          : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0',
                      )}
                    />
                  </span>
                </a>
              ))}
            </div>

            <button
              type="button"
              onClick={handleBookCall}
              className="ts-pill mt-6 w-full h-14 text-base"
            >
              <span>Book a Call</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </m.div>
      </>
    )}
  </AnimatePresence>
);

export const NavbarMenuToggle = ({
  isMenuOpen,
  isOverLightBand,
  onToggle,
}: {
  isMenuOpen: boolean;
  isOverLightBand: boolean;
  onToggle: () => void;
}) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
    aria-expanded={isMenuOpen}
    className={clsx(
      'ts-icon-btn pointer-events-auto inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border lg:hidden',
      isOverLightBand
        ? 'border-[rgba(0,0,0,0.16)] text-[#0a0a0a] hover:bg-black/5'
        : 'border-line-strong text-ink hover:bg-surface',
    )}
  >
    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
  </button>
);
