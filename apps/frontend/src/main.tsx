import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('main.tsx: Script loaded');

const rootElement = document.getElementById("root");
console.log('main.tsx: Root element:', rootElement);

if (!rootElement) {
  console.error('main.tsx: Failed to find root element');
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
