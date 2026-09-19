import { m } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { navItems } from '../../data/navItems';
import type { NavbarNavigate } from './useNavbar';

export const NavbarDesktopNav = ({
  activeTab,
  isOverLightBand,
  handleNavigation,
  handleBookCall,
}: {
  activeTab: string;
  isOverLightBand: boolean;
  handleNavigation: NavbarNavigate;
  handleBookCall: () => void;
}) => (
  <>
    <div className="hidden flex-1 justify-center lg:flex">
      <div
        className={clsx(
          'pointer-events-auto flex items-center gap-0.5 p-1 rounded-full shadow-[var(--shadow-sm)] backdrop-blur-[20px] xl:gap-1',
          isOverLightBand
            ? 'bg-white/70 border border-black/10'
            : 'ts-glass',
        )}
      >
        {navItems.filter((item) => item.desktop !== false).map((item) => {
          const isActive = activeTab === item.name;
          return (
            <a
              key={item.name}
              href={item.url}
              aria-current={isActive ? (item.url.includes('#') ? 'location' : 'page') : undefined}
              onClick={(event) => handleNavigation(item.url, item.name, event)}
              className={clsx(
                'relative inline-flex h-11 cursor-pointer items-center whitespace-nowrap rounded-full px-3 text-sm font-semibold transition-colors xl:px-4',
                isOverLightBand
                  ? isActive
                    ? 'text-[#0a0a0a]'
                    : 'text-[#6b6b6b] hover:text-[#0a0a0a]'
                  : isActive
                    ? 'text-ink'
                    : 'text-muted hover:text-ink',
              )}
            >
              {item.name}
              <div
                aria-hidden="true"
                className={clsx(
                  'absolute inset-0 w-full rounded-full -z-10 pointer-events-none transition-opacity duration-100 ease-out motion-reduce:transition-none',
                  isActive ? 'opacity-100' : 'opacity-0',
                  isOverLightBand ? 'bg-black/[0.04]' : 'bg-ink/5',
                )}
              >
                <div
                  className={clsx(
                    'absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full',
                    isOverLightBand ? 'bg-[#0a0a0a]' : 'bg-ink',
                  )}
                >
                  <div
                    className={clsx(
                      'absolute w-12 h-6 rounded-full blur-md -top-2 -left-2',
                      isOverLightBand ? 'bg-black/[0.08]' : 'bg-ink/25',
                    )}
                  />
                  <div
                    className={clsx(
                      'absolute w-8 h-6 rounded-full blur-md -top-1',
                      isOverLightBand ? 'bg-black/[0.08]' : 'bg-ink/25',
                    )}
                  />
                  <div
                    className={clsx(
                      'absolute w-4 h-4 rounded-full blur-sm top-0 left-2',
                      isOverLightBand ? 'bg-black/[0.1]' : 'bg-ink/30',
                    )}
                  />
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>

    <m.button
      type="button"
      onClick={handleBookCall}
      className={clsx(
        'ts-pill pointer-events-auto hidden lg:inline-flex h-11 px-[18px] text-sm',
        isOverLightBand && 'bg-[#0a0a0a] text-white',
      )}
    >
      Book a Call
      <ArrowRight className="w-4 h-4" />
    </m.button>
  </>
);
