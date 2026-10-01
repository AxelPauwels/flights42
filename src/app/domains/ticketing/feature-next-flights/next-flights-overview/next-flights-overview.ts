/* eslint-disable @angular-eslint/prefer-standalone */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NextFlightsStore } from './next-flights-store';
import { NormalizedStore } from './normalized-store';

@Component({
  selector: 'app-next-flights',
  standalone: false,
  templateUrl: './next-flights-overview.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NextFlightsStore],
})
export class NextFlightsOverview {
  private readonly _store = inject(NextFlightsStore);
  protected readonly flights = this._store.entities;
  // protected readonly tickets = this._store.entities;
  protected readonly selected = this._store.selected;

  private readonly normalizedStore = inject(NormalizedStore);

  constructor() {
    this._store.load();

    console.log(
      'flightsWithPassengers',
      this.normalizedStore.flightsWithPassengers(),
    );
    console.log(
      'passengersWithFlights',
      this.normalizedStore.passengersWithFlights(),
    );
  }

  protected updateSelected(ticketId: number, selected: boolean): void {
    this._store.updateSelected(ticketId, selected);
  }
}
