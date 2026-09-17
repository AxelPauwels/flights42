import { Routes } from '@angular/router';
import { FlightEdit } from './feature-booking/flight-edit/flight-edit';
import { FlightSearch } from './feature-booking/flight-search/flight-search';
import { PassengerSearch } from './feature-booking/passenger-search/passenger-search';
import { BookingNavigation } from './feature-booking/booking-navigation';
import { DefaultLanguageService, LanguageService } from '../shared/util-common/language';
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
      },
      {
        path: 'passenger-search',
        component: PassengerSearch,
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
