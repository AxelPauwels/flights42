import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { LanguageService, ServerLanguageService } from '@flights/shared/util-common/language';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    { provide: LanguageService, useClass: ServerLanguageService },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
