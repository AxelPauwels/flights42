import { computed, inject } from '@angular/core';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import {
  patchState,
  signalStore,
  type,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { catchError, finalize, firstValueFrom, tap, throwError } from 'rxjs';

import { Flight } from '../../data/flight-model';
import { TicketClient } from '../../data/ticket-client';

interface NextFlightsState {
  selected: Record<number, boolean>;
  isLoading: boolean;
  error: string | null;
}

export const NextFlightsStore = signalStore(
  { providedIn: 'root' },

  withState<NextFlightsState>({
    selected: {},
    isLoading: false,
    error: null,
  }),

  withEntities({ entity: type<Flight>() }),

  withProps(() => ({
    _ticketClient: inject(TicketClient),
  })),

  withComputed(({ entities, selected }) => ({
    selectedTickets: computed(() => entities().filter((ticket) => selected()[ticket.id])),
  })),

  withMethods((store) => ({
    async load(): Promise<void> {
      patchState(store, { isLoading: true, error: null });

      await firstValueFrom(
        store._ticketClient.find().pipe(
          tap((tickets) => {
            patchState(store, setAllEntities(tickets));
          }),
          catchError((error) => {
            patchState(store, {
              error: error.message || 'Error loading tickets',
            });
            return throwError(() => error);
          }),
          finalize(() => {
            patchState(store, { isLoading: false });
          }),
        ),
      );
    },

    updateSelected(ticketId: number, selected: boolean): void {
      patchState(store, (state) => ({
        selected: {
          ...state.selected,
          [ticketId]: selected,
        },
      }));
    },
  })),

  withDevtools('nextFlights'),
);
