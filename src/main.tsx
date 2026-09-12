import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

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

if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
