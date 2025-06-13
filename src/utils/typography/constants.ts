export const TYPOGRAPHY = {
  mobile: {
    h1: {
      size: 'text-mobile-2xl xs:text-mobile-2xl sm:text-tablet-2xl',
      lineHeight: 'leading-[1.2]',
      tracking: 'tracking-tight'
    },
    h2: {
      size: 'text-mobile-xl xs:text-mobile-2xl sm:text-tablet-xl',
      lineHeight: 'leading-[1.25]',
      tracking: 'tracking-tight'
    },
    h3: {
      size: 'text-mobile-lg xs:text-mobile-xl sm:text-tablet-lg',
      lineHeight: 'leading-[1.3]',
      tracking: 'tracking-normal'
    },
    body: {
      textHeavy: 'text-mobile-base xs:text-mobile-lg sm:text-tablet-lg',
      interactive: 'text-mobile-base xs:text-mobile-lg sm:text-tablet-base',
      lineHeight: 'leading-[1.6]',
      tracking: 'tracking-normal'
    },
    caption: {
      size: 'text-mobile-sm xs:text-mobile-base sm:text-tablet-sm',
      lineHeight: 'leading-[1.6]',
      tracking: 'tracking-normal'
    }
  },
  desktop: {
    h1: {
      size: 'text-[35px] lg:text-[40px] xl:text-[45px]',
      lineHeight: 'leading-tight',
      tracking: 'tracking-tight'
    },
    h2: {
      size: 'text-[28px] lg:text-[32px] xl:text-[38px]',
      lineHeight: 'leading-tight',
      tracking: 'tracking-tight'
    },
    h3: {
      size: 'text-[24px] lg:text-[28px] xl:text-[32px]',
      lineHeight: 'leading-snug',
      tracking: 'tracking-normal'
    },
    body: {
      textHeavy: 'text-[18px] lg:text-[20px]',
      interactive: 'text-[16px] lg:text-[18px]',
      lineHeight: 'leading-relaxed',
      tracking: 'tracking-normal'
    },
    caption: {
      size: 'text-[14px] lg:text-[16px]',
      lineHeight: 'leading-normal',
      tracking: 'tracking-normal'
    }
  }
} as const;