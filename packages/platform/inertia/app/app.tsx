/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import { resolvePageComponent } from '@adonisjs/inertia/helpers';
import { createInertiaApp } from '@inertiajs/react';
import { hydrateRoot } from 'react-dom/client';
import { clearReloadGuard, handleChunkLoadError } from '~/lib/chunk_reload';
import '../css/app.css';

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS';

// Reload once when Vite fails to load a dynamic chunk (stale deploy or transient network error).
// The sessionStorage guard prevents infinite reload loops. See: https://vite.dev/guide/build#load-error-handling
window.addEventListener('vite:preloadError', (event) => {
  const reloaded = handleChunkLoadError(event.payload, {});

  if (reloaded) {
    event.preventDefault();
  }
});

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    return resolvePageComponent(`../pages/${name}.tsx`, import.meta.glob('../pages/**/*.tsx'));
  },

  setup({ el, App, props }) {
    // App mounted successfully — clear the reload guard so a future deploy
    // can still trigger a one-time reload if needed.
    clearReloadGuard();
    hydrateRoot(el, <App {...props} />);
  },
});
