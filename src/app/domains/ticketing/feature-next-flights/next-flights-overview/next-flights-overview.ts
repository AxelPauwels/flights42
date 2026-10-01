/* eslint-disable @angular-eslint/prefer-standalone */
import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';

import { NextFlightsState, NextFlightsStore } from './next-flights-store';
import { NormalizedStore } from './normalized-store';
import { Flight } from '@flights/ticketing/data/flight-model';

@Component({
  selector: 'app-next-flights',
  standalone: true,
  templateUrl: './next-flights-overview.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NextFlightsStore],
})
export class NextFlightsOverview {
  private readonly _store = inject(NextFlightsStore);
  protected readonly flights: Signal<Flight[]> = this._store.flightEntities;
  // protected readonly tickets = this._store.entities;
  protected readonly selected: Signal<NextFlightsState['selected']> = this._store.selected;

  private readonly normalizedStore = inject(NormalizedStore);

  constructor() {
    this._store.load();

    console.log('flightsWithPassengers', this.normalizedStore.flightsWithPassengers());
    console.log('passengersWithFlights', this.normalizedStore.passengersWithFlights());
  }

  protected updateSelected(ticketId: number, selected: boolean): void {
    this._store.updateSelected(ticketId, selected);
  }
}
