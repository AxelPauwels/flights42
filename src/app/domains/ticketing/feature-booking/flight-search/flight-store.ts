import { computed, inject, isDevMode } from '@angular/core';
import { withDevtools, withDevToolsStub, withResource } from '@angular-architects/ngrx-toolkit';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState
} from '@ngrx/signals';

import { FlightClient } from '../../data/flight-client';
import { Flight } from '@flights/ticketing/data/flight-model';
import { withDevToolsForDebugMode } from '@flights/shared/util-common/with-dev-tools-for-debug-mode';

export interface FlightFilter {
  from: string;
  to: string;
}

interface FlightSearchState {
  from: string;
  to: string;
  basket: Record<number, boolean>;
  delayInMin: number;
}

export const FlightStore = signalStore(
  { providedIn: 'root' },

  withState<FlightSearchState>({
    from: 'Graz',
    to: 'Hamburg',
    basket: {},
    delayInMin: 0,
  }),

  // For defining any properties on the store
  withProps(() => ({
    _flightClient: inject(FlightClient),
  })),
  // withProps((store) => ({
  //   _filterChanged: new Subject<FlightFilter>({
  //     from: store.from(),
  //     to: store.to(),
  //   }),
  // })),
  // withProps((store) => ({
  //   filterChanged: store._filterChanged.asObservable(),
  // })),
  //
  // or
  // withProps((store) => {
  //   const _filterChanged = new Subject<FlightFilter>({
  //     from: store.from(),
  //     to: store.to(),
  //   });
  //   const filterChanged = _filterChanged.asObservable();
  //   return {
  //     _filterChanged,
  //     filterChanged,
  //   };
  // }),

  // A community extension provided by the NgRx Toolkit
  withResource(
    (store) => ({
      flights: store._flightClient.findResource(store.from, store.to),
    }),
    { errorHandling: 'previous value' },
  ),

  // For adding computed signals
  withComputed((store) => ({
    flightsWithDelays: computed(() =>
      toFlightsWithDelays(store.flightsValue(), store.delayInMin()),
    ),
  })),

  // For defining methods that can update the state or perform side effects
  withMethods((store) => ({
    updateFilter(from: string, to: string): void {
      patchState(store, { from, to });
    },

    updateBasket(flightId: number, selected: boolean): void {
      patchState(store, (state) => ({
        basket: {
          ...state.basket,
          [flightId]: selected,
        },
      }));
    },

    reload(): void {
      store._flightsReload();
    },

    delay(): void {
      patchState(store, (state) => ({
        delayInMin: state.delayInMin + 15,
      }));
    },
  })),

  // isDevMode()
  //   ? withDevtools('flight')
  //   : withDevToolsStub('flight'),

  withDevToolsForDebugMode('flight'),

  withHooks((store) => ({
    onInit() {
      console.log('FlightStore initialized', store.from(), store.to());
    },
    onDestroy() {
      console.log('FlightStore destroyed', store.from(), store.to());
    },
  })),
);

const toFlightsWithDelays = (flights: Flight[], delay: number): Flight[] => {
  if (flights.length === 0) {
    return [];
  }

  const ONE_MINUTE = 1000 * 60;
  const oldFlights = flights;
  const oldFlight = oldFlights[0];
  const oldDate = new Date(oldFlight.date);
  const newDate = new Date(oldDate.getTime() + delay * ONE_MINUTE);
  const newFlight = { ...oldFlight, date: newDate.toISOString() };

  return [newFlight, ...flights.slice(1)];
}
