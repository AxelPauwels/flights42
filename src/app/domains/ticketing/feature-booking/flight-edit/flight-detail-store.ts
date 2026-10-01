import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  withDevtools,
  withMutations,
  withResource,
} from '@angular-architects/ngrx-toolkit';
import {
  patchState,
  signalMethod,
  signalStore,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';

import { FlightClient } from '../../data/flight-client';
import { Flight } from '@flights/ticketing/data/flight-model';

type FlightDetailId = number;

interface FlightDetailState {
  flightId: FlightDetailId;
}

export const FlightDetailStore = signalStore(
  { providedIn: 'root' },

  withState<FlightDetailState>({
    flightId: 0,
  }),

  withProps(() => ({
    _flightClient: inject(FlightClient),
    _snackBar: inject(MatSnackBar),
  })),

  withResource(
    (store) => ({
      flight: store._flightClient.findResourceById(store.flightId),
    }),
    { errorHandling: 'previous value' },
  ),

  withMutations((store) => ({
    saveFlight: store._flightClient.createSaveMutation({
      onSuccess() {
        store._snackBar.open('Flight updated successfully', 'OK', {
          duration: 3000,
        });
      },
      onError(error: unknown) {
        const message = 'Failed to update flight';
        console.error(message, error);
        store._snackBar.open(message, 'OK', {
          duration: 5000,
        });
      },
    }),
  })),

  withMethods((store) => ({
    setFlightId(id: number): void {
      patchState(store, { flightId: id });
    },

    // signalMethod instead of rxMethod, as we don't need to handle Observables here
    // Please keep in mind that, aside from RxJS with its flattening operators or the Resource
    // API using switchMap semantics, signalMethod does not have any built-in
    // mechanism for handling overlapping calls.
    connectFlightId: signalMethod<number>((id) => {
      patchState(store, { flightId: id });
    }),

    updateLocalFlight(flight: Partial<Flight>): void {
      patchState(store, (state) => ({
        flightValue: {
          ...state.flightValue,
          ...flight,
        },
      }));
    },

    reload(): void {
      store._flightReload();
    },
  })),

  withDevtools('flightDetail'),
);
