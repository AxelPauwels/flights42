import { JsonPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { Flight } from '../../data/flight';
import { initialAircraft } from '../../data/aircraft';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-flight-search',
  imports: [FormField, JsonPipe, DatePipe],
  templateUrl: './flight-search.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightSearch {
  private readonly http = inject(HttpClient);
  protected readonly filter = signal({
    from: 'Hamburg',
    to: 'Graz',
  });
  protected readonly filterForm = form(this.filter);
  protected readonly flights = signal<Flight[]>([]);
  protected readonly selectedFlight = signal<Flight | null>(null);
  protected search(): void {
    const url = 'https://demo.angulararchitects.io/api/flight';
    const filter = this.filter();
    const params = {
      from: filter.from,
      to: filter.to,
    };
    this.http.get<Flight[]>(url, { params }).subscribe({
      next: (flights) => {
        this.flights.set(flights);
      },
      error: (err) => {
        console.error('Error', err);
      },
    });
  }

  protected select(f: Flight): void {
    this.selectedFlight.set(f);
  }

  createDemoFlight(): void {
    const url = 'https://demo.angulararchitects.io/api/flight';
    const newFlight: Flight = {
      id: 0,
      from: 'Gleisdorf',
      to: 'Graz',
      date: new Date().toISOString(),
      delayed: false,
      delay: 0,
      aircraft: { ...initialAircraft },
      prices: [],
    };

    this.http.post<Flight>(url, newFlight).subscribe({
      next: (flight) => {
        console.debug('New Id: ', flight.id);
      },
      error: (err) => {
        console.error('Error', err);
      },
    });
  }
}
