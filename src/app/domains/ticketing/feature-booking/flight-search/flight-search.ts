import { JsonPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { Flight } from '../../data/flight';
import { httpResource } from '@angular/common/http';
import { FlightCard } from '../../ui/flight-card/flight-card';

@Component({
  selector: 'app-flight-search',
  imports: [FormField, JsonPipe, DatePipe, FlightCard],
  templateUrl: './flight-search.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightSearch {
  protected readonly filter = signal({
    from: 'Hamburg',
    to: 'Graz',
  });
  protected readonly flightsResource = httpResource<Flight[]>(
    () => {
      const filter = this.filter();
      if (!filter.from || !filter.to) {
        return undefined;
      }

      return {
        url: 'https://demo.angulararchitects.io/api/flight',
        params: {
          from: filter.from,
          to: filter.to,
        },
      };
    },
    { defaultValue: [] },
  );

  // Get resource result and status
  protected readonly flights = this.flightsResource.value;
  protected readonly error = this.flightsResource.error;
  protected readonly isLoading = this.flightsResource.isLoading;

  protected readonly basket = signal<Record<number, boolean>>({
    3: true,
    5: true,
  });

  protected readonly filterForm = form(this.filter);
  protected readonly selectedFlight = signal<Flight | null>(null);
  protected search(): void {
    this.flightsResource.reload();
  }

  protected select(f: Flight): void {
    this.selectedFlight.set(f);
  }

  protected updateBasket(flightId: number, selected: boolean): void {
    this.basket.update((basket) => ({
      ...basket,
      [flightId]: selected,
    }));
  }
}
