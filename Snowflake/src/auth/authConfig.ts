/// <reference types="vite/client" />
import {
  Configuration,
  BrowserCacheLocation,
  LogLevel,
  PopupRequest,
  RedirectRequest,
} from '@azure/msal-browser';

/**
 * Azure AD Authentication Configuration
 * App Registration Type: Web (not SPA)
 *
 * In Azure Portal → App Registrations → Authentication:
 *   - Platform: Web  (NOT Single-page application)
 *   - Redirect URI: http://localhost:3000 (dev) / your production URL
 *   - Implicit grant: leave unchecked (using auth code flow)
 */
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || '2ecd5bf2-32ec-4289-965c-71277149697b',
    authority: `https://login.microsoftonline.com/${
      import.meta.env.VITE_AZURE_TENANT_ID || '17dcec91-66ec-4c4b-a988-473694df546c'
    }`,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    // Web application type uses SessionStorage (SPA typically uses localStorage)
    cacheLocation: BrowserCacheLocation.SessionStorage,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        if (level === LogLevel.Error) console.error('[MSAL]', message);
        if (level === LogLevel.Warning) console.warn('[MSAL]', message);
      },
    },
  },
};

/** Scopes requested on login */
export const loginRequest: RedirectRequest & PopupRequest = {
  scopes: ['openid', 'profile', 'User.Read'],
};
