// frontend/src/index.js (or main.jsx if using Vite default)
// Ensure this file correctly imports App and renders it into the root element defined in src/index.html
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Assuming App.js is correctly named App.jsx if using JSX extension
import './index.css'; // Import Tailwind CSS styles

// Ensure the root element ID matches the one in src/index.html
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);