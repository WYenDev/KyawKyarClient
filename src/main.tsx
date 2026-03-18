import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import ReactQueryProvider from './contexts/ReactQueryProvider';
import { AuthProvider } from './contexts/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import './i18n';
import i18n from './i18n';

const pathLang = window.location.pathname.split('/')[1];
if (pathLang === 'my' || pathLang === 'en') {
  console.log('path lang', pathLang)
  i18n.changeLanguage(pathLang);
}

const rootElement = document.getElementById('root')!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <ReactQueryProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ReactQueryProvider>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}

if (typeof document !== 'undefined' && typeof document.dispatchEvent === 'function') {
  document.dispatchEvent(new Event('vite-prerender-ready'));
}
