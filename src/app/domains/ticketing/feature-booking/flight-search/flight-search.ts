import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { Flight } from '../../data/flight';
import { initialAircraft } from '../../data/aircraft';

@Component({
  selector: 'app-flight-search',
  imports: [],
  templateUrl: './flight-search.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightSearch {
  protected readonly filter = signal({
    from: 'Hamburg',
    to: 'Graz',
  });
  protected readonly filterForm = form(this.filter);
  protected readonly flights = signal<Flight[]>([]);
  protected readonly selectedFlight = signal<Flight | null>(null);
  protected search(): void {
    const date = new Date().toISOString();
    this.flights.set([
      {
        id: 1,
        from: this.filter().from,
        to: this.filter().to,
        date,
        delayed: false,
        delay: 0,
        aircraft: { ...initialAircraft },
        prices: [],
      },
      {
        id: 2,
        from: this.filter().from,
        to: this.filter().to,
        date,
        delayed: false,
        delay: 0,
        aircraft: { ...initialAircraft },
        prices: [],
      },
      {
        id: 3,
        from: this.filter().from,
        to: this.filter().to,
        date,
        delayed: false,
        delay: 0,
        aircraft: { ...initialAircraft },
        prices: [],
      },
    ]);
  }

  protected select(f: Flight): void {
    this.selectedFlight.set(f);
  }
}
