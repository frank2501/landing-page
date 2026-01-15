
// Buffer should be available via vite-plugin-node-polyfills
// But we ensure it's set just in case
if (typeof window !== 'undefined' && !(window as any).Buffer) {
  import('buffer').then(({ Buffer }) => {
    (window as any).Buffer = Buffer;
    (globalThis as any).Buffer = Buffer;
  });
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
