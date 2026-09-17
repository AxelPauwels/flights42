import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding, withExperimentalAutoCleanupInjectors,
  withHashLocation,
  withPreloading
} from '@angular/router';

import { routes } from './app.routes';
import { provideLanguageService } from './domains/shared/util-common/language';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(), // Enable automatic input binding:
      withPreloading(PreloadAllModules), // Preload all lazy-loaded modules after initial load
      withHashLocation(), // Activate HashLocationStrategy
      withExperimentalAutoCleanupInjectors(), // Automatically clean up route-level providers when the user navigates away from a route.
    ),

    // { provide: LanguageService, useClass: BrowserLanguageService }, // use own provider function below instead
    provideLanguageService('browser'), // Note: we don't need to spread this array, Angular will automatically flatten
    // nested arrays during configuration processing.

    // short-hand syntax for:
    // { provide: FlightClient, useClass: FlightClient },
    // could/should be:
    // FlightClient,
  ],
};
