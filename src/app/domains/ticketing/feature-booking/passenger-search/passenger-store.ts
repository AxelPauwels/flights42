import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { inject } from '@angular/core';
import { PassengerClient } from '@flights/ticketing/data/passenger-client';
import { Passenger } from '@flights/ticketing/data/passenger';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { setLoading, withCallState } from '@flights/shared/util-common/call-state.feature';
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
  // Call Custom Feature

  withCallState(), // this must before withMethods, because functions in that file,
  // like 'setLoading()', are using state from this 'withCallState' function

  withProps(() => ({
    _passengerClient: inject(PassengerClient),
  })),
  // Note the caller can pass a PassengerFilter as a plain value, a Signal<PassengerFilter>, or an Observable<PassengerFilter>.
  // Whenever a passed Signal or Observable provides a new filter, the rxMethod automatically
  // runs the provided pipe, which in turn updates the state and triggers the passenger search.
  withMethods((store) => {
    return {
      updateFilter: rxMethod<PassengerFilter>(
        pipe(
          tap((filter: PassengerFilter) =>
            patchState(
              store,
              {
                name: filter.name,
                firstName: filter.firstName,
                isLoading: true,
                error: null,
              },
              // Let's track this: This store has state from withCallState() feature, lets look at computed property 'loading'
              // first here, when updateFilter is called, setLoading() is called, which sets the callState to 'loading',
              // and then the computed property 'loading' will return true, which can be used in the component to show a loading spinner or something similar.
              setLoading(),
            ),
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
