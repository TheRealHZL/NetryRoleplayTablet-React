import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';  // Stellt sicher, dass das Styling geladen wird
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
