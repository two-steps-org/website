import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker
if (typeof window !== 'undefined') {
  registerSW({
    onNeedRefresh() {
      // In a real app, you might show a toast to the user
      console.log('New content available, please refresh.');
    },
    onOfflineReady() {
      console.log('App ready to work offline.');
    },
  });
}

/**
 * Handles tasks that should only run once the page is loaded.
 */
function handlePageLoad(): void {
  window.scrollTo(0, 0);
  document.body.style.top = '0';

  requestAnimationFrame(() => {
    document.body.classList.replace('loading', 'loaded');
  });
}

/**
 * Schedules non-critical tasks when the browser is idle.
 */
function scheduleHandlePageLoad(): void {
  if ('requestIdleCallback' in window) {
    (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(handlePageLoad);
  } else {
    setTimeout(handlePageLoad, 200);
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element with id "root" not found. Please ensure it exists in index.html');
}

// Disable StrictMode in production for better performance
const AppWrapper = import.meta.env.PROD ? App : () => (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

createRoot(rootElement).render(<AppWrapper />);

// Schedule post-load tasks
if (typeof window !== 'undefined') {
  scheduleHandlePageLoad();
}
