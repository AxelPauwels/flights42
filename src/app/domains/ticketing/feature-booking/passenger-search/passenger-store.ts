import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { inject } from '@angular/core';
import { PassengerClient } from '@flights/ticketing/data/passenger-client';
import { Passenger } from '@flights/ticketing/data/passenger';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
interface PassengerStoreState {
  name: string;
    firstName: string;
    selected: Record<number, boolean>;
    passengers: Passenger[];
    isLoading: boolean;
    error: string | null
}
export interface PassengerFilter {
  name: string;
  firstName: string;
}

// As rxMethod subscribes to the Observable, we need a tap to work with the result.
// Note: As rxMethod uses an effect internally, it can only be called in an injection context.
//
// In case the rxMethod has generic type 'number' as example...
// The caller of the rxMethod can now pass a plain number, a Signal<number>, or an
// Observable<number>. When passing a Signal or an Observable, every new value is
// also sent through the pipe

export const PassengerStore = signalStore(
  { providedIn: 'root' },
  withState<PassengerStoreState>({
    name: 'Smith',
    firstName: '',
    selected: {},
    passengers: [],
    isLoading: false,
    error: null,
  }),
  withProps(() => ({
    _passengerClient: inject(PassengerClient),
  })),
  withMethods((store) => {
    return {
      updateFilter: rxMethod<PassengerFilter>(
        pipe(
          tap((filter: PassengerFilter) =>
            patchState(store, {
              name: filter.name,
              firstName: filter.firstName,
              isLoading: true,
              error: null,
            }),
          ),
          switchMap((filter) =>
            store._passengerClient.find(filter.name, filter.firstName).pipe(
              tap((passengers: Passenger[]) => {
                patchState(store, { passengers, isLoading: false });
              }),
              catchError((error) => {
                patchState(store, { error, isLoading: false });

                return of([]);
              }),
            ),
          ),
        ),
      ),
    };
  }),
);
