import { computed } from '@angular/core';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import {
  patchState,
  signalStore,
  type,
  withComputed,
  withHooks,
} from '@ngrx/signals';
import { entityConfig, setEntities, withEntities } from '@ngrx/signals/entities';

import { initialAircraft } from '../../data/aircraft';
import { Flight } from '../../data/flight-model';
import { Passenger } from '../../data/passenger';
import { Price } from '../../data/price';

type FlightState = Flight & {
  passengerIds: number[];
};

type PassengerState = Passenger & {
  flightIds: number[];
};

const flightEntityConfig =  entityConfig({
  entity: type<FlightState>(),
  collection: 'flight'
});

const passengerEntityConfig = entityConfig({
  entity: type<PassengerState>(),
  collection: 'passenger'
});

type FlightsWithPassengers = Flight & {
  passengers: Passenger[];
};

type PassengersWithFlights = Passenger & {
  flights: Flight[];
};

export const NormalizedStore = signalStore(
  { providedIn: 'root' },

  // withEntities({ entity: type<FlightState>(), collection: 'flight' }),
  // withEntities({ entity: type<PassengerState>(), collection: 'passenger' }),
  withEntities(flightEntityConfig),
  withEntities(passengerEntityConfig),

  withComputed((store) => ({
    flightsWithPassengers: computed<FlightsWithPassengers[]>(() =>
      store.flightEntities().map((flight) => ({
        ...flight,
        passengers: flight.passengerIds.map((id) => store.passengerEntityMap()[id]),
      })),
    ),
    passengersWithFlights: computed<PassengersWithFlights[]>(() =>
      store.passengerEntities().map((passenger) => ({
        ...passenger,
        flights: passenger.flightIds.map((id) => store.flightEntityMap()[id]),
      })),
    ),
  })),
  withHooks({
    onInit(state) {
      const date = new Date().toISOString();
      const flights: FlightState[] = [
          {
            id: 10,
            from: 'London',
            to: 'New York',
            date,
            delayed: false,
            delay: 0,
            aircraft: initialAircraft,
            prices: [],
            passengerIds: [1, 3],
          },
          {
            id: 20,
            from: 'London',
            to: 'New York',
            date,
            delayed: false,
            delay: 0,
            aircraft: initialAircraft,
            prices: [],
            passengerIds: [1, 2],
          },
          {
            id: 30,
            from: 'London',
            to: 'New York',
            date,
            delayed: false,
            delay: 0,
            aircraft: initialAircraft,
            prices: [],
            passengerIds: [2, 3],
          },
      ];
      patchState(
        state,
        setEntities(
          flights,
          // { collection: 'flight'}
          flightEntityConfig, // for 'collection'
        ),
      );

      patchState(
        state,
        setEntities(
          [
            {
              id: 1,
              firstName: 'Max',
              name: 'Muster',
              bonusMiles: 0,
              passengerStatus: 'A',
              flightIds: [10, 20],
            },
            {
              id: 2,
              firstName: 'Susi',
              name: 'Sorglos',
              bonusMiles: 0,
              passengerStatus: 'A',
              flightIds: [20, 30],
            },
            {
              id: 3,
              firstName: 'Jane',
              name: 'Doe',
              bonusMiles: 0,
              passengerStatus: 'A',
              flightIds: [10, 30],
            },
          ],
          // { collection: 'passenger'}
          passengerEntityConfig, // for 'collection'
        ),
      );
    },
  }),

  withDevtools('normalized'),
);
