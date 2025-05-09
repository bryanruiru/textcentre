import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize analytics only if localStorage is available
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    // Initialize Datadog or other analytics here
  }
} catch (e) {
  console.warn('Analytics initialization skipped:', e);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);