import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withExperimentalAutoCleanupInjectors,
  withHashLocation,
  withPreloading,
} from '@angular/router';

import { routes } from './app.routes';
import { provideLanguageService } from './domains/shared/util-common/language';
import { NG_STATUS_CLASSES } from '@angular/forms/signals/compat';
import { provideSignalFormsConfig } from '@angular/forms/signals';
import { ConfigService } from '@flights/shared/util-common/config-service';
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { authInterceptor } from '@flights/shared/util-auth/auth.interceptor';
import { provideHashbrown } from '@hashbrownai/angular';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAppInitializer(() => inject(ConfigService).load()),
    provideRouter(
      routes,
      withComponentInputBinding(), // Enable automatic input binding:
      withPreloading(PreloadAllModules), // Preload all lazy-loaded modules after initial load
      withHashLocation(), // Activate HashLocationStrategy
      withExperimentalAutoCleanupInjectors(), // Automatically clean up route-level providers when the user navigates away from a route.
    ),
    provideHttpClient(
      withInterceptors(
        // The array’s order determines the chain’s order. You can register multiple interceptors;
        // each receives the request (possibly modified by previous interceptors) and passes it to the next.
        [authInterceptor],
      ),
      withXsrfConfiguration({
        cookieName: 'My-Xsrf-Cookie',
        headerName: 'My-Xsrf-Header',
      }),
    ),
    provideClientHydration(withEventReplay()),

    // { provide: LanguageService, useClass: BrowserLanguageService }, // use own provider function below instead
    provideLanguageService('browser'), // Note: we don't need to spread this array, Angular will automatically flatten
    // nested arrays during configuration processing.

    // short-hand syntax for:
    // { provide: FlightClient, useClass: FlightClient },
    // could/should be:
    // FlightClient,

    // Add classic CSS classes for new signal-based forms like ng-valid, ng-invalid, ng-dirty, ng-pristine, and ng-pending
    provideSignalFormsConfig({
      classes: NG_STATUS_CLASSES,
    }),
    provideHashbrown({
      baseUrl: 'http://localhost:4444/api/chat',
      middleware: [
        (req) => {
          console.log('[Hashbrown Request]', req);
          return req;
        },
      ],
    }),
  ],
};
