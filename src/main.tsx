import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

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
    (window as any).requestIdleCallback(handlePageLoad);
  } else {
    setTimeout(handlePageLoad, 200);
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element with id "root" not found. Please ensure it exists in index.html');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

scheduleHandlePageLoad();
