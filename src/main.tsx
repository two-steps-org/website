import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

function registerServiceWorkerWhenIdle(): void {
  if (typeof window === 'undefined') return;

  const register = () => {
    registerSW({
      onNeedRefresh() {
        // In a real app, you might show a toast to the user
        console.log('New content available, please refresh.');
      },
      onOfflineReady() {
        console.log('App ready to work offline.');
      },
    });
  };

  if ('requestIdleCallback' in window) {
    (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number })
      .requestIdleCallback(register, { timeout: 2000 });
    return;
  }

  setTimeout(register, 1200);
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
  registerServiceWorkerWhenIdle();
}
