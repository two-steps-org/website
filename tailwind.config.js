/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      screens: {
        xs: '320px',
        sm: '375px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      // Container queries for component-level responsiveness (2026 best practice)
      containers: {
        xs: '20rem',  // 320px
        sm: '23.4375rem',  // 375px
        md: '48rem',  // 768px
        lg: '64rem',  // 1024px
        xl: '80rem',  // 1280px
        '2xl': '96rem',  // 1536px
      },
      // Consolidated spacing: combining your custom spacing with safe and modal spacing
      spacing: {
        // Standard spacing values
        mobile: 'clamp(0.75rem, 3vw, 1rem)',
        tablet: 'clamp(1rem, 4vw, 1.5rem)',
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
        // Safe area insets
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        // Modal spacing (prefixed to avoid collision)
        'modal-spacing-xs': '1rem',
        'modal-spacing-sm': '1.25rem',
        'modal-spacing-md': '1.5rem',
        'modal-lg': '2rem',
      },
      minHeight: {
        'screen-dvh': '100dvh',
      },
      maxWidth: {
        'modal-xs': '320px',
        'modal-sm': '384px',
        'modal-md': '448px',
        'modal-lg': '512px',
        'modal-xl': '576px',
        'modal-2xl': '640px',
        'screen-lg': '1024px',
        'screen-xl': '1280px',
        content: '100%',
        image: '100vw',
      },
      aspectRatio: {
        auto: 'auto',
        square: '1 / 1',
        video: '16 / 9',
        portrait: '3 / 4',
      },
      touchAction: {
        manipulation: 'manipulation',
      },
      fontSize: {
        // Fluid typography for mobile (320px - 767px)
        mobile: {
          xs: 'clamp(0.75rem, calc(0.75rem + 0.25vw), 0.875rem)',
          sm: 'clamp(0.875rem, calc(0.875rem + 0.25vw), 1rem)',
          base: 'clamp(1rem, calc(1rem + 0.25vw), 1.125rem)',
          lg: 'clamp(1.125rem, calc(1.125rem + 0.375vw), 1.25rem)',
          xl: 'clamp(1.25rem, calc(1.25rem + 0.5vw), 1.5rem)',
          '2xl': 'clamp(1.5rem, calc(1.5rem + 0.75vw), 1.75rem)',
          '3xl': 'clamp(1.75rem, calc(1.75rem + 1vw), 2rem)',
          '4xl': 'clamp(2rem, calc(2rem + 1.25vw), 2.5rem)',
          '5xl': 'clamp(2.5rem, calc(2.5rem + 1.5vw), 3rem)',
        },
        // Fluid typography for tablet (768px - 1023px)
        tablet: {
          xs: 'clamp(0.875rem, calc(0.875rem + 0.375vw), 1rem)',
          sm: 'clamp(1rem, calc(1rem + 0.375vw), 1.125rem)',
          base: 'clamp(1.125rem, calc(1.125rem + 0.5vw), 1.25rem)',
          lg: 'clamp(1.25rem, calc(1.25rem + 0.625vw), 1.5rem)',
          xl: 'clamp(1.5rem, calc(1.5rem + 0.75vw), 1.75rem)',
          '2xl': 'clamp(1.75rem, calc(1.75rem + 1vw), 2rem)',
          '3xl': 'clamp(2rem, calc(2rem + 1.25vw), 2.5rem)',
          '4xl': 'clamp(2.5rem, calc(2.5rem + 1.5vw), 3rem)',
          '5xl': 'clamp(3rem, calc(3rem + 2vw), 3.75rem)',
        },
        // Fluid typography for desktop (1024px+)
        desktop: {
          xs: 'clamp(1rem, calc(1rem + 0.5vw), 1.125rem)',
          sm: 'clamp(1.125rem, calc(1.125rem + 0.625vw), 1.25rem)',
          base: 'clamp(1.25rem, calc(1.25rem + 0.75vw), 1.375rem)',
          lg: 'clamp(1.5rem, calc(1.5rem + 1vw), 1.75rem)',
          xl: 'clamp(1.75rem, calc(1.75rem + 1.25vw), 2rem)',
          '2xl': 'clamp(2rem, calc(2rem + 1.5vw), 2.5rem)',
          '3xl': 'clamp(2.5rem, calc(2.5rem + 2vw), 3rem)',
          '4xl': 'clamp(3rem, calc(3rem + 2.5vw), 3.75rem)',
          '5xl': 'clamp(3.75rem, calc(3.75rem + 3vw), 4.5rem)',
          '6xl': 'clamp(4.5rem, calc(4.5rem + 3.5vw), 5.5rem)',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'scale-out': 'scaleOut 0.3s ease-out',
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      transitionTimingFunction: {
        emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
        decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
        accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
      },
      willChange: {
        transform: 'transform',
        opacity: 'opacity',
        'transform-opacity': 'transform, opacity',
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        html: {
          '-webkit-tap-highlight-color': 'transparent',
          'text-size-adjust': '100%',
        },
        '@media (prefers-reduced-motion: reduce)': {
          '*': {
            'animation-duration': '0.01ms !important',
            'animation-iteration-count': '1 !important',
            'transition-duration': '0.01ms !important',
            'scroll-behavior': 'auto !important',
          },
        },
      });
    },
  ],
};
