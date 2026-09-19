// `desktop: false` keeps a link out of the desktop pill; the mobile menu and
// the footer still carry it. The logo is the Home link.
export const navItems: ReadonlyArray<{ name: string; url: string; desktop?: false }> = [
  { name: 'Services', url: '/#services' },
  { name: 'Why Us', url: '/#why-us' },
  { name: 'Process', url: '/#process', desktop: false },
  { name: 'Team', url: '/#team', desktop: false },
  { name: 'Q&A', url: '/#faq' },
  { name: 'Case Studies', url: '/case-studies' },
];

export const BOOK_CALL_URL = 'https://calendly.com/yoni-insell-twosteps/30min';
