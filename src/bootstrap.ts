/// <reference types="@angular/localize" />
import { loadTranslations } from '@angular/localize';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// to use with extracted json (ng extract-i18n --format json)
loadTranslations({
  'flightSearch-info': 'From main.ts with love!',
  'flightSearch-title': 'Flight Search!!',
  'flightSearch-flightsFound': '{$INTERPOLATION} flights found!',
});

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
