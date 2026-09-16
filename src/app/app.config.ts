import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withHashLocation,
  withPreloading
} from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(), // Enable automatic input binding:
      withPreloading(PreloadAllModules), // Preload all lazy-loaded modules after initial load
      withHashLocation(), // Activate HashLocationStrategy
    ),
  ],
};
