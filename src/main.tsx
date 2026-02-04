import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ReactQueryProvider from './contexts/ReactQueryProvider';
import { AuthProvider } from './contexts/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import './i18n';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <ReactQueryProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ReactQueryProvider>
    </HelmetProvider>
  </StrictMode>
);
