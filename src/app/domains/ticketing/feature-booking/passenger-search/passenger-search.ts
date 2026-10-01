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
    // the rxMethod tracks it, and the pipe runs whenever it changes.
    //
    // Saving the rxMethod reference allows us to destroy it later, if needed. But it is not necessary, as the rxMethod will be destroyed when the store is destroyed.
    const rxMethodRef = this._store.updateFilter(this.filter);

    setTimeout(() => {
      rxMethodRef.destroy();
    }, 5000);
  }

  protected search(): void {
    this._store.updateFilter(this.filter()); // Note this is a value, not a signal. The rxMethod can handle both.
  }
}
