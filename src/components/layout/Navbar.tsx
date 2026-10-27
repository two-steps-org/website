'use client';

import clsx from 'clsx';
import Logo from '../Logo';
import { NavbarDesktopNav } from './NavbarDesktopNav';
import { NavbarMenuToggle, NavbarMobileMenu } from './NavbarMobileMenu';
import { useNavbar } from './useNavbar';

const Navbar = () => {
  const {
    headerRef,
    isMenuOpen,
    setIsMenuOpen,
    showMobileContrastBar,
    activeTab,
    isOverLightBand,
    handleNavigation,
    handleBookCall,
  } = useNavbar();

  // The bar spans the viewport, so it is pointer-events-none and only its
  // controls opt back in; otherwise the page under the gaps is unclickable.
  return (
    <header
      ref={headerRef}
      className="fixed left-0 right-0 z-50 pointer-events-none"
      style={{ top: 'max(1rem, env(safe-area-inset-top))' }}
    >
      {showMobileContrastBar && (
        <div className="absolute inset-x-0 -top-4 h-24 lg:hidden pointer-events-none bg-gradient-to-b from-bg/90 via-bg/65 to-transparent backdrop-blur-md" />
      )}

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
        <a
          href="/#home"
          onClick={(event) => handleNavigation('/#home', 'Home', event)}
          aria-label="Go to Home"
          className="pointer-events-auto flex items-center"
        >
          <Logo />
        </a>

        <NavbarDesktopNav
          activeTab={activeTab}
          isOverLightBand={isOverLightBand}
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
