import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Function to handle page load tasks
function handlePageLoad(): void {
  // Force scroll to top immediately
  window.scrollTo(0, 0);

  // Remove loading class and add loaded class on the next frame
  requestAnimationFrame(() => {
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
  });
}

// Schedule the handlePageLoad using requestIdleCallback if available, otherwise fallback to setTimeout
function scheduleHandlePageLoad(): void {
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(handlePageLoad);
  } else {
    // Fallback delay of 200ms for browsers that do not support requestIdleCallback
    setTimeout(handlePageLoad, 200);
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element with id "root" not found. Please ensure the element exists in your HTML.');
}

const root = createRoot(rootElement);

// Render the app within React.StrictMode for highlighting potential issues
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Schedule non-essential tasks for when the browser is idle
scheduleHandlePageLoad();
