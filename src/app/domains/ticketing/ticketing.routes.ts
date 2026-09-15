import { Routes } from '@angular/router';
import { FlightEdit } from './feature-booking/flight-edit/flight-edit';
import { FlightSearch } from './feature-booking/flight-search/flight-search';
import { PassengerSearch } from './feature-booking/passenger-search/passenger-search';
import { BookingNavigation } from './feature-booking/booking-navigation';
export const ticketingRoutes: Routes = [
  {
    path: '',
    redirectTo: 'booking',
    pathMatch: 'full',
  },
  {
    path: 'booking',
    component: BookingNavigation,
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
