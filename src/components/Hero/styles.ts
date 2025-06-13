// heroStyles.ts

interface HeroStyles {
  container: string;
  content: string;
  heading: {
    container: string;
    tag: string;
    title: string;
    subtitle: string;
  };
  cta: {
    container: string;
    button: string;
  };
  features: {
    container: string;
    card: string;
  };
  dashboard: {
    container: string;
    preview: string;
  };
}

export const heroStyles: HeroStyles = {
  container: 'min-h-[calc(100vh-5rem)] pt-20 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8',
  content: 'max-w-7xl mx-auto text-center',
  heading: {
    container: 'space-y-4 mb-8',
    tag: 'text-blue-400 text-sm font-semibold tracking-wider uppercase',
    title: 'text-4xl sm:text-5xl md:text-6xl font-bold leading-tight',
    subtitle: 'text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto'
  },
  cta: {
    container: 'flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16',
    button: 'w-full sm:w-auto min-h-[56px]'
  },
  features: {
    container: 'grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto',
    card: 'bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 border border-gray-800/50 min-h-[64px]'
  },
  dashboard: {
    container: 'relative mt-8 sm:mt-12 w-full overflow-hidden',
    preview: 'rounded-2xl overflow-hidden shadow-2xl'
  }
};

export default heroStyles;
