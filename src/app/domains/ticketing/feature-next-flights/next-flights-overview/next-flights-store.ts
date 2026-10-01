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
import { entityConfig, setAllEntities, withEntities } from '@ngrx/signals/entities';
import { catchError, finalize, firstValueFrom, tap, throwError } from 'rxjs';

import { Flight } from '../../data/flight-model';
import { TicketClient } from '../../data/ticket-client';
import { Passenger } from '@flights/ticketing/data/passenger';

export interface NextFlightsState {
  selected: Record<number, boolean>;
  isLoading: boolean;
  error: string | null;
}

const flightConfig = entityConfig({
  entity: type<Flight>(),
  selectId: (flight) => flight.id,
  // 'selectId' is to map id when the entity identifier is not id, for example:
  // selectId: (flight) => flight.flightId,
  collection: 'flight',
});

const passengerConfig = entityConfig({
  entity: type<Passenger>(),
  collection: 'passenger',
});

export const NextFlightsStore = signalStore(
  { providedIn: 'root' },

  withState<NextFlightsState>({
    selected: {},
    isLoading: false,
    error: null,
  }),

  // withEntities({ entity: type<Flight>() }),
  withEntities(flightConfig),
  withEntities(passengerConfig),

  withProps(() => ({
    _ticketClient: inject(TicketClient),
  })),

  withComputed(({ flightEntities, selected }) => ({
    selectedTickets: computed(() => flightEntities().filter((ticket) => selected()[ticket.id])),
  })),

  withMethods((store) => ({
    async load(): Promise<void> {
      patchState(store, { isLoading: true, error: null });

      // example to patch flight entities with the config
      await firstValueFrom(
        store._ticketClient.find().pipe(
          tap((tickets) => {
            patchState(store, setAllEntities(tickets, flightConfig));
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
