import { m, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import Logo from '../Logo';
import { navItems } from '../../data/navItems';
import { drawerPanel, drawerScrim, enterItem } from '../../utils/motion';
import { contact } from './Footer/footerData';
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

          {/* Links scroll if they must; the ask stays pinned in thumb reach. */}
          <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
            {navItems.map((item, index) => (
              <m.a
                key={item.name}
                {...enterItem(index, 0.12)}
                href={item.url}
                aria-current={activeTab === item.name ? (item.url.includes('#') ? 'location' : 'page') : undefined}
                onClick={(event) => handleNavigation(item.url, item.name, event)}
                className={clsx(
                  'flex min-h-[60px] items-center justify-between border-b border-line font-tight text-2xl font-light tracking-[-0.02em] transition-colors',
                  activeTab === item.name ? 'text-ink' : 'text-muted hover:text-ink',
                )}
              >
                {item.name}
                <ArrowRight
                  className={clsx('h-5 w-5 transition-opacity', activeTab === item.name ? 'opacity-100' : 'opacity-0')}
                />
              </m.a>
            ))}
          </div>

          <div className="shrink-0 pt-6">
            <div className="mb-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
              {contact
                .filter((item) => /^(mailto|tel):/.test(item.href))
                .map((item) => (
                  <a key={item.href} href={item.href} className="hover:text-ink">
                    {item.text}
                  </a>
                ))}
            </div>
            <button type="button" onClick={handleBookCall} className="ts-pill h-14 w-full text-base">
              <span>Book a Call</span>
              <ArrowRight className="h-5 w-5" />
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
