import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withHashLocation,
  withPreloading
} from '@angular/router';

import { routes } from './app.routes';
import { BrowserLanguageService, LanguageService } from './domains/shared/util-common/language';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(), // Enable automatic input binding:
      withPreloading(PreloadAllModules), // Preload all lazy-loaded modules after initial load
      withHashLocation(), // Activate HashLocationStrategy
    ),
    { provide: LanguageService, useClass: BrowserLanguageService },
    // short-hand syntax for:
    // { provide: FlightClient, useClass: FlightClient },
    // could/should be:
    // FlightClient,
  ],
};
