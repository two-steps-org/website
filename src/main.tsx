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
 * Runs after idle/200ms to avoid blocking initial render.
 */
function handlePageLoad(): void {
  document.body.style.top = '0';

  requestAnimationFrame(() => {
    document.body.classList.replace('loading', 'loaded');
    // Scroll to top AFTER body returns to normal flow (position: relative),
    // so any browser-restored position is overridden at the right moment.
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  });
}

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

// Disable StrictMode in production for better performance.
const AppWrapper = import.meta.env.PROD
  ? App
  : () => (
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

createRoot(rootElement).render(<AppWrapper />);

// Schedule post-load tasks (reveal overlay + ensure scroll position)
if (typeof window !== 'undefined') {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  scheduleHandlePageLoad();
}
