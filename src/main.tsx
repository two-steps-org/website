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
