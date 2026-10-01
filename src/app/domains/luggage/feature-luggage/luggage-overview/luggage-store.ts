import { inject } from '@angular/core';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { mapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  type,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import {
  eventGroup,
  Events,
  on,
  withEventHandlers,
  withReducer,
} from '@ngrx/signals/events';
import { switchMap } from 'rxjs';

import { Luggage } from '../../data/luggage';
import { LuggageClient } from '../../data/luggage-client';

// Note: In this example, the source property points to an entire domain and
// hence is quite coarse-grained. The NgRx team recommends a more fine-grained
// approach, where the source points to the consuming component, service, or store.
//   For instance, we could put the loadLuggageTriggered event in an event group
// luggageOverviewEvents with the source LuggageOverview, while the other two
// events could be in a luggageApiEvents with the source LuggageApi. The first
// one is used by the LuggageOverview component to trigger the loading, while the
//   second one is used by the event handlers and reducers in the store.
//   This way, we can easily see which events are triggered by the component and
// which ones are triggered inside the store.
//
// For asynchronous operations, it is a common pattern to define three events: one for
//   triggering the operation, one for the success case, and one for the error case.
export const luggageEvents = eventGroup({
  source: 'Luggage Store',
  events: {
    loadLuggageTriggered: type<void>(),
    loadLuggageSucceeded: type<{ luggage: Luggage[] }>(),
    loadLuggageFailed: type<{ error: string }>(),
  },
});

export const LuggageStore = signalStore(
  { providedIn: 'root' },

  withState({
    luggage: [] as Luggage[],
    selected: {} as Record<number, boolean>,
    isLoading: false,
    error: null as string | null,
  }),

  withProps(() => ({
    _luggageClient: inject(LuggageClient),
    _events: inject(Events),
  })),

  // Reducers specify how the state should be updated in reaction to specific events.
  withReducer(
    on(luggageEvents.loadLuggageTriggered, () => ({
      error: null,
      isLoading: true,
    })),
    on(luggageEvents.loadLuggageSucceeded, ({ payload }) => ({
      luggage: payload.luggage,
      isLoading: false,
    })),
    on(luggageEvents.loadLuggageFailed, ({ payload }) => ({
      error: payload.error,
      isLoading: false,
    })),
    // Example to associate an array of events with the same reducer function
    // on(
    //   [luggageEvents.loadLuggageTriggered, luggageEvents.loadPassengerWithLuggageTriggered],
    //   () => ({
    //     isLoading: true,
    //     error: null,
    //   }),
    // ),

  ),

  withEventHandlers((store) => ({
    loadLuggage$: store._events.on(luggageEvents.loadLuggageTriggered).pipe(
      switchMap(() =>
        store._luggageClient.find().pipe(
          mapResponse({
            next: (luggage: Luggage[]) => luggageEvents.loadLuggageSucceeded({ luggage }),
            error: (error: unknown) => luggageEvents.loadLuggageFailed({ error: String(error) }),
          }),
        ),
      ),
    ),
  })),

  withMethods((store) => ({
    updateSelected(luggageId: number, selected: boolean): void {
      patchState(store, (state) => ({
        selected: {
          ...state.selected,
          [luggageId]: selected,
        },
      }));
    },
  })),

  withDevtools('luggage'),
);
