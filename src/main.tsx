import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { PREVIEW_FULL_MOTION } from './utils/motionPreference';

// Set before the first render so CSS and JS agree from the first frame.
if (PREVIEW_FULL_MOTION) document.documentElement.dataset.motionPreview = 'full';
else delete document.documentElement.dataset.motionPreview;

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element with id "root" not found. Please ensure it exists in index.html');
}

if (typeof window !== 'undefined') {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
  if ('serviceWorker' in navigator) {
    // Only update a worker that is already installed. A fresh register of the
    // cleanup script would install, unregister, and reload on every visit.
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration) navigator.serviceWorker.register('/sw.js').catch(() => {});
    }).catch(() => {});
  }
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
