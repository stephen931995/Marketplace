import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { msalInstance } from './auth/msalInstance';

// Initialise MSAL and handle the Azure AD redirect callback before mounting React.
// This is required for the auth code flow used by Web-type app registrations.
msalInstance.initialize().then(() => {
  msalInstance.handleRedirectPromise().then((response) => {
    if (response?.account) {
      msalInstance.setActiveAccount(response.account);
    }
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  }).catch((err) => {
    console.error('[MSAL] Redirect handling failed:', err);
    // Still render the app so the user can see the login page
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  });
});
