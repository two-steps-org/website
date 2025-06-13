@@ .. @@
-export const TOUCH_TARGET_SIZE = 44;
-
 export const BREAKPOINTS = {
   lg: 1024,
   xl: 1280,
   '2xl': 1536,
 } as const;
 
-export const SPACING = {
-  mobile: {
-    container: 'px-4',
-    section: 'py-6',
-    element: 'gap-4',
-    touch: 'gap-2'
-  },
-  tablet: {
-    container: 'px-6',
-    section: 'py-8',
-    element: 'gap-6',
-    touch: 'gap-3'
-  }
-} as const;
-
 export const TRANSITIONS = {
   default: 'all 0.3s ease',
   smooth: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
   spring: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
 } as const;