import { Routes } from '@angular/router';
import { FlightEdit } from './feature-booking/flight-edit/flight-edit';
import { FlightSearch } from './feature-booking/flight-search/flight-search';
import { PassengerSearch } from './feature-booking/passenger-search/passenger-search';
import { BookingNavigation } from './feature-booking/booking-navigation';
import { DefaultLanguageService, LanguageService } from '../shared/util-common/language';
import {
  NextFlightsOverview
} from './feature-next-flights/next-flights-overview/next-flights-overview';
import { ReportingPage } from './feature-reporting/reporting-page/reporting-page';
import { provideEnvironmentInitializer } from '@angular/core';
import { authGuard } from '../shared/util-auth/auth.guard';
import { exitGuard } from '../shared/util-common/exit.guard';
import { PassengerEdit } from './feature-booking/passenger-edit/passenger-edit';
import { passengerResolver } from './feature-booking/passenger-edit/passenger-resolver';

export const ticketingRoutes: Routes = [
  {
    path: '',
    redirectTo: 'booking',
    pathMatch: 'full',
  },
  {
    path: 'booking',
    component: BookingNavigation,
    providers: [
      { provide: LanguageService, useClass: DefaultLanguageService }, // override app-level provider for all children of this route,
      // By default, Angular does not destroy these Environment Providers, Once created, they live until the application is closed
      // set withExperimentalAutoCleanupInjectors in app.config to auto-clean up when the user navigates away from this route.
      provideEnvironmentInitializer(() => {
        console.log('init bookingRoutes');
      }),
    ],
    children: [
      {
        path: '',
        redirectTo: 'flight-search',
        pathMatch: 'full',
      },
      {
        path: 'flight-search',
        component: FlightSearch,
      },
      {
        path: 'flight-edit/:id',
        component: FlightEdit,
        canActivate: [authGuard],
        canDeactivate: [exitGuard],
      },
      {
        path: 'passenger-search',
        component: PassengerSearch,
      },
      {
        path: 'passenger-edit/:id',
        component: PassengerEdit,
        resolve: {
          passenger: passengerResolver,
        },
      },
      {
        path: 'next-flights',
        component: NextFlightsOverview,
      },
      {
        path: 'reporting',
        component: ReportingPage,
      },
      {
        path: '**',
        redirectTo: 'flight-search',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'booking',
  },
];

export default ticketingRoutes;
