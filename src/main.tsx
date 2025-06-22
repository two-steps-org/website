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

// Reveal the page once React has rendered
handlePageLoad();

