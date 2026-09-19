'use client';

import clsx from 'clsx';
import Logo from '../Logo';
import { NavbarDesktopNav } from './NavbarDesktopNav';
import { NavbarMenuToggle, NavbarMobileMenu } from './NavbarMobileMenu';
import { useNavbar } from './useNavbar';

const Navbar = () => {
  const {
    isMenuOpen,
    setIsMenuOpen,
    isPastHero,
    activeTab,
    isOverLightBand,
    handleNavigation,
    handleBookCall,
  } = useNavbar();

  // The bar spans the viewport, so it is pointer-events-none and only its
  // controls opt back in; otherwise the page under the gaps is unclickable.
  return (
    <header
      className="fixed left-0 right-0 z-50 pointer-events-none"
      style={{ top: 'max(1rem, env(safe-area-inset-top))' }}
    >
      <nav
        aria-label="Primary"
        className={clsx(
          // Same gutters as the page sections so the logo and CTA sit on the
          // content edges. The link pill takes the space between them and
          // centres there, so its gap to the logo equals its gap to the CTA.
          'ts-container relative flex h-16 items-center justify-between gap-4',
          isOverLightBand ? 'text-[#0a0a0a]' : 'text-ink',
        )}
      >
        {/* Past the hero the three floating pieces share one frosted capsule so
            they stay legible over any content. Background only: it must never
            take pointer events, or the gaps between the controls go dead. */}
        <div
          aria-hidden="true"
          data-nav-capsule
          className={clsx(
            'pointer-events-none absolute inset-y-0 -z-10 rounded-full shadow-[var(--shadow-md)] transition-opacity duration-200 ease-out motion-reduce:transition-none',
            isOverLightBand ? 'border border-black/10 bg-white/70 backdrop-blur-[20px]' : 'ts-glass',
            isPastHero ? 'opacity-100' : 'opacity-0',
          )}
          style={{ left: 'calc(var(--container-pad) - 0.75rem)', right: 'calc(var(--container-pad) - 0.75rem)' }}
        />

        <a
          href="/#home"
          onClick={(event) => handleNavigation('/#home', 'Home', event)}
          aria-label="Go to Home"
          className="pointer-events-auto flex items-center focus:outline-none"
        >
          <Logo />
        </a>

        <NavbarDesktopNav
          activeTab={activeTab}
          isOverLightBand={isOverLightBand}
          isPastHero={isPastHero}
          handleNavigation={handleNavigation}
          handleBookCall={handleBookCall}
        />

        <NavbarMenuToggle
          isMenuOpen={isMenuOpen}
          isOverLightBand={isOverLightBand}
          onToggle={() => setIsMenuOpen(!isMenuOpen)}
        />
      </nav>

      <NavbarMobileMenu
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        activeTab={activeTab}
        handleNavigation={handleNavigation}
        handleBookCall={handleBookCall}
      />
    </header>
  );
};

export default Navbar;
