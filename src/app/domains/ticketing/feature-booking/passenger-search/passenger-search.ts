import { ChangeDetectionStrategy, Component, inject, linkedSignal } from '@angular/core';
import { PassengerStore } from '@flights/ticketing/feature-booking/passenger-search/passenger-store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { form } from '@angular/forms/signals';

@Component({
  selector: 'app-passenger-search',
  imports: [],
  templateUrl: './passenger-search.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassengerSearch {
  private readonly _store = inject(PassengerStore);
  private readonly _snackBar = inject(MatSnackBar);

  protected readonly name = this._store.name;
  protected readonly firstName = this._store.firstName;
  protected readonly passengers = this._store.passengers;
  protected readonly filter = linkedSignal(() => ({
    name: this.name(),
    firstName: this.firstName(),
  }));
  protected readonly filterForm = form(this.filter);

  constructor() {
    this._store.updateFilter(this.filter);
  }

  protected search(): void {
    this._store.updateFilter(this.filter());
  }
}
